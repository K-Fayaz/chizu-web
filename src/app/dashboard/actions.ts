"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getDodo } from "@/lib/dodo/client";
import { getCheckoutPlan } from "@/lib/dodo/pricing";
import { ensureUserDoc } from "@/lib/clerk/ensureUserDoc";
import { getUserByClerkId, setDodoCustomerId } from "@/lib/db/collections/users";
import { revokeSessionForUser } from "@/lib/db/collections/desktopSessions";

async function getOrCreateDodoCustomerId(clerkUserId: string) {
  const userDoc = await ensureUserDoc(clerkUserId);
  if (userDoc.dodoCustomerId) {
    return userDoc.dodoCustomerId;
  }

  const email = userDoc.email;
  if (!email) {
    throw new Error("No email on file for the current user");
  }

  const name = [userDoc.firstName, userDoc.lastName].filter(Boolean).join(" ");
  const customer = await getDodo().customers.create({ email, name: name || email });

  await setDodoCustomerId(clerkUserId, customer.customer_id);
  return customer.customer_id;
}

// Fixed return paths only (never caller-supplied), so a checkout can't be
// turned into an open redirect.
async function startCheckout(returnPath: "/dashboard" | "/desktop/subscribed") {
  const { userId } = await auth.protect();

  const dodoCustomerId = await getOrCreateDodoCustomerId(userId);
  const { plan, productId } = await getCheckoutPlan();

  const session = await getDodo().checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer: { customer_id: dodoCustomerId },
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}${returnPath}`,
    metadata: { clerkUserId: userId, plan },
  });

  if (!session.checkout_url) {
    throw new Error("Dodo Payments did not return a checkout URL");
  }

  redirect(session.checkout_url);
}

export async function createCheckoutSession() {
  await startCheckout("/dashboard");
}

// Started from the desktop app's paywall — lands on a "return to Chizu"
// page instead of the dashboard.
export async function createDesktopCheckoutSession() {
  await startCheckout("/desktop/subscribed");
}

export async function createBillingPortalSession() {
  const { userId } = await auth.protect();

  const userDoc = await getUserByClerkId(userId);
  if (!userDoc?.dodoCustomerId) {
    redirect("/dashboard");
  }

  const session = await getDodo().customers.customerPortal.create(
    userDoc.dodoCustomerId,
    { return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
  );

  redirect(session.link);
}

export async function revokeDesktopDevice(formData: FormData) {
  const { userId } = await auth.protect();
  const sessionId = formData.get("sessionId");
  if (typeof sessionId === "string") {
    await revokeSessionForUser(userId, sessionId);
  }
  revalidatePath("/dashboard");
}
