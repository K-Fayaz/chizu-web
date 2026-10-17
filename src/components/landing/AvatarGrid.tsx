import Image from "next/image";
import { Check, Plus } from "lucide-react";
import { getFoundingMemberAvatars } from "@/lib/db/collections/subscriptions";
import { FOUNDING_MEMBER_LIMIT } from "@/lib/dodo/pricing";

type Founders = Awaited<ReturnType<typeof getFoundingMemberAvatars>>;

// Never takes the landing page down: if the database is missing (e.g. at
// build time on a host without its variables) or unreachable, every spot
// shows as open until the next refresh (page.tsx revalidates every 60 s).
async function loadFounders(): Promise<Founders> {
  try {
    return await getFoundingMemberAvatars();
  } catch (err) {
    console.error("Couldn't load founding members for the landing page", err);
    return [];
  }
}

export async function AvatarGrid() {
  const founders = await loadFounders();
  const filled = founders.length;
  const remaining = Math.max(FOUNDING_MEMBER_LIMIT - filled, 0);
  const slots = Array.from({ length: FOUNDING_MEMBER_LIMIT }, (_, index) => index);

  return (
    <div className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-xl shadow-foreground/5 ring-1 ring-foreground/5">
      <p className="text-lg font-extrabold text-foreground">Launch spots</p>
      <p className="mt-1 text-sm font-semibold text-foreground/55">
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
              className="flex aspect-square items-center justify-center rounded-full border-2 border-dashed border-ocean/30 bg-ocean/5 text-ocean/60"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-sm font-semibold text-foreground/55">
        Your spot could be one of these.
      </p>
    </div>
  );
}
