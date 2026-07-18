import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = 'FCM_TOKEN';

/**
 * Saves the FCM token to AsyncStorage.
 * @param token The FCM token string
 */
export async function saveFcmToken(token: string): Promise<void> {
  try {
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
  } catch (error) {
    if (__DEV__) {
      console.warn('[fcmStorage] saveFcmToken error:', error);
    }
  }
}

/**
 * Reads the FCM token from AsyncStorage.
 * @returns The FCM token or null if not found
 */
export async function getFcmToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(FCM_TOKEN_KEY);
  } catch (error) {
    if (__DEV__) {
      console.warn('[fcmStorage] getFcmToken error:', error);
    }
    return null;
  }
}

/**
 * Clears the FCM token from AsyncStorage.
 */
export async function removeFcmToken(): Promise<void> {
  try {
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
  } catch (error) {
    if (__DEV__) {
      console.warn('[fcmStorage] removeFcmToken error:', error);
    }
  }
}
