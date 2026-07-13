import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import SpaDetailsScreen from '../screens/Home/SpaDetailsScreen';
import AllBookingScreen from '../screens/Booking/AllBooking';
import BookingScreen from '../screens/Booking/BookingScreen';
import BookingResultScreen from '../screens/Booking/BookingResultScreen';
import PaymentScreen from '../screens/Payment/PaymentScreen';
import BottomNavigation from './BottomNavigation';
import type { BottomTabParamList } from './BottomNavigation';
import SplashScreen from '../screens/Splash/SplashScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import NoPaymentHistoryScreen from '../screens/Profile/NoPaymentHis';
import EditProfileScreen from '../screens/Profile/EditProfile/EditProfileScreen';
import AuthenticationScreen from '../authentication/screens/AuthenticationScreen';
import TermsScreen from '../screens/Legal/TermsScreen';
import PrivacyPolicyScreen from '../screens/Legal/PrivacyPolicyScreen';
import RefundPolicyScreen from '../screens/Legal/RefundPolicyScreen';

// ─────────────────────────────────────────────────────────────────────────────
// RootStackParamList — single source of navigation type truth.
//
// IMPORTANT: ProfileScreen is NOT registered here. It lives exclusively
// inside BottomNavigation's tab stack and is reached via the Profile tab,
// never via stack navigation.
// ─────────────────────────────────────────────────────────────────────────────

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  BottomNavigation: NavigatorScreenParams<BottomTabParamList> | undefined;
  Home: undefined;
  Explore: undefined;
  SpaDetails: {
    spaId: string;
    serviceId?: string;
    serviceName?: string;
    openEnquiry?: boolean;
  };
  AllBooking: undefined;
  BookingScreen: {
    spaId: string;
    spaName?: string;
    spaImage?: string;
    location?: string;
    serviceId?: string;
    serviceName?: string;
    serviceDurationMinutes?: number | null;
    servicePrice?: number | string | null;
  };
  NoPayment:
    | {
        bookingId?: string;
        bookingReference?: string;
      }
    | undefined;
  BookingResult: {
    type?: 'success' | 'failure' | 'cancelled' | 'refunded' | 'timeout' | 'processing';
    bookingId?: string;
    bookingReference?: string;
    spaName?: string;
    spaImage?: string;
    location?: string;
    serviceName?: string;
    serviceDurationMinutes?: number | null;
    appointmentDate?: string;
    appointmentTime?: string;
    bookingDateAndTime?: string;
    amount?: number | string | null;
    currency?: string;
    paymentStatus?: string;
    paymentId?: string;
    paymentSessionId?: string;
    cashfreeOrderId?: string;
    paymentCompletedAt?: string;
    sdkResult?: 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'UNKNOWN';
    sdkOrderId?: string;
    failureReason?: string;
  };
  PaymentScreen: {
    paymentId: string;
    bookingId: string;
    bookingRef?: string;
    paymentSessionId: string;
    cashfreeOrderId: string;
    amount: number;
    currency: string;
    spaName?: string;
    spaImage?: string;
    location?: string;
    serviceName?: string;
    serviceDurationMinutes?: number | null;
    appointmentDate?: string;
    appointmentTime?: string;
    bookingDateAndTime?: string;
  };
  EditProfile: undefined;
  TermsAndConditions: undefined;
  PrivacyPolicy: undefined;
  RefundPolicy: undefined;
  Login:
    | { spaId?: string; serviceId?: string; serviceName?: string }
    | undefined;
  Otp:
    | {
        phoneNumber: string;
        spaId?: string;
        serviceId?: string;
        serviceName?: string;
        /**
         * True when the OTP flow was initiated from the Profile tab's embedded
         * LoginScreen (not from a SpaDetails booking flow).
         * After OTP success in this case, we navigate to BottomNavigation
         * instead of SpaDetails or goBack().
         */
        isFromProfileTab?: boolean;
      }
    | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen name="BottomNavigation" component={BottomNavigation} />

        <Stack.Screen name="Explore" component={ExploreScreen} />

        <Stack.Screen name="Onboarding" component={OnboardingScreen} />

        <Stack.Screen name="Login" component={AuthenticationScreen} />

        <Stack.Screen name="Home" component={HomeScreen} />

        <Stack.Screen name="SpaDetails" component={SpaDetailsScreen} />

        <Stack.Screen name="AllBooking" component={AllBookingScreen} />

        <Stack.Screen name="BookingScreen" component={BookingScreen} />

        <Stack.Screen name="NoPayment" component={NoPaymentHistoryScreen} />

        <Stack.Screen name="BookingResult" component={BookingResultScreen} />

        <Stack.Screen name="PaymentScreen" component={PaymentScreen} />

        <Stack.Screen name="EditProfile" component={EditProfileScreen} />

        <Stack.Screen name="TermsAndConditions" component={TermsScreen} />

        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

        <Stack.Screen name="RefundPolicy" component={RefundPolicyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
