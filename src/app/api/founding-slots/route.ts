import { NextResponse } from "next/server";
import { countActiveFoundingSubscriptions } from "@/lib/db/collections/subscriptions";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/dodo/pricing";

export async function GET() {
  const filled = await countActiveFoundingSubscriptions();

  return NextResponse.json({
    filled,
    total: FOUNDING_MEMBER_LIMIT,
    remaining: Math.max(FOUNDING_MEMBER_LIMIT - filled, 0),
  });
}
