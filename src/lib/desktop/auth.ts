import { createHash, randomBytes, randomInt } from "node:crypto";
import { touchActiveSessionByTokenHash } from "@/lib/db/collections/desktopSessions";

// Desktop app requests authenticate with their own session token, not
// Clerk cookies -- the desktop app never holds a Clerk session.

// No 0/O/1/I/L, so a code read off a screen can't be mistyped.
const USER_CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function hashSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function generateSessionToken() {
  return `mps_${randomBytes(32).toString("base64url")}`;
}

export function generateDeviceCode() {
  return randomBytes(32).toString("base64url");
}

// Formatted XXXX-XXXX.
export function generateUserCode() {
  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i === 4) code += "-";
    code += USER_CODE_ALPHABET[randomInt(USER_CODE_ALPHABET.length)];
  }
  return code;
}

function bearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim() || null;
}

// Returns the live session (with lastSeenAt bumped), or null if the token is
// missing, unknown or revoked.
export async function authenticateDesktopRequest(request: Request) {
  const token = bearerToken(request);
  if (!token) return null;

  const tokenHash = hashSecret(token);
  const session = await touchActiveSessionByTokenHash(tokenHash);
  return session ? { session, tokenHash } : null;
}

export function unauthorized() {
  return Response.json({ error: "unauthorized" }, { status: 401 });
}
