// Fixed-window, in-memory rate limiter for the unauthenticated desktop
// connect endpoints. Per server instance only -- good enough to stop a single
// client hammering start/poll; swap for a shared store (e.g. Redis) if the
// app ever runs on multiple instances and this starts to matter.
type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();
let lastSweep = 0;

function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  sweep(now);

  const window = windows.get(key);
  if (!window || window.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true as const };
  }

  window.count++;
  if (window.count > limit) {
    return {
      ok: false as const,
      retryAfterSeconds: Math.ceil((window.resetAt - now) / 1000),
    };
  }
  return { ok: true as const };
}

// Client IP from the one header the hosting platform sets itself and that a
// client therefore can't forge -- never the first X-Forwarded-For entry,
// which any client can write. Configure per host via TRUSTED_IP_HEADER
// (Vercel: "x-real-ip", Cloudflare: "cf-connecting-ip", nginx: whatever it
// sets). Unset or missing (e.g. local dev), every caller shares one bucket,
// which only makes the limit stricter, never bypassable.
export function clientIp(request: Request) {
  const header = process.env.TRUSTED_IP_HEADER?.trim().toLowerCase();
  return (header && request.headers.get(header)?.trim()) || "unknown";
}

export function tooManyRequests(retryAfterSeconds: number) {
  return Response.json(
    { error: "rate_limited" },
    { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } },
  );
}
