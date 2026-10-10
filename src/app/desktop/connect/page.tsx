import Image from "next/image";
import { SignOutButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getLiveConnectCodeByUserCode } from "@/lib/db/collections/desktopConnectCodes";
import { approveDesktopConnection } from "../actions";
import { DesktopCard, primaryButtonClass } from "../DesktopCard";

const USER_CODE_PATTERN = /^[A-Z2-9]{4}-[A-Z2-9]{4}$/;

function describeAge(createdAt: Date) {
  const minutes = Math.floor((Date.now() - createdAt.getTime()) / 60_000);
  if (minutes < 1) return "just now";
  return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
}

// Opened by the desktop app's "Sign in" button. Signing in (if needed) and
// clicking Connect approves the code; the app, polling in the background,
// then picks up its session token and unlocks.
export default async function DesktopConnectPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { userId } = await auth.protect();
  const { code: rawCode } = await searchParams;
  const code = rawCode?.trim().toUpperCase();

  const connectCode =
    code && USER_CODE_PATTERN.test(code)
      ? await getLiveConnectCodeByUserCode(code)
      : null;

  // Approved/consumed by someone else reads the same as expired -- never
  // reveal another account's pending connection.
  if (
    !code ||
    !connectCode ||
    (connectCode.status !== "pending" && connectCode.clerkUserId !== userId)
  ) {
    return (
      <DesktopCard title="This link has expired">
        <p>
          Connection links only work once and expire after 10 minutes. Go back
          to Chizu and click <strong>Sign in</strong> again to get a new one.
        </p>
      </DesktopCard>
    );
  }

  if (connectCode.status !== "pending") {
    return (
      <DesktopCard title="You're connected">
        <p>
          <strong>{connectCode.deviceName}</strong> is now signed in to your
          account. You can close this tab and return to Chizu.
        </p>
      </DesktopCard>
    );
  }

  const user = await currentUser();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const connectUrl = `/desktop/connect?code=${encodeURIComponent(code)}`;

  return (
    <DesktopCard title="Connect Chizu on this computer?">
      <div className="flex items-center gap-3 rounded-xl bg-[#16140f]/[0.03] p-3">
        {user?.imageUrl && (
          <Image
            src={user.imageUrl}
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
          />
        )}
        <div>
          {name && <p className="font-medium text-[#16140f]">{name}</p>}
          <p>{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>

      <p>
        A computer calling itself <strong>{connectCode.deviceName}</strong> (
        {connectCode.platform}) asked to sign in to this account{" "}
        {describeAge(connectCode.createdAt)}.
      </p>

      {/* Device-code phishing guard: someone can start a sign-in on their own
          machine and send this link to you. The device name above is chosen
          by whoever started it, so it proves nothing on its own. */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-amber-900">
        Only continue if <strong>you just clicked Sign in in Chizu</strong>{" "}
        on your own computer and it&apos;s showing the code{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5 font-mono font-semibold">
          {code}
        </code>
        . If someone sent you this link, close this tab — connecting would give
        them access to your subscription.
      </div>

      <form action={approveDesktopConnection}>
        <input type="hidden" name="code" value={code} />
        <button type="submit" className={primaryButtonClass}>
          Connect this device
        </button>
      </form>

      <p className="text-center text-xs">
        Not you?{" "}
        <SignOutButton redirectUrl={connectUrl}>
          <button type="button" className="font-medium text-brand underline">
            Switch account
          </button>
        </SignOutButton>
      </p>
    </DesktopCard>
  );
}
