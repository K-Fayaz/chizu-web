# Changelog — app (engineering notes)

## 2026-10-10 — Renamed to Chizu

The product is now **Chizu** ("MapWise" was a placeholder). Rule: no "MapWise" or "mappy" anywhere in the code. The desktop app's half, and the reasoning, is in `mappy/.development_logs/changelog.md`.

- **All user-facing copy** says Chizu: root layout metadata, landing components (Navbar, Logo, Hero, CTA, FAQ, Pricing, CloserLook, VideoGallery, Footer), `/changelog`, `/desktop/connect`, `/desktop/subscribe`, `/desktop/subscribed`, and the dashboard Devices card.
- The "Get it" anchor `#get-mapwise` → `#get-chizu` (Navbar, Hero, Pricing, CTA).
- Code comments that called the desktop app "mappy" now say "the desktop app". Paths like `mappy/src-tauri/...` are unchanged; the folder keeps its name.
- No API, database or behaviour changes. The desktop app's env var is now `CHIZU_API_URL` (was `MAPPY_API_URL`); the web app's own env vars are unchanged.

### Verified
`tsc`, `eslint` (one pre-existing `<img>` warning in `VideoGallery`) and `next build` pass. Sign-in from the renamed desktop app tested end to end.

### Still open
- **Copy that's wrong for other reasons**, left for the download-page work (todo 5.1):
  - FAQ, CTA and Hero say "Linux only, Windows and macOS coming soon". The launch will be Windows + Linux.
  - The FAQ says "try Chizu free, no credit card", which contradicts paid-only access.
- The Clerk application name and Dodo business/product names still say MapWise in the dev/test setups. Users see them on the sign-in card, in Clerk emails, at checkout and on receipts. They'll be set to Chizu when the production Clerk instance and Dodo live mode are created (todo 5.3).
- The public `/changelog` page still has only the Beta entry.

## 2026-10-03 — Desktop licensing hardening (Phase 6)

Follow-up to the entry below; resolves several of its deferred items.

- **Desktop sessions expire after 90 days unused.** `touchActiveSessionByTokenHash` ignores sessions whose `lastSeenAt` is older than that (→ 401, mappy signs out and the user signs in again), and they drop off the Devices card. Mappy refreshes every few hours while running, so only machines left off or offline that long are affected.
- **Request body cap on `/api/desktop/*`:** `readJsonObject` streams the body and stops past 4 KB, including when Content-Length is missing or wrong.
- **License key hidden from the dashboard** (user decision, todo 6.4). Nothing grants access from Dodo license keys any more; showing a key that does nothing would confuse users. The `licenseKeys` collection and the `license_key.created` webhook sync stay, dormant, in case keys are needed again.
- Deployment notes (env vars, key rotation, release builds) are now in `mappy/docs/licensing-operations.md`.

