import { currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId, upsertUserFromClerk } from "@/lib/db/collections/users";

// The Clerk webhook may not have synced this user yet (delivery lag, or the
// ngrok URL changed) — self-heal from the signed-in Clerk session so flows
// that need the users doc aren't blocked on it.
export async function ensureUserDoc(clerkUserId: string) {
  const existing = await getUserByClerkId(clerkUserId);
  if (existing) return existing;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    throw new Error("No email on file for the current user");
  }

  await upsertUserFromClerk({
    id: clerkUserId,
    email,
    firstName: user?.firstName ?? null,
    lastName: user?.lastName ?? null,
    imageUrl: user?.imageUrl ?? null,
  });

  const created = await getUserByClerkId(clerkUserId);
  if (!created) {
    throw new Error(`ensureUserDoc: failed to create users doc for ${clerkUserId}`);
  }
  return created;
}
