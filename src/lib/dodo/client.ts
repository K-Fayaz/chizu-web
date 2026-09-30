import DodoPayments from "dodopayments";

export const dodo = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  webhookKey: process.env.DODO_PAYMENTS_WEBHOOK_KEY,
  environment:
    (process.env.DODO_PAYMENTS_ENVIRONMENT as "live_mode" | "test_mode") ??
    "test_mode",
});
