export const AnalyticsScreens = {
  Splash: 'Splash',

  Home: 'Home',

  Explore: 'Explore',

  SpaDetails: 'SpaDetails',

  Booking: 'Booking',

  Payment: 'Payment',

  BookingResult: 'BookingResult',

  Profile: 'Profile',

  EditProfile: 'EditProfile',

  Settings: 'Settings',
} as const;

export type AnalyticsScreen =
  (typeof AnalyticsScreens)[keyof typeof AnalyticsScreens];