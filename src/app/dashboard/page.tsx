import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function DashboardPage() {
  await auth.protect();
  const user = await currentUser();

  return (
    <div className="min-h-screen p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <UserButton />
      </div>
      <p className="mt-4 text-[#16140f]/70">
        Signed in as {user?.primaryEmailAddress?.emailAddress}
      </p>
    </div>
  );
}
