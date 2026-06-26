// ─────────────────────────────────────────────────────────────────────────────
// Auth Type Definitions
// Single source of type truth for the entire authentication system.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Represents an authenticated user returned by the server.
 * All fields except `id` are optional — the server may omit them
 * for partially-registered users. Handle missing fields with fallbacks.
 */
export interface AuthUser {
  id: string;
  userName?: string | null;
  phoneNumber?: string | null;
  email?: string | null;
}

/**
 * Shape of what is persisted to AsyncStorage.
 * Token is stored if available but is NOT used as the auth signal —
 * `user` being non-null is the single source of auth truth.
 */
export interface StoredAuthData {
  user: AuthUser | null;
  token: string | null;
  phone: string | null;
}

/**
 * Full public API of the AuthContext.
 * Consumed via `useAuth()` throughout the app.
 */
export interface AuthContextValue {
  /** True when a user object exists in state (regardless of token). */
  isAuthenticated: boolean;

  /** The currently authenticated user, or null if logged out. */
  user: AuthUser | null;

  /** The raw token returned by the server (may be null). */
  token: string | null;

  /** The phone number used in the current login/register flow. */
  phoneNumber: string | null;

  /**
   * True during the initial AsyncStorage hydration on app startup.
   * Screens should show a loading indicator while this is true
   * to prevent Login ↔ Profile flicker.
   */
  loading: boolean;

  /** Initiates login: sends OTP to the given phone number. */
  loginStart: (phoneNumber: string) => Promise<void>;

  /** Initiates registration then immediately triggers OTP login. */
  registerStart: (name: string, phoneNumber: string, email: string) => Promise<void>;

  /**
   * Verifies OTP, persists the authenticated user, and returns the user object.
   * Returns null if verification fails (caller should handle the error).
   */
  verifyOtp: (phoneNumber: string, otp: string) => Promise<AuthUser | null>;

  /**
   * Clears all in-memory auth state and removes the persisted session
   * from AsyncStorage. Safe to call multiple times.
   */
  logout: () => Promise<void>;

  /**
   * Re-reads the persisted session from AsyncStorage and updates state.
   * Useful after a background token refresh or to recover from a stale state.
   */
  refreshUser: () => Promise<void>;
}
