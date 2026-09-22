import { getDb } from "@/lib/db/client";

export type UserDoc = {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

let indexesEnsured: Promise<unknown> | undefined;

async function usersCollection() {
  const db = await getDb();
  const collection = db.collection<UserDoc>("users");

  indexesEnsured ??= collection.createIndex(
    { clerkUserId: 1 },
    { unique: true },
  );
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
