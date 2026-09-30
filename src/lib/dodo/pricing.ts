import { countActiveFoundingSubscriptions } from "@/lib/db/collections/subscriptions";
import type { PlanTier } from "@/lib/db/collections/subscriptions";

export const FOUNDING_MEMBER_LIMIT = 50;

export async function getCheckoutPlan(): Promise<{
  plan: PlanTier;
  productId: string;
}> {
  const foundingCount = await countActiveFoundingSubscriptions();

  if (foundingCount < FOUNDING_MEMBER_LIMIT) {
    return {
      plan: "founding",
      productId: process.env.DODO_PRODUCT_ID_FOUNDING!,
    };
  }

  return {
    plan: "standard",
    productId: process.env.DODO_PRODUCT_ID_STANDARD!,
  };
}

export function resolvePlanForProductId(productId: string): PlanTier {
  return productId === process.env.DODO_PRODUCT_ID_FOUNDING
    ? "founding"
    : "standard";
}
