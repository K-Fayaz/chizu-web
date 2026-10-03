import { getDb } from "@/lib/db/client";

export type UserDoc = {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  dodoCustomerId: string | null;
  // Set once the desktop app's editor walkthrough is finished or skipped.
  // Kept server-side so it doesn't replay on a second machine.
  walkthroughCompletedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

let indexesEnsured: Promise<unknown> | undefined;

async function usersCollection() {
  const db = await getDb();
  const collection = db.collection<UserDoc>("users");

  indexesEnsured ??= Promise.all([
    collection.createIndex({ clerkUserId: 1 }, { unique: true }),
    collection.createIndex(
      { dodoCustomerId: 1 },
      { unique: true, sparse: true },
    ),
  ]);
  await indexesEnsured;

  return collection;
}

export async function upsertUserFromClerk(data: {
  id: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}) {
  const users = await usersCollection();
  const now = new Date();

  await users.updateOne(
    { clerkUserId: data.id },
    {
      $set: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        imageUrl: data.imageUrl,
        updatedAt: now,
      },
      $setOnInsert: {
        clerkUserId: data.id,
        dodoCustomerId: null,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function deleteUserByClerkId(clerkUserId: string) {
  const users = await usersCollection();
  await users.deleteOne({ clerkUserId });
}

export async function getUserByClerkId(clerkUserId: string) {
  const users = await usersCollection();
  return users.findOne({ clerkUserId });
}

export async function getUserByDodoCustomerId(dodoCustomerId: string) {
  const users = await usersCollection();
  return users.findOne({ dodoCustomerId });
}

export async function setDodoCustomerId(
  clerkUserId: string,
  dodoCustomerId: string,
) {
  const users = await usersCollection();
  const result = await users.updateOne(
    { clerkUserId },
    { $set: { dodoCustomerId, updatedAt: new Date() } },
  );

  if (result.matchedCount === 0) {
    throw new Error(
      `setDodoCustomerId: no user found for clerkUserId ${clerkUserId} — Clerk webhook may not have synced this user yet`,
    );
  }
}

export async function setWalkthroughCompleted(clerkUserId: string) {
  const users = await usersCollection();
  const now = new Date();
  await users.updateOne(
    { clerkUserId, walkthroughCompletedAt: { $exists: false } },
    { $set: { walkthroughCompletedAt: now, updatedAt: now } },
  );
}
