# Changelog — app (engineering notes)

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
