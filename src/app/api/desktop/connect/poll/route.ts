import {
  consumeApprovedConnectCode,
  getLiveConnectCodeByDeviceCodeHash,
} from "@/lib/db/collections/desktopConnectCodes";
import { upsertDesktopSession } from "@/lib/db/collections/desktopSessions";
import { generateSessionToken, hashSecret } from "@/lib/desktop/auth";
import { rateLimit, tooManyRequests } from "@/lib/desktop/rateLimit";
import { badRequest, readJsonObject, stringField } from "@/lib/desktop/request";

// Step 2: the desktop app polls with its deviceCode until the user approves in the
// browser. The session token is handed out exactly once -- the code flips to
// "consumed" atomically, and any later poll for it reads as expired.
export async function POST(request: Request) {
  // A global ceiling bounds database load from requests with made-up codes
  // (guessing one is hopeless -- they're 256-bit random).
  const global = rateLimit("connect-poll:all", 3000, 60_000);
  if (!global.ok) return tooManyRequests(global.retryAfterSeconds);

  const body = await readJsonObject(request);
  const deviceCode = stringField(body?.deviceCode, 128);
  if (!deviceCode) return badRequest("deviceCode is required");

  const deviceCodeHash = hashSecret(deviceCode);

  // Limited per code, not per IP: several people behind one office network
  // signing in at once mustn't slow each other down. The desktop app polls every 3s
  // (20/min); the rest is headroom for retries.
  const perCode = rateLimit(`connect-poll:${deviceCodeHash}`, 40, 60_000);
  if (!perCode.ok) return tooManyRequests(perCode.retryAfterSeconds);

  const approved = await consumeApprovedConnectCode(deviceCodeHash);
  if (approved?.clerkUserId) {
    const sessionToken = generateSessionToken();
    await upsertDesktopSession({
      clerkUserId: approved.clerkUserId,
      deviceId: approved.deviceId,
      deviceName: approved.deviceName,
      platform: approved.platform,
      tokenHash: hashSecret(sessionToken),
    });
    return Response.json({ status: "approved", sessionToken });
  }

  const code = await getLiveConnectCodeByDeviceCodeHash(deviceCodeHash);
  if (!code || code.status === "consumed") {
    return Response.json({ status: "expired" });
  }
  return Response.json({ status: "pending" });
}
