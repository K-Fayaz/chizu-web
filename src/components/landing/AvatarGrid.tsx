import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { getFoundingMemberAvatars } from "@/lib/db/collections/subscriptions";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/dodo/pricing";

export async function AvatarGrid() {
  const founders = await getFoundingMemberAvatars();
  const filled = founders.length;
  const remaining = Math.max(FOUNDING_MEMBER_LIMIT - filled, 0);
  const slots = Array.from({ length: FOUNDING_MEMBER_LIMIT }, (_, index) => index);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
      <p className="text-sm font-semibold text-[#16140f]">Launch spots</p>
      <p className="mt-1 text-xs text-[#16140f]/50">
        {remaining} of {FOUNDING_MEMBER_LIMIT} spots left at $14.99/month —
        be one of the first.
      </p>

      <div className="mt-5 grid flex-1 grid-cols-8 content-center gap-3">
        {slots.map((index) => {
          const founder = founders[index];

          if (founder) {
            return founder.imageUrl ? (
              <Image
                key={founder.clerkUserId}
                src={founder.imageUrl}
                alt=""
                title={`Spot ${index + 1} · taken`}
                width={32}
                height={32}
                className="aspect-square w-full rounded-full object-cover"
              />
            ) : (
              <div
                key={founder.clerkUserId}
                title={`Spot ${index + 1} · taken`}
                className="flex aspect-square items-center justify-center rounded-full bg-brand text-white"
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
              </div>
            );
          }

          return (
            <div
              key={index}
              title={`Spot ${index + 1} · open`}
              className="flex aspect-square items-center justify-center rounded-full border border-dashed border-black/15 bg-black/[0.02] text-black/20"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-xs text-[#16140f]/50">
        Your spot could be one of these.
      </p>
    </div>
  );
}
