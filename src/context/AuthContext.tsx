// ─────────────────────────────────────────────────────────────────────────────
// AuthContext — Single Source of Truth for Authentication
//
// ARCHITECTURE NOTES:
//  • isAuthenticated is derived from !!user, NOT !!token.
//    The server returns a `user` object on OTP success but no token field,
//    so using !!token would leave isAuthenticated permanently false.
//  • All AsyncStorage access is delegated to src/utils/authStorage.ts.
//  • `loading` is true only during the initial hydration on app startup.
//    Screens must gate on `loading` to avoid Login ↔ Profile flicker.
//  • All callbacks are stable (useCallback + exhaustive deps).
//  • Logout is guarded against being called while already in progress.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AuthApi, {
  type RegisterPayload,
  type LoginPayload,
  type VerifyOtpPayload,
} from '../api/AuthApi';
import {
  readAuthSession,
  writeAuthSession,
  clearAuthSession,
} from '../utils/authStorage';
import type { AuthUser, AuthContextValue } from '../types/auth';

// Re-export AuthUser so consumers can import from a single place.
export type { AuthUser };

// ─── Context ─────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  // True during the initial AsyncStorage hydration. Remains true until we
  // have confirmed whether a session exists or not.
  const [loading, setLoading] = useState<boolean>(true);

  // Guard against concurrent logout calls (e.g. double-tap).
  const isLoggingOut = useRef<boolean>(false);

  // ─── Session Hydration ─────────────────────────────────────────────────────

  /**
   * Reads the stored session once on mount. If reading fails or the data is
   * corrupt, auto-clears storage and leaves user in logged-out state.
   */
  const hydrate = useCallback(async (): Promise<void> => {
    try {
      const session = await readAuthSession();
      // const session = await readAuthSession();

      console.log(
        '[AUTH HYDRATE]',
        JSON.stringify(session, null, 2),
      );
      if (session?.user) {
        setUser(session.user);
        setToken(session.token ?? null);
        setPhoneNumber(session.phone ?? null);
      }
      // If session is null, user stays logged-out (default state). No action needed.
    } catch (error) {
      // Unexpected error (e.g. native crash in AsyncStorage). Auto-logout.
      if (__DEV__) {
        console.warn('[AuthContext] hydrate unexpected error, auto-logout:', error);
      }
      await clearAuthSession();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // ─── Auth Actions ──────────────────────────────────────────────────────────

  /**
   * Re-reads the stored session and refreshes in-memory state.
   * Useful after a background token refresh or stale state recovery.
   */
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      const session = await readAuthSession();
      if (session?.user) {
        setUser(session.user);
        setToken(session.token ?? null);
        setPhoneNumber(session.phone ?? null);
      } else {
        // No valid session found — clear in-memory state.
        setUser(null);
        setToken(null);
        setPhoneNumber(null);
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[AuthContext] refreshUser error:', error);
      }
    }
  }, []);

  /**
   * Sends an OTP to the given phone number to start the login flow.
   * Stores the phone number in state for use by the OTP screen.
   */
  const loginStart = useCallback(async (phone: string): Promise<void> => {
    setPhoneNumber(phone);
    const payload: LoginPayload = {
      phoneNumber: '+91' + phone,
      smsCountry: true,
    };
    if (__DEV__) {
      console.log('[AuthContext] loginStart payload:', payload);
    }
    await AuthApi.GetLogin(payload);
  }, []);

  /**
   * Registers a new user, then immediately triggers OTP login.
   * The OTP screen is responsible for collecting and verifying the code.
   */
  const registerStart = useCallback(
    async (name: string, phone: string, email: string): Promise<void> => {
      setPhoneNumber(phone);

      const registerPayload: RegisterPayload = {
        userName: name,
        phoneNumber: '+91' + phone,
        email: email,
        countryCode: '+91',
      };
      await AuthApi.GetRegistration(registerPayload);

      const loginPayload: LoginPayload = {
        phoneNumber: '+91' + phone,
        smsCountry: true,
      };
      await AuthApi.GetLogin(loginPayload);
    },
    [],
  );

  /**
   * Verifies OTP with the server. On success:
   *  1. Updates in-memory user/token/phone state.
   *  2. Persists the session to AsyncStorage.
   *  3. Returns the authenticated user object.
   *
   * On failure: throws (caller handles the error and shows Toast).
   * If storage write fails: logs the error but does NOT throw — the user
   * is authenticated in-memory for this session.
   */
  // const verifyOtp = useCallback(
  //   async (phone: string, otp: string): Promise<AuthUser | null> => {
  //     const payload: VerifyOtpPayload = {
  //       phoneNumber: '+91' + phone,
  //       otp,
  //       smsCountry: true,
  //     };
  //     if (__DEV__) {
  //       console.log('[AuthContext] verifyOtp payload:', payload);
  //     }

  //     const response = await AuthApi.GetOtpForLoginWithNumber(payload);
  //     const serverToken: string | null = response?.token ?? null;

  //     // The server response shape may vary. Extract user defensively.
  //     const rawUser: unknown = response?.user ?? null;

  //     let nextUser: AuthUser | null = null;
  //     if (rawUser && typeof rawUser === 'object') {
  //       const u = rawUser as Record<string, unknown>;
  //       nextUser = {
  //         id: typeof u.id === 'string' ? u.id : String(u.id ?? ''),
  //         userName:
  //           typeof u.userName === 'string' ? u.userName : null,
  //         phoneNumber:
  //           typeof u.phoneNumber === 'string' ? u.phoneNumber : null,
  //         email: typeof u.email === 'string' ? u.email : null,
  //       };
  //     }

  //     // Update in-memory state immediately (auth gate reacts synchronously).
  //     setUser(nextUser);
  //     setToken(serverToken);
  //     setPhoneNumber(phone);

  //     // Persist to storage. Failure is non-fatal — user is authenticated
  //     // in memory for this session and warned in DEV.
  //     try {
  //       await writeAuthSession(nextUser, serverToken, phone);
  //     } catch (storageError) {
  //       if (__DEV__) {
  //         console.warn(
  //           '[AuthContext] verifyOtp: session persist failed (non-fatal):',
  //           storageError,
  //         );
  //       }
  //     }

  //     return nextUser;
  //   },
  //   [],
  // );

  const verifyOtp = useCallback(
  async (phone: string, otp: string): Promise<AuthUser | null> => {
    const payload: VerifyOtpPayload = {
      phoneNumber: '+91' + phone,
      otp,
      smsCountry: true,
    };

    if (__DEV__) {
      console.log('[AuthContext] verifyOtp payload:', payload);
    }

    const response = await AuthApi.GetOtpForLoginWithNumber(payload);

    if (__DEV__) {
      console.log(
        '[AuthContext] verifyOtp response:',
        response,
      );
    }

    const serverToken =
      typeof response?.data === 'string'
        ? response.data
        : null;

    const nextUser: AuthUser = {
      id: response?.email || phone,
      userName: response?.userName || '',
      email: response?.email || '',
      phoneNumber: '+91' + phone,
    };

    // Update state immediately
    setUser(nextUser);
    setToken(serverToken);
    setPhoneNumber(phone);

    try {
      await writeAuthSession(
        nextUser,
        serverToken,
        phone,
      );

      if (__DEV__) {
        console.log(
          '[AuthContext] Session saved successfully',
        );
      }
    } catch (storageError) {
      console.warn(
        '[AuthContext] Failed to save session:',
        storageError,
      );
    }

    return nextUser;
  },
  [],
);
  /**
   * Clears all authentication state — both in-memory and persisted.
   * Guarded against concurrent calls (e.g. double-tap Logout button).
   */
  const logout = useCallback(async (): Promise<void> => {
    if (isLoggingOut.current) {
      return;
    }
    isLoggingOut.current = true;

    try {
      // Clear in-memory state first so the UI updates instantly.
      setUser(null);
      setToken(null);
      setPhoneNumber(null);

      // Clear persisted session.
      await clearAuthSession();
    } catch (error) {
      if (__DEV__) {
        console.warn('[AuthContext] logout error:', error);
      }
    } finally {
      isLoggingOut.current = false;
    }
  }, []);

  // ─── Context Value ────────────────────────────────────────────────────────

  const value = useMemo<AuthContextValue>(
    () => ({
      // KEY FIX: derive from !!user, NOT !!token.
      // The server does not reliably return a token field.
      isAuthenticated:
  Boolean(user) || Boolean(token),
      user,
      token,
      phoneNumber,
      loading,
      loginStart,
      registerStart,
      verifyOtp,
      logout,
      refreshUser,
    }),
    [
      user,
      token,
      phoneNumber,
      loading,
      loginStart,
      registerStart,
      verifyOtp,
      logout,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Access the auth context from any component inside AuthProvider.
 * Throws if called outside the provider — this is intentional to catch
 * mis-usage at development time.
 */
export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('[useAuth] must be called inside an <AuthProvider>.');
  }
  return ctx;
};

export default AuthContext;
