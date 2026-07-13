import { CFEnvironment } from 'cashfree-pg-api-contract';

export const PAYMENT_TYPE_BOOKING_AMOUNT = 'booking_amount' as const;

export const POLL_INTERVALS_MS = [3000, 5000, 8000] as const;

export const POLL_MAX_DURATION_MS = 30_000;

export const PAYMENT_API_TIMEOUT_MS = 15_000;

// export const CASHFREE_ENVIRONMENT: CFEnvironment = __DEV__
//   ? CFEnvironment.SANDBOX
//   : CFEnvironment.PRODUCTION;

export const CASHFREE_ENVIRONMENT = CFEnvironment.PRODUCTION;

export const PAYMENT_USER_MESSAGES = {
  offline: 'You are offline. Please check your internet connection.',
  generic: 'Something went wrong. Please try again.',
  sessionExpired: 'Your session has expired. Please log in again.',
  forbidden: 'You do not have permission to complete this payment.',
  notFound: 'Payment details could not be found.',
  conflict: 'This payment is already being processed.',
  validation: 'Payment details are invalid. Please try again.',
  rateLimited: 'Too many attempts. Please wait a moment and try again.',
  serverError: 'Our servers are temporarily unavailable. Please try again.',
  sdkLaunchFailed: 'Unable to open the payment gateway. Please try again.',
  sdkCancelled: 'Payment was cancelled.',
  verificationFailed: 'We could not verify your payment. Please try again.',
  stillProcessing:
    'Your payment is still being processed. You can refresh the status or check back shortly.',
  duplicateAttempt: 'A payment is already in progress.',
} as const;
