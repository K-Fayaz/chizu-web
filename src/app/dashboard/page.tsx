import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getActiveSubscriptionByClerkId } from "@/lib/db/collections/subscriptions";
import { getLicenseKeyByClerkId } from "@/lib/db/collections/licenseKeys";
import { PricingCard } from "@/components/landing/PricingCard";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/dodo/pricing";
import { createBillingPortalSession, createCheckoutSession } from "./actions";
import { CheckoutStatusBanner } from "./CheckoutStatusBanner";
import { DevicesCard } from "./DevicesCard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { userId } = await auth.protect();
  const user = await currentUser();
  const { status } = await searchParams;
  const checkoutStatus = status === "active" || status === "failed" ? status : undefined;

  const [subscription, licenseKey] = await Promise.all([
    getActiveSubscriptionByClerkId(userId),
    getLicenseKeyByClerkId(userId),
  ]);

  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <div className="min-h-screen bg-white px-6 py-10 text-[#16140f]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <UserButton />
        </div>

        <div className="mt-8 flex items-center gap-4 rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
          {user?.imageUrl && (
            <Image
              src={user.imageUrl}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14 rounded-full"
            />
          )}
          <div>
            {name && <p className="font-semibold">{name}</p>}
            <p className="text-sm text-[#16140f]/60">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <CheckoutStatusBanner
            status={checkoutStatus}
            foundingLimit={FOUNDING_MEMBER_LIMIT}
          />

          {subscription ? (
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
              <h2 className="text-lg font-semibold">Subscription</h2>
              <p className="mt-2 text-sm text-[#16140f]/70">
                Plan:{" "}
                <span className="font-medium">{subscription.plan}</span> ·
                Status:{" "}
                <span className="font-medium">{subscription.status}</span>
                {subscription.cancelAtNextBillingDate &&
                  " (cancels at period end)"}
              </p>
              {licenseKey && (
                <p className="mt-2 text-sm text-[#16140f]/70">
                  License key:{" "}
                  <code className="rounded bg-[#16140f]/5 px-1.5 py-0.5">
                    {licenseKey.key}
                  </code>
                </p>
              )}
              <form action={createBillingPortalSession} className="mt-4">
                <button
                  type="submit"
                  className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
                >
                  Manage billing
                </button>
              </form>
            </div>
          ) : (
            <PricingCard
              cta={
                <form action={createCheckoutSession}>
                  <button
                    type="submit"
                    className="mt-6 flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-brand/30 transition hover:bg-brand-dark"
                  >
                    Subscribe — $14.99/mo
                  </button>
                </form>
              }
            />
          )}
        </div>

        <div className="mt-6">
          <DevicesCard clerkUserId={userId} />
        </div>
      </div>
    </div>
  );
}
