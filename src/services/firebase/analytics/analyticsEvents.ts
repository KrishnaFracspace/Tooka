export const AnalyticsEvents = {
  APP_OPEN: 'app_open',

  LOGIN_STARTED: 'login_started',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  LOGOUT: 'logout',

  HOME_VIEWED: 'home_viewed',

  EXPLORE_VIEWED: 'explore_viewed',

  SEARCH_USED: 'search_used',

  FILTER_APPLIED: 'filter_applied',

  SPA_VIEWED: 'spa_viewed',

  SPA_SHARED: 'spa_shared',

  SPA_SAVED: 'spa_saved',

  BOOKING_STARTED: 'booking_started',

  SLOT_SELECTED: 'slot_selected',

  PAYMENT_STARTED: 'payment_started',

  PAYMENT_SUCCESS: 'payment_success',

  PAYMENT_FAILED: 'payment_failed',

  BOOKING_COMPLETED: 'booking_completed',

  PROFILE_UPDATED: 'profile_updated',

  NOTIFICATION_OPENED: 'notification_opened',
} as const;

export type AnalyticsEvent =
  (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];