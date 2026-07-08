import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AuthApi from '../api/AuthApi';
import {
  readAuthSession,
  writeAuthSession,
  clearAuthSession,
} from '../utils/authStorage';
import type { AuthUser, AuthContextValue } from '../types/auth';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Hydrate session on app start
  const hydrate = useCallback(async (): Promise<void> => {
    try {
      const session = await readAuthSession();
      if (session.token && session.user) {
        setUser(session.user);
        setToken(session.token);
        setIsLoggedIn(true);
      }
      // console.log('AuthContext hydrated:', session.token);
    } catch (error) {
      if (__DEV__) {
        console.warn('[AuthContext] hydration error:', error);
      }
      await clearAuthSession();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Login handler
  const login = useCallback(async (phone: string, otp: string): Promise<AuthUser> => {
    try {
      const response = await AuthApi.login({ phone, otp });
      const { token: serverToken, user: serverUser } = response.data;

      // Update state
      setToken(serverToken);
      setUser(serverUser);
      setIsLoggedIn(true);

      // Save to storage
      await writeAuthSession(serverToken, serverUser, true);

      return serverUser;
    } catch (error) {
      if (__DEV__) {
        console.log('[AuthContext] login error:', error);
      }
      throw error;
    }
  }, []);

  // Register handler
  const register = useCallback(
    async (phone: string, otp: string, fullName: string): Promise<AuthUser> => {
      try {
        const response = await AuthApi.register({
          phone,
          otp,
          username: fullName,
          fullName,
          email: '',
        });
        const { token: serverToken, user: serverUser } = response.data;

        // Update state
        setToken(serverToken);
        setUser(serverUser);
        setIsLoggedIn(true);

        // Save to storage
        await writeAuthSession(serverToken, serverUser, true);

        return serverUser;
      } catch (error) {
        if (__DEV__) {
          console.log('[AuthContext] register error:', error);
        }
        throw error;
      }
    },
    []
  );

  // Logout handler
  const logout = useCallback(async (): Promise<void> => {
    try {
      setUser(null);
      setToken(null);
      setIsLoggedIn(false);
      await clearAuthSession();
    } catch (error) {
      if (__DEV__) {
        console.warn('[AuthContext] logout error:', error);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn,
      isAuthenticated: isLoggedIn, // Backward compatibility
      user,
      token,
      loading,
      login,
      register,
      logout,
    }),
    [isLoggedIn, user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('[useAuth] must be called inside an <AuthProvider>.');
  }
  return ctx;
};

export default AuthContext;
