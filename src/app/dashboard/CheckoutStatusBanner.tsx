"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

export function CheckoutStatusBanner({
  status,
  foundingLimit,
}: {
  status: "active" | "failed" | undefined;
  foundingLimit: number;
}) {
  useEffect(() => {
    if (status === "active") {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.3 },
      });
    }
  }, [status]);

  if (status === "active") {
    return (
      <div className="mb-6 rounded-xl border border-brand/30 bg-brand/10 p-4 text-sm font-medium text-brand">
        🎉 You&apos;re in! You&apos;re one of the first {foundingLimit}{" "}
        founding members — your $14.99/mo rate is locked in for as long as
        you stay subscribed.
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-4 text-sm font-medium text-red-700">
        Your payment didn&apos;t go through. No charge was made — please try
        again below.
      </div>
    );
  }

  return null;
}
