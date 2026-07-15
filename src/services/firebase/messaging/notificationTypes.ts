export enum NotificationType {
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',

  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  PAYMENT_FAILED = 'PAYMENT_FAILED',

  PROMOTION = 'PROMOTION',

  PROFILE_UPDATED = 'PROFILE_UPDATED',

  GENERAL = 'GENERAL',
}

export interface NotificationPayload {
  type: NotificationType;

  bookingId?: string;

  spaId?: string;

  paymentId?: string;

  title?: string;

  body?: string;

  image?: string;

  [key: string]: string | undefined;
}