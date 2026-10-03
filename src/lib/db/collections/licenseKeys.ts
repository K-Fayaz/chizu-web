import { getDb } from "@/lib/db/client";

// Dormant: Dodo license keys are still synced here by the Dodo webhook
// (license_key.created), but nothing grants access from them anymore and the
// dashboard no longer shows them. Desktop access comes from signed licenses
// tied to the subscription (src/lib/desktop/, mappy's licensing plan).
// Kept rather than deleted so the data is there if keys are ever needed again.
import type { LicenseKeyStatus } from "dodopayments/resources/license-keys";

export type LicenseKeyDoc = {
  clerkUserId: string;
  dodoCustomerId: string;
  dodoLicenseKeyId: string;
  dodoSubscriptionId: string | null;
  key: string;
  status: LicenseKeyStatus;
  activationsLimit: number | null;
  createdAt: Date;
  updatedAt: Date;
};

let indexesEnsured: Promise<unknown> | undefined;

async function licenseKeysCollection() {
  const db = await getDb();
  const collection = db.collection<LicenseKeyDoc>("licenseKeys");

  indexesEnsured ??= Promise.all([
    collection.createIndex({ dodoLicenseKeyId: 1 }, { unique: true }),
    collection.createIndex({ clerkUserId: 1 }),
  ]);
  await indexesEnsured;

  return collection;
}

export async function upsertLicenseKeyFromDodo(data: {
  clerkUserId: string;
  dodoCustomerId: string;
  dodoLicenseKeyId: string;
  dodoSubscriptionId: string | null;
  key: string;
  status: LicenseKeyStatus;
  activationsLimit: number | null;
}) {
  const licenseKeys = await licenseKeysCollection();
  const now = new Date();

  await licenseKeys.updateOne(
    { dodoLicenseKeyId: data.dodoLicenseKeyId },
    {
      $set: {
        clerkUserId: data.clerkUserId,
        dodoCustomerId: data.dodoCustomerId,
        dodoSubscriptionId: data.dodoSubscriptionId,
        key: data.key,
        status: data.status,
        activationsLimit: data.activationsLimit,
        updatedAt: now,
      },
      $setOnInsert: {
        dodoLicenseKeyId: data.dodoLicenseKeyId,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function getLicenseKeyByClerkId(clerkUserId: string) {
  const licenseKeys = await licenseKeysCollection();
  return licenseKeys.findOne({ clerkUserId });
}
