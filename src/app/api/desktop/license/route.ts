import { revokeSessionByTokenHash } from "@/lib/db/collections/desktopSessions";
import { getActiveSubscriptionByClerkId } from "@/lib/db/collections/subscriptions";
import { getUserByClerkId } from "@/lib/db/collections/users";
import { authenticateDesktopRequest, unauthorized } from "@/lib/desktop/auth";
import { signLicense } from "@/lib/desktop/license";

// The desktop app's refresh call: a freshly signed license for this device, plus the
// profile and onboarding state it shows. Called on launch, every few hours,
// and repeatedly while waiting for a checkout to complete.
export async function POST(request: Request) {
  const auth = await authenticateDesktopRequest(request);
  if (!auth) return unauthorized();
  const { session, tokenHash } = auth;

  // The Clerk user was deleted (users doc removed by the Clerk webhook) --
  // nothing left to license, so retire the session too.
  const user = await getUserByClerkId(session.clerkUserId);
  if (!user) {
    await revokeSessionByTokenHash(tokenHash);
    return unauthorized();
  }

  const subscription = await getActiveSubscriptionByClerkId(user.clerkUserId);
  const { license, expiresAt } = await signLicense({
    clerkUserId: user.clerkUserId,
    deviceId: session.deviceId,
    entitlement: subscription ? "full" : "none",
    plan: subscription?.plan ?? null,
  });

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return Response.json({
    license,
    expiresAt: expiresAt.toISOString(),
    user: {
      name: name || null,
      email: user.email,
      imageUrl: user.imageUrl,
    },
    walkthroughCompleted: Boolean(user.walkthroughCompletedAt),
  });
}
