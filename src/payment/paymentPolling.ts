export const PAYMENT_POLL_INTERVALS_MS = [3000, 5000, 8000] as const;

export const PAYMENT_POLL_TIMEOUT_MS = 30_000;

export const getPaymentPollDelay = (attempt: number): number =>
  PAYMENT_POLL_INTERVALS_MS[
    Math.min(attempt, PAYMENT_POLL_INTERVALS_MS.length - 1)
  ];

export const hasPaymentPollingTimedOut = (startedAt: number): boolean =>
  Date.now() - startedAt >= PAYMENT_POLL_TIMEOUT_MS;
