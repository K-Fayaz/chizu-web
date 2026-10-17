import DodoPayments from "dodopayments";

// Created on first use, not when this file is imported: `next build` imports
// every route while collecting page data, and the SDK throws without
// DODO_PAYMENTS_API_KEY, which broke builds on a host that doesn't have the
// variables yet. A missing key now fails the request that needs it instead.
let client: DodoPayments | undefined;

export function getDodo(): DodoPayments {
  client ??= new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY,
    webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
    environment:
      (process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode") ??
      "test_mode",
  });
  return client;
}
