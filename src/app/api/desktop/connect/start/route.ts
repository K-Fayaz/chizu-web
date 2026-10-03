import { MongoServerError } from "mongodb";
import { insertConnectCode } from "@/lib/db/collections/desktopConnectCodes";
import {
  generateDeviceCode,
  generateUserCode,
  hashSecret,
} from "@/lib/desktop/auth";
import { clientIp, rateLimit, tooManyRequests } from "@/lib/desktop/rateLimit";
import { badRequest, readJsonObject, stringField } from "@/lib/desktop/request";

const CODE_TTL_SECONDS = 10 * 60;
const POLL_INTERVAL_SECONDS = 3;

// Step 1 of connecting mappy: hands back a secret deviceCode for mappy to
// poll with, and a browser URL carrying the public userCode for the user to
// approve while signed in.
export async function POST(request: Request) {
  // Per client, plus a global ceiling so connect codes can't pile up in the
  // database even if the per-client key is somehow spread across many IPs.
  const perClient = rateLimit(`connect-start:${clientIp(request)}`, 10, 10 * 60_000);
  if (!perClient.ok) return tooManyRequests(perClient.retryAfterSeconds);
  const global = rateLimit("connect-start:all", 500, 10 * 60_000);
  if (!global.ok) return tooManyRequests(global.retryAfterSeconds);

  const body = await readJsonObject(request);
  const deviceId = stringField(body?.deviceId, 64);
  const deviceName = stringField(body?.deviceName, 100);
  const platform = stringField(body?.platform, 32);
  if (!deviceId || !deviceName || !platform) {
    return badRequest("deviceId, deviceName and platform are required");
  }

  const deviceCode = generateDeviceCode();
  const expiresAt = new Date(Date.now() + CODE_TTL_SECONDS * 1000);

  // userCode is short enough that a collision with a live code is possible,
  // if unlikely -- the unique index catches it and we just draw again.
  for (let attempt = 0; attempt < 3; attempt++) {
    const userCode = generateUserCode();
    try {
      await insertConnectCode({
        userCode,
        deviceCodeHash: hashSecret(deviceCode),
        deviceId,
        deviceName,
        platform,
        expiresAt,
      });
    } catch (err) {
      if (err instanceof MongoServerError && err.code === 11000) continue;
      throw err;
    }

    const verificationUrl = new URL(
      `/desktop/connect?code=${userCode}`,
      process.env.NEXT_PUBLIC_APP_URL,
    );

    return Response.json({
      deviceCode,
      userCode,
      verificationUrl: verificationUrl.toString(),
      interval: POLL_INTERVAL_SECONDS,
      expiresIn: CODE_TTL_SECONDS,
    });
  }

  return Response.json({ error: "could_not_allocate_code" }, { status: 503 });
}
