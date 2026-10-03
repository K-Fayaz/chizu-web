import { auth } from "@clerk/nextjs/server";
import { PricingCard } from "@/components/landing/PricingCard";
import { getActiveSubscriptionByClerkId } from "@/lib/db/collections/subscriptions";
import { getCheckoutPlan } from "@/lib/dodo/pricing";
import { createDesktopCheckoutSession } from "@/app/dashboard/actions";
import { DesktopCard, primaryButtonClass } from "../DesktopCard";

const PRICE_LABEL = { founding: "$14.99", standard: "$29" } as const;

// Opened by the desktop app's paywall. Checkout returns to
// /desktop/subscribed; the app is polling meanwhile and unlocks on its own.
export default async function DesktopSubscribePage() {
  const { userId } = await auth.protect();

  const subscription = await getActiveSubscriptionByClerkId(userId);
  if (subscription) {
    return (
      <DesktopCard title="You're already subscribed">
        <p>
          Your subscription is active. Return to MapWise — it unlocks within a
          few seconds. You can close this tab.
        </p>
      </DesktopCard>
    );
  }

  const { plan } = await getCheckoutPlan();

  return (
    <PricingCard
      cta={
        <form action={createDesktopCheckoutSession}>
          <button type="submit" className={`mt-6 ${primaryButtonClass}`}>
            Subscribe — {PRICE_LABEL[plan]}/mo
          </button>
        </form>
      }
    />
  );
}
