import { NextResponse } from "next/server";
import {
  countActiveFoundingSubscriptions,
  getFoundingMemberAvatars,
} from "@/lib/db/collections/subscriptions";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/dodo/pricing";

// Read live on every request so new founders show up straight away.
export const dynamic = "force-dynamic";

export type FoundingSlotsResponse = {
  filled: number;
  total: number;
  remaining: number;
  // Profile image of each founder, oldest first (null = no image).
  avatars: (string | null)[];
};

export async function GET() {
  const [filled, founders] = await Promise.all([
    countActiveFoundingSubscriptions(),
    getFoundingMemberAvatars(),
  ]);

  return NextResponse.json<FoundingSlotsResponse>({
    filled,
    total: FOUNDING_MEMBER_LIMIT,
    remaining: Math.max(FOUNDING_MEMBER_LIMIT - filled, 0),
    avatars: founders.map((founder) => founder.imageUrl ?? null),
  });
}
