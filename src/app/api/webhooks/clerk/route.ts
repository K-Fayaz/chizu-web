import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import {
  deleteUserByClerkId,
  upsertUserFromClerk,
} from "@/lib/db/collections/users";

export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch (err) {
    console.error("Clerk webhook verification failed:", err);
    return new Response("Webhook verification failed", { status: 400 });
  }

  switch (event.type) {
    case "user.created":
    case "user.updated": {
      const user = event.data;
      const primaryEmail =
        user.email_addresses.find(
          (e) => e.id === user.primary_email_address_id,
        )?.email_address ?? user.email_addresses[0]?.email_address ?? null;

      await upsertUserFromClerk({
        id: user.id,
        email: primaryEmail,
        firstName: user.first_name,
        lastName: user.last_name,
        imageUrl: user.image_url ?? null,
      });
      break;
    }
    case "user.deleted": {
      if (event.data.id) {
        await deleteUserByClerkId(event.data.id);
      }
      break;
    }
    default:
      break;
  }

  return new Response("OK", { status: 200 });
}
