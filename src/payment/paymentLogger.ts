const sanitizePayload = (payload: unknown): unknown => {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }

  const record = { ...(payload as Record<string, unknown>) };
  const sensitiveKeys = [
    'payment_session_id',
    'paymentSessionId',
    'token',
    'authorization',
  ];

  for (const key of sensitiveKeys) {
    if (key in record) {
      record[key] = '[REDACTED]';
    }
  }

  return record;
};

export const paymentLogger = {
  debug: (label: string, payload?: unknown): void => {
    if (!__DEV__) {
      return;
    }

    if (payload === undefined) {
      console.log(`[Payment] ${label}`);
      return;
    }

    console.log(`[Payment] ${label}`, sanitizePayload(payload));
  },

  error: (label: string, error: unknown): void => {
    if (!__DEV__) {
      return;
    }

    console.log(`[Payment] ${label}`, error);
  },
};
