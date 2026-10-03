import { setWalkthroughCompleted } from "@/lib/db/collections/users";
import { authenticateDesktopRequest, unauthorized } from "@/lib/desktop/auth";

export async function POST(request: Request) {
  const auth = await authenticateDesktopRequest(request);
  if (!auth) return unauthorized();

  await setWalkthroughCompleted(auth.session.clerkUserId);
  return new Response(null, { status: 204 });
}
