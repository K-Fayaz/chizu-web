import { getDb } from "@/lib/db/client";

// One in-flight "connect this desktop" attempt. The short userCode travels in
// the browser URL and can only approve; the long deviceCode never leaves
// mappy (stored here only as a hash) and is what collects the session token.
export type ConnectCodeStatus = "pending" | "approved" | "consumed";

export type DesktopConnectCodeDoc = {
  userCode: string;
  deviceCodeHash: string;
  status: ConnectCodeStatus;
  clerkUserId: string | null;
  deviceId: string;
  deviceName: string;
  platform: string;
  createdAt: Date;
  expiresAt: Date;
};

let indexesEnsured: Promise<unknown> | undefined;

async function desktopConnectCodesCollection() {
  const db = await getDb();
  const collection = db.collection<DesktopConnectCodeDoc>(
    "desktopConnectCodes",
  );

  indexesEnsured ??= Promise.all([
    collection.createIndex({ userCode: 1 }, { unique: true }),
    collection.createIndex({ deviceCodeHash: 1 }, { unique: true }),
    // Mongo's TTL sweep runs roughly once a minute, so every read below
    // still checks expiresAt itself rather than relying on deletion.
    collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
  ]);
  await indexesEnsured;

  return collection;
}

export async function insertConnectCode(data: {
  userCode: string;
  deviceCodeHash: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  expiresAt: Date;
}) {
  const codes = await desktopConnectCodesCollection();
  await codes.insertOne({
    ...data,
    status: "pending",
    clerkUserId: null,
    createdAt: new Date(),
  });
}

export async function getLiveConnectCodeByUserCode(userCode: string) {
  const codes = await desktopConnectCodesCollection();
  return codes.findOne({ userCode, expiresAt: { $gt: new Date() } });
}

export async function getLiveConnectCodeByDeviceCodeHash(
  deviceCodeHash: string,
) {
  const codes = await desktopConnectCodesCollection();
  return codes.findOne({ deviceCodeHash, expiresAt: { $gt: new Date() } });
}

export async function approveConnectCode(
  userCode: string,
  clerkUserId: string,
) {
  const codes = await desktopConnectCodesCollection();
  const result = await codes.updateOne(
    { userCode, status: "pending", expiresAt: { $gt: new Date() } },
    { $set: { status: "approved", clerkUserId } },
  );
  return result.modifiedCount === 1;
}

// Atomic approved -> consumed flip, so two racing polls can't both mint a
// session from the same code.
export async function consumeApprovedConnectCode(deviceCodeHash: string) {
  const codes = await desktopConnectCodesCollection();
  return codes.findOneAndUpdate(
    { deviceCodeHash, status: "approved", expiresAt: { $gt: new Date() } },
    { $set: { status: "consumed" } },
  );
}
