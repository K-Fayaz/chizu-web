import { ObjectId } from "mongodb";
import { getDb } from "@/lib/db/client";

// One row per connected desktop install -- doubles as the user's device list.
// Only a SHA-256 hash of the session token is stored, never the token itself.
export type DesktopSessionDoc = {
  tokenHash: string;
  clerkUserId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  createdAt: Date;
  lastSeenAt: Date;
  revokedAt: Date | null;
};

// A session nobody has used for this long stops working (a lost or
// abandoned computer), and drops off the dashboard's device list. Mappy
// refreshes every few hours while running, so only machines that have been
// switched off or offline this long are affected -- they just sign in again.
const SESSION_IDLE_EXPIRY_MS = 90 * 24 * 60 * 60 * 1000;

function activeSince() {
  return new Date(Date.now() - SESSION_IDLE_EXPIRY_MS);
}

let indexesEnsured: Promise<unknown> | undefined;

async function desktopSessionsCollection() {
  const db = await getDb();
  const collection = db.collection<DesktopSessionDoc>("desktopSessions");

  indexesEnsured ??= Promise.all([
    collection.createIndex({ tokenHash: 1 }, { unique: true }),
    collection.createIndex({ clerkUserId: 1, deviceId: 1 }, { unique: true }),
  ]);
  await indexesEnsured;

  return collection;
}

// Reconnecting the same machine replaces its session (new token, revocation
// cleared) instead of piling up duplicate device rows.
export async function upsertDesktopSession(data: {
  clerkUserId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  tokenHash: string;
}) {
  const sessions = await desktopSessionsCollection();
  const now = new Date();

  await sessions.updateOne(
    { clerkUserId: data.clerkUserId, deviceId: data.deviceId },
    {
      $set: {
        tokenHash: data.tokenHash,
        deviceName: data.deviceName,
        platform: data.platform,
        lastSeenAt: now,
        revokedAt: null,
      },
      $setOnInsert: {
        clerkUserId: data.clerkUserId,
        deviceId: data.deviceId,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

// Looks up a live (not revoked, not idle-expired) session and bumps
// lastSeenAt in the same round trip.
export async function touchActiveSessionByTokenHash(tokenHash: string) {
  const sessions = await desktopSessionsCollection();
  return sessions.findOneAndUpdate(
    { tokenHash, revokedAt: null, lastSeenAt: { $gte: activeSince() } },
    { $set: { lastSeenAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function revokeSessionByTokenHash(tokenHash: string) {
  const sessions = await desktopSessionsCollection();
  await sessions.updateOne(
    { tokenHash, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}

// Device list for the dashboard, most recently used first.
export async function listActiveSessionsByClerkId(clerkUserId: string) {
  const sessions = await desktopSessionsCollection();
  return sessions
    .find({ clerkUserId, revokedAt: null, lastSeenAt: { $gte: activeSince() } })
    .sort({ lastSeenAt: -1 })
    .toArray();
}

// Scoped to the owner, so one user can't revoke another's device by id.
export async function revokeSessionForUser(
  clerkUserId: string,
  sessionId: string,
) {
  if (!ObjectId.isValid(sessionId)) return;
  const sessions = await desktopSessionsCollection();
  await sessions.updateOne(
    { _id: new ObjectId(sessionId), clerkUserId, revokedAt: null },
    { $set: { revokedAt: new Date() } },
  );
}
