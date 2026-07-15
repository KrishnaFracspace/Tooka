import { useEffect } from 'react';

import {
  FirebaseMessaging,
  NotificationHandler,
  NotificationPermission,
} from '../services/firebase/messaging';

export default function useNotifications() {
  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const granted = await NotificationPermission.requestPermission();

        if (!granted) {
          console.log('[FCM] Notification permission denied');
          return;
        }

        console.log('[FCM] Notification permission granted');

        const token = await FirebaseMessaging.getToken();

        console.log('[FCM] Token:', token);

        // TODO:
        // Send token to Tooka backend
      } catch (error) {
        console.log('[FCM] Initialization Error', error);
      }
    };

    initializeNotifications();

    NotificationHandler.initialize();

    const unsubscribeTokenRefresh =
      FirebaseMessaging.onTokenRefresh(token => {
        console.log('[FCM] Token refreshed:', token);

        // TODO:
        // Update token on backend
      });

    return () => {
      unsubscribeTokenRefresh();
    };
  }, []);
}