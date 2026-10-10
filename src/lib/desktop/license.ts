import { randomUUID } from "node:crypto";
import { importPKCS8, SignJWT, type CryptoKey } from "jose";
import type { PlanTier } from "@/lib/db/collections/subscriptions";

// Signed licenses the desktop app verifies offline with the public half of this key
// (mappy/src-tauri/keys/license-public-<kid>.pem). exp is the hard ceiling of
// the offline window: past 7 days without a refresh, the desktop app drops to
// restricted mode. See mappy/.claude/plans/desktop-licensing-plan.md §3.
const LICENSE_TTL_SECONDS = 7 * 24 * 60 * 60;

export type Entitlement = "full" | "none";

let signingKey: Promise<CryptoKey> | undefined;

function getSigningKey() {
  const encoded = process.env.DESKTOP_LICENSE_PRIVATE_KEY;
  if (!encoded) {
    throw new Error("Missing DESKTOP_LICENSE_PRIVATE_KEY environment variable");
  }
  // Stored base64-encoded so the multi-line PEM fits on one .env line.
  signingKey ??= importPKCS8(
    Buffer.from(encoded, "base64").toString("utf8"),
    "EdDSA",
  );
  return signingKey;
}

function getKeyId() {
  const kid = process.env.DESKTOP_LICENSE_KID;
  if (!kid) {
    throw new Error("Missing DESKTOP_LICENSE_KID environment variable");
  }
  return kid;
}

export async function signLicense(data: {
  clerkUserId: string;
  deviceId: string;
  entitlement: Entitlement;
  plan: PlanTier | null;
}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + LICENSE_TTL_SECONDS;

  const license = await new SignJWT({
    did: data.deviceId,
    lid: randomUUID(),
    ent: data.entitlement,
    plan: data.plan,
  })
    .setProtectedHeader({ alg: "EdDSA", kid: getKeyId(), typ: "JWT" })
    .setSubject(data.clerkUserId)
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .sign(await getSigningKey());

  return { license, expiresAt: new Date(expiresAt * 1000) };
}
