// ─────────────────────────────────────────────────────────────────────────────
// BottomNavigation
//
// Profile Tab Auth Gate:
//  • While auth state is hydrating (loading=true) → show a centered spinner
//    to prevent the Login ↔ Profile flicker during app startup.
//  • When user is NOT authenticated → render LoginScreen inline inside the
//    Profile tab (no navigation, no stack issues, no blank screens).
//  • When user IS authenticated → render ProfileScreen.
//
// This approach avoids navigation loops and works correctly after:
//  • OTP success from SpaDetails flow (Profile tab auto-reflects new auth state)
//  • App restart with existing session (hydration restores ProfileScreen)
//  • Logout (ProfileScreen swaps back to LoginScreen instantly)
// ─────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  View,
  Text,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/Home/HomeScreen';
import ExploreScreen from '../screens/Explore/ExploreScreen';
import AllBookingScreen from '../screens/Booking/AllBooking';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { useAuth } from '../context/AuthContext';
import AuthenticationScreen from '../authentication/screens/AuthenticationScreen';

const Tab = createBottomTabNavigator();

const ICONS: Record<string, string> = {
  Home: 'home-outline',
  Explore: 'map-outline',
  Bookings: 'calendar-outline',
  Profile: 'person-outline',
};

// ─── Custom Tab Bar ───────────────────────────────────────────────────────────

function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const currentRoute = state.routes[state.index].name;
  const hideTabBar = currentRoute === 'Explore';

  const containerWidth = width * 0.92;
  const tabCount = state.routes.length;
  const tabWidth = containerWidth / tabCount;
  const indicatorWidth = Math.max(80, tabWidth * 0.9);

  const translateX = useRef(
    new Animated.Value(
      state.index * tabWidth + (tabWidth - indicatorWidth) / 2,
    ),
  ).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue:
        state.index * tabWidth +
        (tabWidth - indicatorWidth) / 2,
      useNativeDriver: true,
      speed: 18,
      bounciness: 8,
    }).start();
  }, [state.index, tabWidth, indicatorWidth]);

  if (hideTabBar) {
    return null;
  }

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.container,
        {
          bottom:
            Platform.OS === 'android'
              ? insets.bottom + 10
              : 20,
        },
      ]}>
      <View
        style={[
          styles.tabBackground,
          {
            width: containerWidth,
          },
        ]}>
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              width: indicatorWidth,
              transform: [{ translateX }],
            },
          ]}
        />

        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const rawLabel =
            descriptors[route.key].options.title ??
            descriptors[route.key].options.tabBarLabel ??
            route.name;

          const label =
            typeof rawLabel === 'string'
              ? rawLabel
              : route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabButton,
                {
                  width: tabWidth,
                },
              ]}>
              <View style={styles.tabInner}>
                <Ionicons
                  name={ICONS[label] || 'ellipse-outline'}
                  size={22}
                  color={isFocused ? '#FFF' : '#FFB02E'}
                />
                {isFocused && (
                  <Text style={styles.activeLabel}>
                    {label}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function BookingTabScreen(): React.ReactElement {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB02E" />
      </View>
    );
  }

  if (!isAuthenticated) {
    // Render LoginScreen in embedded mode — it hides the back button
    // and does not attempt to navigate backwards.
    return <AuthenticationScreen isEmbedded={true} />;
  }

  return <AllBookingScreen />;
}

// ─── Profile Tab Screen — Auth Gate ─────────────────────────────────────────

/**
 * Wraps the Profile tab content with an auth gate.
 *
 * States:
 *  1. loading=true  → Spinner (prevents hydration flicker)
 *  2. !isAuthenticated → LoginScreen in embedded mode (no back button)
 *  3. isAuthenticated  → ProfileScreen with real user data
 */
function ProfileTabScreen(): React.ReactElement {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFB02E" />
      </View>
    );
  }

  if (!isAuthenticated) {
    // Render LoginScreen in embedded mode — it hides the back button
    // and does not attempt to navigate backwards.
    return <AuthenticationScreen isEmbedded={true} />;
  }

  return <ProfileScreen />;
}

// ─── Tab Navigator ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },

  tabBackground: {
    height: 64,
    borderRadius: 40,
    backgroundColor: '#FFF',

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 8,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },

    elevation: 10,
  },

  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 6,

    height: 52,
    borderRadius: 30,

    backgroundColor: '#FFB02E',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5,
  },

  tabButton: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  tabInner: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  icon: {
    fontSize: 18,
  },

  activeIcon: {
    color: '#FFF',
    fontWeight: '700',
  },

  inactiveIcon: {
    color: '#FFFFFF',
  },

  activeLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: '#F6F1E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Bookings" component={BookingTabScreen} />
      <Tab.Screen name="Profile" component={ProfileTabScreen} />
    </Tab.Navigator>
  );
}
