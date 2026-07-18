import { useEffect } from 'react';

import {
  FirebaseMessaging,
  NotificationHandler,
  NotificationPermission,
} from '../services/firebase/messaging';
import { saveFcmToken } from '../utils/fcmStorage';
import { syncProfileMetadata } from '../services/profile/profileSync';
import { useProfile } from '../context/ProfileContext';

export default function useNotifications() {
  const { setProfile } = useProfile();

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const granted = await NotificationPermission.requestPermission();
        console.log("Granted fcm token: ", granted);

        if (!granted) {
          console.log('[FCM] Notification permission denied');
          return;
        }

        console.log('[FCM] Notification permission granted');

        const token = await FirebaseMessaging.getToken();

        console.log('[FCM] Token:', token);
        if (token) {
          await saveFcmToken(token);
        }

        // Trigger sync manually if needed (optional, since ProfileContext triggers it on mount)
        // But doing it here ensures token is saved before sync.
      } catch (error) {
        console.log('[FCM] Initialization Error', error);
      }
    };

    initializeNotifications();

    NotificationHandler.initialize();

    const unsubscribeTokenRefresh =
      FirebaseMessaging.onTokenRefresh(async (token) => {
        console.log('[FCM] Token refreshed:', token);
        if (token) {
          await saveFcmToken(token);
        }

        try {
          const { updated, profile } = await syncProfileMetadata();
          if (updated && profile) {
            setProfile(profile);
          }
        } catch (error) {
          console.log('[FCM] Token refresh sync error:', error);
        }
      });

    return () => {
      unsubscribeTokenRefresh();
    };
  }, [setProfile]);
}