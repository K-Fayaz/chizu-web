"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ensureUserDoc } from "@/lib/clerk/ensureUserDoc";
import { approveConnectCode } from "@/lib/db/collections/desktopConnectCodes";

export async function approveDesktopConnection(formData: FormData) {
  const { userId } = await auth.protect();
  const code = formData.get("code");
  if (typeof code !== "string") redirect("/desktop/connect");

  // The license endpoint treats a missing users doc as a deleted account and
  // revokes the session, so make sure it exists before mappy's first refresh.
  await ensureUserDoc(userId);
  await approveConnectCode(code, userId);

  // The page re-reads the code: approved -> success, otherwise expired.
  redirect(`/desktop/connect?code=${encodeURIComponent(code)}`);
}
