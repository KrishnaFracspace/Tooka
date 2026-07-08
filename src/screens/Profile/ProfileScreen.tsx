// ─────────────────────────────────────────────────────────────────────────────
// ProfileScreen
//
// UI rebuilt to match the provided Figma while preserving existing behavior:
//  • Reads live user data from AuthContext.
//  • Navigates to NoPayment for Payment History.
//  • Keeps guarded logout and navigation reset to BottomNavigation.
//  • Keeps delete-account confirmation and TODO placeholder.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useMemo, useRef } from 'react';
import { Alert, Linking, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import ProfileHeader from './components/ProfileHeader';
import UserInfoCard from './components/UserInfoCard';
import SupportCard from './components/SupportCard';
import MenuList from './components/MenuList';
import VersionInfo from './components/VersionInfo';
import type { MenuItemConfig } from './components/MenuItem';
import { styles } from './styles';
import { useAuth } from '../../context/AuthContext';
import type { RootStackParamList } from '../../navigation/AppNavigator';

type ProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BottomNavigation'>;

const APP_VERSION = '0.0.1';
const SUPPORT_PHONE = 'tel:+911234567890';
const SUPPORT_EMAIL = 'mailto:support@tooka.in';

function normalizePhone(phoneNumber?: string | null): string {
  const trimmed = phoneNumber?.trim();

  if (!trimmed) {
    return 'Not provided';
  }

  return trimmed.startsWith('+') ? trimmed : `+91 ${trimmed}`;
}

const ProfileScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation<ProfileNavigationProp>();
  const { user, logout } = useAuth();
  // console.log('[ProfileScreen] Render. User:', user);

  const isLoggingOut = useRef<boolean>(false);
  const isDeletingAccount = useRef<boolean>(false);

  const displayName = user?.userName?.trim() || user?.fullName?.trim() || 'Guest User';
  const displayEmail = user?.email?.trim() || 'Not provided';
  const displayPhone = normalizePhone(user?.phone);

  const showUnavailableToast = useCallback((title: string) => {
    Toast.show({
      type: 'info',
      text1: title,
      text2: 'This feature will be available soon.',
    });
  }, []);

  const openExternalUrl = useCallback(async (url: string, fallbackTitle: string) => {
    try {
      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
        return;
      }

      showUnavailableToast(fallbackTitle);
    } catch (error) {
      if (__DEV__) {
        console.warn('[ProfileScreen] openExternalUrl error:', error);
      }
      showUnavailableToast(fallbackTitle);
    }
  }, [showUnavailableToast]);

  const handleLogout = useCallback(async () => {
    if (isLoggingOut.current) {
      return;
    }

    isLoggingOut.current = true;

    try {
      await logout();

      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomNavigation' }],
      });
    } catch (error) {
      if (__DEV__) {
        console.warn('[ProfileScreen] logout error:', error);
      }
      Toast.show({
        type: 'error',
        text1: 'Logout failed',
        text2: 'Please try again.',
      });
    } finally {
      isLoggingOut.current = false;
    }
  }, [logout, navigation]);

  const handleDeleteAccount = useCallback(() => {
    if (isDeletingAccount.current) {
      return;
    }

    isDeletingAccount.current = true;

    Alert.alert(
      'Delete Account',
      'This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            isDeletingAccount.current = false;
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Integrate delete-account API when backend endpoint is ready.
              // After successful API deletion, call logout() and reset navigation
              // to BottomNavigation exactly like handleLogout().
              if (__DEV__) {
                console.log('[ProfileScreen] handleDeleteAccount TODO for user:', user?.id);
              }
              Toast.show({
                type: 'info',
                text1: 'Delete Account',
                text2: 'This feature will be available soon.',
              });
            } catch (error) {
              if (__DEV__) {
                console.warn('[ProfileScreen] deleteAccount error:', error);
              }
              Toast.show({
                type: 'error',
                text1: 'Delete failed',
                text2: 'Please try again later.',
              });
            } finally {
              isDeletingAccount.current = false;
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          isDeletingAccount.current = false;
        },
      },
    );
  }, [user?.id]);

  const menuItems = useMemo<MenuItemConfig[]>(
    () => [
      {
        id: 'payment-history',
        title: 'Payment History',
        iconName: 'receipt-outline',
        onPress: () => navigation.navigate('NoPayment'),
      },
      {
        id: 'saved-spas',
        title: 'Saved Spas',
        iconName: 'heart-outline',
        onPress: () => showUnavailableToast('Saved Spas'),
      },
      {
        id: 'rate-app',
        title: 'Rate our App',
        iconName: 'star-outline',
        onPress: () => showUnavailableToast('Rate our App'),
      },
      {
        id: 'terms',
        title: 'Terms & Conditions',
        iconName: 'alert-circle-outline',
        onPress: () => showUnavailableToast('Terms & Conditions'),
      },
      {
        id: 'logout',
        title: 'Logout',
        iconName: 'log-out-outline',
        destructive: true,
        onPress: handleLogout,
      },
      {
        id: 'delete-account',
        title: 'Delete Account',
        iconName: 'trash-outline',
        destructive: true,
        onPress: handleDeleteAccount,
      },
    ],
    [handleDeleteAccount, handleLogout, navigation, showUnavailableToast],
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletContent]}
        showsVerticalScrollIndicator={false}
        bounces
      >
        <ProfileHeader onNotificationPress={() => showUnavailableToast('Notifications')} />
        <View style={styles.root}>
          <UserInfoCard
            name={displayName}
            email={displayEmail}
            phone={displayPhone}
            onEditPress={() => showUnavailableToast('Edit Profile')}
          />

          <View style={styles.supportRow}>
            <SupportCard
              eyebrow="Instant Voice"
              title="Call Support"
              iconName="call-outline"
              onPress={() => openExternalUrl(SUPPORT_PHONE, 'Call Support')}
            />
            <SupportCard
              eyebrow="Direct Message"
              title="Email Support"
              iconName="mail-outline"
              onPress={() => openExternalUrl(SUPPORT_EMAIL, 'Email Support')}
            />
          </View>

          <MenuList items={menuItems} />
          <VersionInfo appName="TOOKA: Near You" version={APP_VERSION} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
