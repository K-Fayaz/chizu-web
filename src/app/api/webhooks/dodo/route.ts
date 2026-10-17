import type { NextRequest } from "next/server";
import type { Subscription } from "dodopayments/resources/subscriptions";
import type { LicenseKey } from "dodopayments/resources/license-keys";
import { dodo } from "@/lib/dodo/client";
import { resolvePlanForProductId } from "@/lib/dodo/pricing";
import { getUserByDodoCustomerId } from "@/lib/db/collections/users";
import { upsertSubscriptionFromDodo } from "@/lib/db/collections/subscriptions";
import { upsertLicenseKeyFromDodo } from "@/lib/db/collections/licenseKeys";

async function syncSubscription(data: Subscription) {
  const user = await getUserByDodoCustomerId(data.customer.customer_id);
  if (!user) {
    console.error(
      `Dodo webhook: no user found for customer ${data.customer.customer_id}`,
    );
    return;
  }

  await upsertSubscriptionFromDodo({
    clerkUserId: user.clerkUserId,
    dodoCustomerId: data.customer.customer_id,
    dodoSubscriptionId: data.subscription_id,
    productId: data.product_id,
    plan: resolvePlanForProductId(data.product_id),
    status: data.status,
    currentPeriodEnd: new Date(data.next_billing_date),
    cancelAtNextBillingDate: data.cancel_at_next_billing_date,
  });
}

async function syncLicenseKey(data: LicenseKey) {
  const user = await getUserByDodoCustomerId(data.customer_id);
  if (!user) {
    console.error(
      `Dodo webhook: no user found for customer ${data.customer_id}`,
    );
    return;
  }

  await upsertLicenseKeyFromDodo({
    clerkUserId: user.clerkUserId,
    dodoCustomerId: data.customer_id,
    dodoLicenseKeyId: data.id,
    dodoSubscriptionId: data.subscription_id ?? null,
    key: data.key,
    status: data.status,
    activationsLimit: data.activations_limit ?? null,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.text();

  let event;
  try {
    event = dodo.webhooks.unwrap(body, {
      headers: {
        "webhook-id": request.headers.get("webhook-id") ?? "",
        "webhook-signature": request.headers.get("webhook-signature") ?? "",
        "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      },
    });
  } catch (err) {
    console.error("Dodo webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  switch (event.type) {
    case "subscription.active":
    case "subscription.renewed":
    case "subscription.updated":
    case "subscription.plan_changed":
    case "subscription.unpaused":
    case "subscription.on_hold":
    case "subscription.past_due":
    case "subscription.paused":
    case "subscription.cancelled":
    case "subscription.expired":
    case "subscription.failed":
      await syncSubscription(event.data);
      break;
    case "license_key.created":
      await syncLicenseKey(event.data);
      break;
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
