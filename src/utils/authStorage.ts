// ─────────────────────────────────────────────────────────────────────────────
// Auth Storage Helper
//
// ALL AsyncStorage reads and writes for authentication go through this module.
// No screen or component should import AsyncStorage directly for auth purposes.
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StoredAuthData, AuthUser } from '../types/auth';

const STORAGE_KEY = 'TOOKA_AUTH_V2';

/**
 * The shape of a valid session object in storage.
 * Everything inside is nullable so partial data never crashes reads.
 */
const DEFAULT_DATA: StoredAuthData = {
  user: null,
  token: null,
  phone: null,
};
const AUTH_KEY = 'TOOKA_AUTH_V2';

// ─── Read ────────────────────────────────────────────────────────────────────

/**
 * Reads and parses the stored auth session.
 *
 * @returns The stored `StoredAuthData` on success, or `null` on error /
 *          when no session exists. A `null` return should be treated as
 *          "no session" — the caller must handle it by logging out.
 */
export async function readAuthSession(): Promise<StoredAuthData | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    // Validate that parsed value has the expected shape before trusting it.
    if (!parsed || typeof parsed !== 'object') {
      if (__DEV__) {
        console.warn('[authStorage] Stored data is not an object — treating as corrupt.');
      }
      return null;
    }

    const data = parsed as Partial<StoredAuthData>;

    return {
      user: data.user ?? null,
      token: data.token ?? null,
      phone: data.phone ?? null,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[authStorage] readAuthSession error:', error);
    }
    // Storage corrupt or parse failure — treat as no session.
    return null;
  }
}

// ─── Write ───────────────────────────────────────────────────────────────────

/**
 * Persists a full auth session to AsyncStorage.
 *
 * @param user  The authenticated user object.
 * @param token The server token (may be null).
 * @param phone The phone number used to authenticate.
 */
// export async function writeAuthSession(
//   user: AuthUser | null,
//   token: string | null,
//   phone: string | null,
// ): Promise<void> {
//   try {
//     const data: StoredAuthData = { user, token, phone };
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
//   } catch (error) {
//     if (__DEV__) {
//       console.warn('[authStorage] writeAuthSession error:', error);
//     }
//     // Non-fatal: in-memory state is already updated. The session just won't
//     // survive app restart. This is better than crashing.
//   }
// }
export const writeAuthSession = async (
  user: AuthUser | null,
  token: string | null,
  phone: string | null,
) => {
  const payload = {
    user,
    token,
    phone,
  };

  await AsyncStorage.setItem(
    AUTH_KEY,
    JSON.stringify(payload),
  );
};

// ─── Clear ───────────────────────────────────────────────────────────────────

/**
 * Removes the stored auth session from AsyncStorage.
 * Also removes the legacy V1 key if it exists (migration cleanup).
 * Safe to call multiple times.
 */
export async function clearAuthSession(): Promise<void> {
  try {
    // Remove both current and legacy keys in parallel.
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEY),
      AsyncStorage.removeItem('TOOKA_AUTH_V1'),
    ]);
  } catch (error) {
    if (__DEV__) {
      console.warn('[authStorage] clearAuthSession error:', error);
    }
    // Non-fatal: in-memory state is already cleared even if storage removal fails.
  }
}

export { DEFAULT_DATA };
