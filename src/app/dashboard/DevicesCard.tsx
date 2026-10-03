import { listActiveSessionsByClerkId } from "@/lib/db/collections/desktopSessions";
import { revokeDesktopDevice } from "./actions";

function formatLastSeen(date: Date) {
  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);
  if (minutes < 5) return "Active now";
  if (minutes < 60) return `Last used ${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Last used ${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `Last used ${days} day${days === 1 ? "" : "s"} ago`;
}

export async function DevicesCard({ clerkUserId }: { clerkUserId: string }) {
  const sessions = await listActiveSessionsByClerkId(clerkUserId);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-xl shadow-black/5">
      <h2 className="text-lg font-semibold">Devices</h2>
      <p className="mt-1 text-sm text-[#16140f]/60">
        Computers signed in to the MapWise desktop app.
      </p>

      {sessions.length === 0 ? (
        <p className="mt-4 text-sm text-[#16140f]/60">
          No devices connected yet.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-black/5">
          {sessions.map((session) => (
            <li
              key={session._id.toString()}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="text-sm font-medium">{session.deviceName}</p>
                <p className="text-xs text-[#16140f]/50">
                  {session.platform} · {formatLastSeen(session.lastSeenAt)}
                </p>
              </div>
              <form action={revokeDesktopDevice}>
                <input
                  type="hidden"
                  name="sessionId"
                  value={session._id.toString()}
                />
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-4 py-2 text-xs font-medium transition hover:bg-[#16140f]/5"
                >
                  Sign out
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
