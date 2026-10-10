import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { DesktopCard, primaryButtonClass } from "../DesktopCard";

// Dodo's checkout return_url for checkouts started from the desktop app.
// Access itself is granted by the Dodo webhook, not this page -- the app
// unlocks on its next license poll once that lands.
export default async function DesktopSubscribedPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await auth.protect();
  const { status } = await searchParams;

  if (status === "failed") {
    return (
      <DesktopCard title="Your payment didn't go through">
        <p>No charge was made. You can try again with the same or a different card.</p>
        <Link href="/desktop/subscribe" className={primaryButtonClass}>
          Try again
        </Link>
      </DesktopCard>
    );
  }

  if (status === "active") {
    return (
      <DesktopCard title="Payment received 🎉">
        <p>
          Thanks for subscribing! Return to Chizu — it unlocks automatically
          within a few seconds. You can close this tab.
        </p>
      </DesktopCard>
    );
  }

  return (
    <DesktopCard title="Confirming your payment">
      <p>
        Return to Chizu — it unlocks automatically as soon as your payment is
        confirmed. You can close this tab.
      </p>
    </DesktopCard>
  );
}
