export interface AuthUser {
  id: string;
  userName: string;
  fullName?: string;
  email?: string;
  phoneNumber: string;
}

export interface AuthContextValue {
  isLoggedIn: boolean;
  isAuthenticated: boolean; // Keep for backward compatibility
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, otp: string) => Promise<AuthUser>;
  register: (phone: string, otp: string, fullName: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}
