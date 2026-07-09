export type ProfileGender = 'female' | 'male' | 'other' | string;

export interface ProfileCurrentLocation {
  latitude: number;
  longitude: number;
}

export interface ResidentialLocation {
  formattedAddress: string;
  latitude: number;
  longitude: number;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postalCode?: string | null;
  placeId?: string | null;
}

export interface UserProfile {
  id: string;
  phone: string | null;
  email: string | null;
  username: string | null;
  fullName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  gender: ProfileGender | null;
  dateOfBirth: string | null;
  preferredLanguage: string | null;
  preferredCurrency: string | null;
  city: string | null;
  citySlug: string | null;
  cityId: string | null;
  isPhoneVerified: boolean | null;
  isEmailVerified: boolean | null;
  createdAt: string | null;
  role: string | null;
  userType: string | null;
  isActive: boolean | null;
  currentLocation: ProfileCurrentLocation | null;
  residentialLocation: ResidentialLocation | null;
}

export interface ProfileApiResponse {
  success?: boolean;
  data?: Partial<UserProfile> | null;
  profile?: Partial<UserProfile> | null;
  user?: Partial<UserProfile> | null;
}

export interface UpdateProfilePayload {
  username?: string;
  fullName?: string;
  displayName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
  lat?: number;
  lng?: number;
  lati?: number;
  lang?: number;
}

export interface ProfileContextValue {
  profile: UserProfile | null;
  loading: boolean;
  isLoading: boolean;
  refreshing: boolean;
  saving: boolean;
  error: string | null;
  currentLocation: ProfileCurrentLocation | null;
  refreshProfile: (options?: { force?: boolean }) => Promise<UserProfile | null>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<UserProfile | null>;
  clearProfile: () => void;
  setProfile: (profile: UserProfile | null) => void;
  setResidentialLocation: (location: ResidentialLocation | null) => void;
  setLocalProfile: (profile: UserProfile | null) => void;
}
