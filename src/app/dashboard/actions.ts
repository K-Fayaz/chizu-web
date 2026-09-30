"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { dodo } from "@/lib/dodo/client";
import { getCheckoutPlan } from "@/lib/dodo/pricing";
import {
  getUserByClerkId,
  setDodoCustomerId,
  upsertUserFromClerk,
} from "@/lib/db/collections/users";

async function getOrCreateDodoCustomerId(clerkUserId: string) {
  let userDoc = await getUserByClerkId(clerkUserId);
  if (userDoc?.dodoCustomerId) {
    return userDoc.dodoCustomerId;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error("No email on file for the current user");
  }

  if (!userDoc) {
    // The Clerk webhook may not have synced this user yet (delivery lag or
    // misconfiguration) — self-heal so checkout isn't blocked on it.
    await upsertUserFromClerk({
      id: clerkUserId,
      email,
      firstName: user?.firstName ?? null,
      lastName: user?.lastName ?? null,
      imageUrl: user?.imageUrl ?? null,
    });
    userDoc = await getUserByClerkId(clerkUserId);
  }

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const customer = await dodo.customers.create({ email, name: name || email });

  await setDodoCustomerId(clerkUserId, customer.customer_id);
  return customer.customer_id;
}

export async function createCheckoutSession() {
  const { userId } = await auth.protect();

  const dodoCustomerId = await getOrCreateDodoCustomerId(userId);
  const { plan, productId } = await getCheckoutPlan();

  const session = await dodo.checkoutSessions.create({
    product_cart: [{ product_id: productId, quantity: 1 }],
    customer: { customer_id: dodoCustomerId },
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    metadata: { clerkUserId: userId, plan },
  });

  if (!session.checkout_url) {
    throw new Error("Dodo Payments did not return a checkout URL");
  }

  redirect(session.checkout_url);
}

export async function createBillingPortalSession() {
  const { userId } = await auth.protect();

  const userDoc = await getUserByClerkId(userId);
  if (!userDoc?.dodoCustomerId) {
    redirect("/dashboard");
  }

  const session = await dodo.customers.customerPortal.create(
    userDoc.dodoCustomerId,
    { return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard` },
  );

  redirect(session.link);
}