### Status
The desktop licensing plan (Phases 0–6) is **complete** apart from launch-time configuration and the final test pass. The editor walkthrough was deferred by choice (see mappy's changelog).

### Still open
- **Production domain: not bought yet** (as of 2026-10-03; todo 6.5). Once it is: set `NEXT_PUBLIC_APP_URL` to it, point the Clerk and Dodo webhooks at it, build mappy with the same address (`MAPPY_API_URL`), and set **`TRUSTED_IP_HEADER`** for the host (todo 6.12). Steps are in `mappy/docs/licensing-operations.md`.
- Still low-risk and accepted: the rate limiter is in-memory per instance; device-code phishing is mitigated, not eliminated; `PricingCard` / `CheckoutStatusBanner` copy issues (pre-existing).
- Untested: `/desktop/subscribed?status=failed`; part of the final full test pass (todo 6.6).

## 2026-10-03 — Desktop app (mappy) sign-in & licensing backend

Connects the desktop app to accounts and subscriptions. Full design, decisions and progress: `mappy/.claude/plans/desktop-licensing-plan.md` and `desktop-licensing-todos.md`. Mappy's side is logged in `mappy/.development_logs/changelog.md`.

### How it works
- **Device-code login** (same pattern as smart-TV / GitHub CLI sign-in): mappy calls `connect/start`, opens the browser on `/desktop/connect?code=XXXX-XXXX`, the user approves while signed in with Clerk, mappy polls `connect/poll` and receives a session token once.
- **Two credentials:** a long-lived, revocable **session token** (`mps_…`, stored server-side only as a SHA-256 hash) and a short-lived **signed license** (Ed25519 JWT, 7-day `exp`) that mappy verifies offline with an embedded public key.
- **Dodo license keys are no longer used for access** — entitlement comes from `getActiveSubscriptionByClerkId()` (`active`/`past_due` → `ent: "full"`). The license-key code is left dormant (decision pending, todo 6.4).

### Keys & config
- Ed25519 key pair, kid `2026-10`. Private key (base64 PKCS#8 PEM) in `.env.local` as `DESKTOP_LICENSE_PRIVATE_KEY` + `DESKTOP_LICENSE_KID`; public half lives in `mappy/src-tauri/keys/`.
- Added `jose` for signing.
- New optional env `TRUSTED_IP_HEADER` (see Security).

### Database
- `desktopConnectCodes` — pending connect attempts; `userCode` + `deviceCodeHash` unique, TTL index on `expiresAt` (10 min). Reads also check `expiresAt` since the TTL sweep lags ~1 min. Approved → consumed is an atomic flip (single-use token handout).
- `desktopSessions` — one row per device (doubles as the dashboard device list); `tokenHash` unique, `(clerkUserId, deviceId)` unique so reconnecting a machine replaces its session.
- `users.walkthroughCompletedAt` (optional) + `setWalkthroughCompleted()`.

### API (`src/app/api/desktop/`)
- `POST connect/start`, `POST connect/poll` — unauthenticated, rate-limited.
- `POST license`, `POST walkthrough-complete`, `POST sign-out` — Bearer session token (`authenticateDesktopRequest()` in `src/lib/desktop/auth.ts`). Clerk's middleware passes these through untouched (verified).
- `license` revokes the session and returns 401 if the users doc is gone (Clerk user deleted).

### Pages
- `/desktop/connect` — shows the signed-in account, the requesting device and the code; "Connect this device" server action; "Switch account". A code approved by another account renders as expired.
- `/desktop/subscribe` — `PricingCard` + checkout; already-subscribed users get a "return to MapWise" card.
- `/desktop/subscribed` — Dodo return page (success / failed → retry / confirming).
- `/dashboard` — new **Devices** card with per-device "Sign out" (revoke scoped to the owner).
- Checkout refactor: internal `startCheckout(returnPath)` with a fixed union of return paths (no open redirect); new `createDesktopCheckoutSession`. The "create users doc if the Clerk webhook hasn't synced" logic moved to `src/lib/clerk/ensureUserDoc.ts` and is also run on desktop approval — otherwise the first license call would treat the user as deleted.

### Security review fixes (same day)
- Rate limiting no longer trusts client-writable `X-Forwarded-For`; client IP comes only from the header named in `TRUSTED_IP_HEADER` (unset → one shared bucket: stricter, never bypassable). Global caps: start 500 / 10 min, poll 3000 / min. Poll is limited per device code (40 / min) rather than per IP.
- `/desktop/connect` now carries a device-code-phishing warning ("only continue if you just clicked Sign in…"), shows the request's age, and presents the device name as self-reported.

### Tested
Manual curl + browser run: start → pending → approve → token (single use) → license verifies with mappy's public key (kid, device binding, 7-day exp, `ent`), walkthrough flag round-trip, dashboard revoke → 401, rate limit trips. Later re-verified end-to-end from mappy (including `sign-out`).

### Not yet tested
- `/desktop/subscribed?status=failed`. (The unsubscribed `/desktop/subscribe` page and a real desktop-started checkout → webhook → mappy unlock were verified on 2026-10-03.)

### Known issues / deferred (low risk)
- **Set `TRUSTED_IP_HEADER` in production** (e.g. Vercel: `x-real-ip`). Without it every user shares one rate-limit bucket, so heavy legitimate traffic could hit 429s. (todo 6.12)
- **Rate limiter is in-memory, per instance.** Fine on a single instance; needs a shared store (e.g. Redis) if the app scales out.
- **Desktop sessions never expire** — only revocation ends them. Plan: expire sessions unused for 90 days. (todo 6.8)
- **No explicit request body size cap** on `/api/desktop/*` (hosting platforms usually cap this). (todo 6.11)
- **Device-code phishing is inherent to this login pattern** — mitigated by the warning, request age and the Devices card, not eliminated. Worst case: someone shares one victim's subscription.
- Pre-existing, not touched: `PricingCard` hard-codes $14.99 (wrong once founding slots run out), and `CheckoutStatusBanner` tells every subscriber they're a founding member. The desktop pages avoid the banner, and the subscribe button uses the real price.

## 2026-09-30 — User management & subscriptions

### Auth (Clerk)
- Wired up `@clerk/nextjs` — `ClerkProvider` in root layout, `proxy.ts` (Next 16's replacement for `middleware.ts`) running `clerkMiddleware()`.
- `/sign-in` and `/sign-up` routes using Clerk's hosted components.
- `/dashboard` protected via `auth.protect()` (resource-based check, per Clerk's current recommendation — not the deprecated `createRouteMatcher` path-matcher pattern).
- `POST /api/webhooks/clerk` — verifies signature via `verifyWebhook`, syncs `user.created` / `user.updated` / `user.deleted` into the `users` collection.

### Database (MongoDB)
- `src/lib/db/client.ts` — cached `MongoClient` connection (dev-safe against hot-reload).
- `src/lib/db/collections/` — one file per collection, each owning its own indexes and typed accessors:
  - `users.ts` — `clerkUserId` (unique), `dodoCustomerId` (unique, sparse).
  - `subscriptions.ts` — `dodoSubscriptionId` (unique), `clerkUserId` (indexed).
  - `licenseKeys.ts` — `dodoLicenseKeyId` (unique), `clerkUserId` (indexed).

### Payments (Dodo Payments)
- Picked over Polar for founding-member licensing needs and pricing at our stage — see conversation for full comparison.
- `src/lib/dodo/client.ts` — SDK client.
- `src/lib/dodo/pricing.ts` — founding-member pricing logic:
  - `FOUNDING_MEMBER_LIMIT = 50`.
  - `getCheckoutPlan()` — counts active `founding`-plan subscriptions; sells `DODO_PRODUCT_ID_FOUNDING` ($14.99/mo) while under the limit, `DODO_PRODUCT_ID_STANDARD` ($29/mo) after.
  - `resolvePlanForProductId()` — maps a Dodo product ID back to `"founding" | "standard"`.
- `src/app/dashboard/actions.ts` — server actions:
  - `createCheckoutSession` — creates/reuses a Dodo customer (mapped via `dodoCustomerId` on the `users` doc, **not** via webhook metadata — more robust), self-heals a missing `users` doc from Clerk data if the Clerk webhook hasn't synced yet, then redirects to Dodo's hosted checkout.
  - `createBillingPortalSession` — mints a Dodo customer-portal session for self-service cancel/manage.
- `POST /api/webhooks/dodo` — verifies via `dodo.webhooks.unwrap()`, handles the full subscription lifecycle (`active`, `renewed`, `updated`, `plan_changed`, `on_hold`, `past_due`, `paused`, `unpaused`, `cancelled`, `expired`, `failed`) plus `license_key.created`.
- `GET /api/founding-slots` — public endpoint, `{ filled, total, remaining }`.

### UI
- `PricingCard.tsx` — extracted from `Pricing.tsx` into a shared component (takes a `cta` slot) so the landing page and `/dashboard` render an identical card with different call-to-actions (anchor link vs. `createCheckoutSession` form).
- `AvatarGrid.tsx` — now a live server component: filled slots show the actual founding member's Clerk avatar (via `getFoundingMemberAvatars()`, joins `subscriptions` → `users`, ordered by signup time), open slots stay as dashed placeholders.
- `/dashboard` — account info (Clerk avatar/name/email), subscription status card (plan/status/license key + "Manage billing") or the `PricingCard` if no active subscription, plus a success/failure banner (with confetti on success) read from Dodo's `return_url` query params.

### Landing page pricing correction
- Corrected pricing copy across `Pricing.tsx` / `AvatarGrid.tsx` to match the actual plan: **$14.99/mo for the first 50 founding members, $29/mo after** (was previously stale placeholder copy: $4.99 → $9.99 → $19.99+$10).

### Known issues / things to watch
- **Webhook delivery depends on ngrok being up and the URL matching what's registered in both Clerk's and Dodo's dashboards.** Free-tier ngrok issues a new random subdomain on every restart — forgetting to update both webhook endpoints after a restart silently breaks the whole sync pipeline (this bit us twice this session).
- **Dodo sends no event when a license key should stop working** (no `license_key.disabled`/`updated` event exists, only `license_key.created`). mappy's license verification must check the *subscription's* current status, not just whether a `licenseKeys` doc exists with `status: "active"`.

### Decided — cancelled founding members lose their slot (no code change)
Resolved the open question from earlier: if a founding member cancels, their slot is **recycled**, not permanently reserved for them. If they resubscribe after all 50 slots are filled by other people, they pay the standard $29 rate like any new customer. Kept this as the policy (no backend change needed — this is already what `getCheckoutPlan()` does) because the alternative (permanently locking the rate to the person) has a worse tradeoff: the 50-slot pool could stay "sold out" indefinitely even with far fewer than 50 people actually paying, since churned members would keep their reserved spot forever. Recycling keeps the founding tier representing real active paying customers and gives later signups a genuine shot at the launch price.

Updated copy to match this policy instead of overpromising:
- `PricingCard.tsx` (perks bullet + fine-print disclaimer) and `CheckoutStatusBanner.tsx`: "locked in for life" → "locked in for as long as you stay subscribed."
- Added a new FAQ entry ("What if I cancel and want to come back later?") explaining the recycling policy plainly.
- Left the large stylized headline ("One price. *Locked in for life.*") on the pricing section as-is — the fine print and FAQ right below it now carry the accurate terms.
