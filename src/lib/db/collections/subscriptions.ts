import { getDb } from "@/lib/db/client";
import type { SubscriptionStatus } from "dodopayments/resources/subscriptions";

export type PlanTier = "founding" | "standard";

export type SubscriptionDoc = {
  clerkUserId: string;
  dodoCustomerId: string;
  dodoSubscriptionId: string;
  productId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtNextBillingDate: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const ACTIVE_STATUSES: SubscriptionStatus[] = ["active", "past_due"];

let indexesEnsured: Promise<unknown> | undefined;

async function subscriptionsCollection() {
  const db = await getDb();
  const collection = db.collection<SubscriptionDoc>("subscriptions");

  indexesEnsured ??= Promise.all([
    collection.createIndex({ dodoSubscriptionId: 1 }, { unique: true }),
    collection.createIndex({ clerkUserId: 1 }),
  ]);
  await indexesEnsured;

  return collection;
}

export async function upsertSubscriptionFromDodo(data: {
  clerkUserId: string;
  dodoCustomerId: string;
  dodoSubscriptionId: string;
  productId: string;
  plan: PlanTier;
  status: SubscriptionStatus;
  currentPeriodEnd: Date;
  cancelAtNextBillingDate: boolean;
}) {
  const subscriptions = await subscriptionsCollection();
  const now = new Date();

  await subscriptions.updateOne(
    { dodoSubscriptionId: data.dodoSubscriptionId },
    {
      $set: {
        clerkUserId: data.clerkUserId,
        dodoCustomerId: data.dodoCustomerId,
        productId: data.productId,
        plan: data.plan,
        status: data.status,
        currentPeriodEnd: data.currentPeriodEnd,
        cancelAtNextBillingDate: data.cancelAtNextBillingDate,
        updatedAt: now,
      },
      $setOnInsert: {
        dodoSubscriptionId: data.dodoSubscriptionId,
        createdAt: now,
      },
    },
    { upsert: true },
  );
}

export async function getActiveSubscriptionByClerkId(clerkUserId: string) {
  const subscriptions = await subscriptionsCollection();
  return subscriptions.findOne({
    clerkUserId,
    status: { $in: ACTIVE_STATUSES },
  });
}

export async function countActiveFoundingSubscriptions() {
  const subscriptions = await subscriptionsCollection();
  return subscriptions.countDocuments({
    plan: "founding",
    status: { $in: ACTIVE_STATUSES },
  });
}

export async function getFoundingMemberAvatars() {
  const subscriptions = await subscriptionsCollection();

  return subscriptions
    .aggregate<{ clerkUserId: string; imageUrl: string | null }>([
      { $match: { plan: "founding", status: { $in: ACTIVE_STATUSES } } },
      { $sort: { createdAt: 1 } },
      {
        $lookup: {
          from: "users",
          localField: "clerkUserId",
          foreignField: "clerkUserId",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $project: { _id: 0, clerkUserId: 1, imageUrl: "$user.imageUrl" } },
    ])
    .toArray();
}
