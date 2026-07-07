import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthSessionData {
  token: string | null;
  user: {
    id: string;
    userName: string;
    fullName?: string;
    email?: string;
    phoneNumber: string;
  } | null;
  isLoggedIn: boolean;
}

export async function writeAuthSession(
  token: string,
  user: any,
  isLoggedIn: boolean
): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem('authToken', token),
      AsyncStorage.setItem('user', JSON.stringify(user)),
      AsyncStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false'),
    ]);
  } catch (error) {
    if (__DEV__) {
      console.warn('[authStorage] writeAuthSession error:', error);
    }
  }
}

/**
 * Reads and parses the auth session from AsyncStorage.
 */
export async function readAuthSession(): Promise<AuthSessionData> {
  try {
    const [token, userRaw, isLoggedInRaw] = await Promise.all([
      AsyncStorage.getItem('authToken'),
      AsyncStorage.getItem('user'),
      AsyncStorage.getItem('isLoggedIn'),
    ]);

    let user = null;
    if (userRaw) {
      try {
        user = JSON.parse(userRaw);
      } catch (e) {
        if (__DEV__) {
          console.warn('[authStorage] failed to parse user JSON:', e);
        }
      }
    }

    const isLoggedIn = isLoggedInRaw === 'true';

    return {
      token,
      user,
      isLoggedIn,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[authStorage] readAuthSession error:', error);
    }
    return {
      token: null,
      user: null,
      isLoggedIn: false,
    };
  }
}

/**
 * Removes the stored auth session keys from AsyncStorage.
 */
export async function clearAuthSession(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem('authToken'),
      AsyncStorage.removeItem('user'),
      AsyncStorage.removeItem('isLoggedIn'),
    ]);
  } catch (error) {
    if (__DEV__) {
      console.warn('[authStorage] clearAuthSession error:', error);
    }
  }
}
