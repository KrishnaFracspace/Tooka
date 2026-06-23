import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/Home/HomeScreen';
import SpaDetailsScreen from '../screens/Home/SpaDetailsScreen';
import AllBookingScreen from '../screens/Booking/AllBooking';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import BottomNavigation from './BottomNavigation';
import LoginScreen from '../screens/Auth/Login';
import OtpScreen from '../screens/Auth/Otp';

export type RootStackParamList = {
  Home: undefined;
  SpaDetails: undefined;
  AllBooking: undefined;
  ProfileScreen: undefined;
  BottomNavigation: undefined;
  Login: undefined;
  Otp: undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomNavigation"
        screenOptions={{
          headerShown: false,
        }}>

        <Stack.Screen
          name="BottomNavigation"
          component={BottomNavigation}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Otp"
          component={OtpScreen}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="SpaDetails"
          component={SpaDetailsScreen}
        />

        <Stack.Screen
            name="AllBooking"
            component={AllBookingScreen}
        />

        <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;