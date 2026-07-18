import { Platform } from 'react-native';
import ProfileApi from '../../api/ProfileApi';
import { readAuthSession } from '../../utils/authStorage';
import { getFcmToken } from '../../utils/fcmStorage';
import { getOnboarding } from '../../utils/onboardingStorage';
import type { UserProfile, UpdateProfilePayload } from '../../types/profile';

export interface SyncProfileResult {
  updated: boolean;
  profile: UserProfile | null;
}

let isSyncing = false;
let syncPromise: Promise<SyncProfileResult> | null = null;

const delay = (ms: number) => new Promise<void>(res => setTimeout(() => res(), ms));

const arraysEqualAsSets = (a: string[] | null | undefined, b: string[] | null | undefined): boolean => {
  const arrA = a || [];
  const arrB = b || [];
  if (arrA.length !== arrB.length) return false;
  
  const setA = new Set(arrA);
  const setB = new Set(arrB);
  
  if (setA.size !== setB.size) return false;
  for (const item of setA) {
    if (!setB.has(item)) return false;
  }
  return true;
};

const buildPayload = (serverProfile: UserProfile, newPushToken: string, newPlatform: 'ios' | 'android', newCategories: string[]): UpdateProfilePayload => {
  return {
    username: serverProfile.username ?? undefined,
    fullName: serverProfile.fullName ?? undefined,
    displayName: serverProfile.displayName ?? undefined,
    email: serverProfile.email ?? undefined,
    phone: serverProfile.phone ?? undefined,
    gender: serverProfile.gender ?? undefined,
    dateOfBirth: serverProfile.dateOfBirth ?? undefined,
    lat: serverProfile.residentialLocation?.latitude,
    lng: serverProfile.residentialLocation?.longitude,
    lati: serverProfile.currentLocation?.latitude,
    lang: serverProfile.currentLocation?.longitude,
    pushToken: newPushToken,
    pushTokenPlatform: newPlatform,
    preferredCategories: newCategories,
  };
};

const attemptGetProfile = async (signal?: AbortSignal, retries = 1): Promise<UserProfile> => {
  try {
    return await ProfileApi.getProfile(signal);
  } catch (error) {
    if (retries > 0) {
      if (__DEV__) console.warn('[profileSync] GET failed, retrying...', error);
      await delay(1000);
      return attemptGetProfile(signal, retries - 1);
    }
    throw error;
  }
};

const attemptUpdateProfile = async (payload: UpdateProfilePayload, signal?: AbortSignal, retries = 1): Promise<UserProfile | null> => {
  try {
    return await ProfileApi.updateProfile(payload, signal);
  } catch (error) {
    if (retries > 0) {
      if (__DEV__) console.warn('[profileSync] PUT failed, retrying...', error);
      await delay(1000);
      return attemptUpdateProfile(payload, signal, retries - 1);
    }
    if (__DEV__) console.warn('[profileSync] PUT failed after retries.', error);
    // Keep app usable, log only
    return null;
  }
};

export const syncProfileMetadata = (signal?: AbortSignal): Promise<SyncProfileResult> => {
  if (isSyncing && syncPromise) {
    return syncPromise;
  }

  isSyncing = true;
  if (__DEV__) console.log('[profileSync] Profile Sync Started');

  syncPromise = (async (): Promise<SyncProfileResult> => {
    try {
      // Step 1: Verify auth
      const { isLoggedIn } = await readAuthSession();
      if (!isLoggedIn) {
        if (__DEV__) console.log('[profileSync] Sync Skipped (not logged in)');
        return { updated: false, profile: null };
      }

      // Step 2: GET Profile
      const serverProfile = await attemptGetProfile(signal);
      if (__DEV__) console.log('[profileSync] Fetched Profile');

      // Step 3 & 4: Read & Validate Local Data
      const rawToken = await getFcmToken();
      const localToken = rawToken && rawToken.trim() !== '' ? rawToken : null;
      if (__DEV__) console.log('[profileSync] Loaded FCM Token:', localToken ? 'Present' : 'Missing');

      const onboarding = await getOnboarding();
      let localCategories: string[] | null = null;
      if (onboarding && onboarding.answers.preferences && onboarding.answers.preferences.length > 0) {
        localCategories = onboarding.answers.preferences;
      }
      if (__DEV__) console.log('[profileSync] Loaded Categories:', localCategories);

      const localPlatform = Platform.OS === 'ios' ? 'ios' : 'android';

      // Step 5 & 6: Compare values
      const hasValidToken = localToken !== null;
      const tokenDiffers = hasValidToken && serverProfile.pushToken !== localToken;
      
      const platformDiffers = hasValidToken && serverProfile.pushTokenPlatform !== localPlatform;
      
      const hasValidCategories = localCategories !== null;
      const categoriesDiffer = hasValidCategories && !arraysEqualAsSets(serverProfile.preferredCategories, localCategories);

      const needsUpdate = tokenDiffers || platformDiffers || categoriesDiffer;
      
      if (__DEV__) console.log('[profileSync] Comparison Result. Needs Update:', needsUpdate);

      // Step 7 & 8: Build payload & update if necessary
      if (needsUpdate) {
        const payload = buildPayload(
          serverProfile,
          localToken ?? serverProfile.pushToken ?? '', // Use local if valid, else fallback
          localPlatform,
          localCategories ?? serverProfile.preferredCategories ?? []
        );

        const updatedProfile = await attemptUpdateProfile(payload, signal);
        
        if (updatedProfile) {
          if (__DEV__) console.log('[profileSync] Update Success');
          return { updated: true, profile: updatedProfile };
        } else {
          if (__DEV__) console.log('[profileSync] Update Failed (gracefully handled)');
          return { updated: false, profile: serverProfile };
        }
      } else {
        if (__DEV__) console.log('[profileSync] Update Skipped');
        return { updated: false, profile: serverProfile };
      }

    } catch (error) {
      if (__DEV__) console.warn('[profileSync] Sync Failed', error);
      // Let caller handle complete failures (like GET failing)
      throw error;
    } finally {
      if (__DEV__) console.log('[profileSync] Sync Completed');
      isSyncing = false;
      syncPromise = null;
    }
  })();

  return syncPromise;
};
