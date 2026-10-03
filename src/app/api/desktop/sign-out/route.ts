import { revokeSessionByTokenHash } from "@/lib/db/collections/desktopSessions";
import { authenticateDesktopRequest, unauthorized } from "@/lib/desktop/auth";

// Revokes only the calling device's session. Mappy wipes its local
// credentials regardless of the response, so this is best-effort.
export async function POST(request: Request) {
  const auth = await authenticateDesktopRequest(request);
  if (!auth) return unauthorized();

  await revokeSessionByTokenHash(auth.tokenHash);
  return new Response(null, { status: 204 });
}
