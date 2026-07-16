import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ProfileApi from '../api/ProfileApi';
import { useAuth } from './AuthContext';
import { useLocation } from './LocationContext';
import type {
  ProfileContextValue,
  ProfileCurrentLocation,
  ResidentialLocation,
  UpdateProfilePayload,
  UserProfile,
} from '../types/profile';
import { getProfileErrorMessage } from '../utils/profileValidation';
import { mergeProfile } from '../utils/profileMappers';
import { resolveImageUri } from '../types/profileImage';

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

const toCurrentLocation = (
  latitude: number | null | undefined,
  longitude: number | null | undefined,
): ProfileCurrentLocation | null => {
  if (typeof latitude !== 'number' || typeof longitude !== 'number') {
    return null;
  }

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { location } = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const inFlightRefresh = useRef<Promise<UserProfile | null> | null>(null);
  const refreshController = useRef<AbortController | null>(null);
  const updateController = useRef<AbortController | null>(null);
  const hasLoadedOnce = useRef<boolean>(false);
  const currentLocationRef = useRef<ProfileCurrentLocation | null>(null);

  const currentLocation = useMemo(
    () => toCurrentLocation(location?.latitude, location?.longitude),
    [location?.latitude, location?.longitude],
  );

  useEffect(() => {
    currentLocationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    if (!currentLocation) {
      return;
    }

    setProfile((prev) => {
      if (!prev) {
        return prev;
      }

      if (
        prev.currentLocation?.latitude === currentLocation.latitude &&
        prev.currentLocation?.longitude === currentLocation.longitude
      ) {
        return prev;
      }

      return mergeProfile(prev, { currentLocation });
    });
  }, [currentLocation]);

  useEffect(
    () => () => {
      refreshController.current?.abort();
      updateController.current?.abort();
      inFlightRefresh.current = null;
    },
    [],
  );

  const refreshProfile = useCallback(
    async (options?: { force?: boolean }): Promise<UserProfile | null> => {
      if (!isAuthenticated || authLoading) {
        return null;
      }

      if (inFlightRefresh.current && !options?.force) {
        return inFlightRefresh.current;
      }

      if (options?.force) {
        refreshController.current?.abort();
        inFlightRefresh.current = null;
      }

      const controller = new AbortController();
      refreshController.current = controller;

      const request = (async () => {
        if (hasLoadedOnce.current) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        try {
          const nextProfile = await ProfileApi.getProfile(controller.signal);
          const merged = mergeProfile(nextProfile, {
            currentLocation: currentLocationRef.current ?? nextProfile.currentLocation,
          });
          setProfile(merged);
          hasLoadedOnce.current = true;
          return merged;
        } catch (refreshError) {
          const message = getProfileErrorMessage(refreshError);
          setError(message);
          return null;
        } finally {
          setLoading(false);
          setRefreshing(false);
          if (refreshController.current === controller) {
            refreshController.current = null;
          }
          inFlightRefresh.current = null;
        }
      })();

      inFlightRefresh.current = request;
      return request;
    },
    [authLoading, isAuthenticated],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      setProfile(null);
      setError(null);
      hasLoadedOnce.current = false;
      inFlightRefresh.current = null;
      refreshController.current?.abort();
      updateController.current?.abort();
      return;
    }

    if (!authLoading) {
      void refreshProfile();
    }
  }, [authLoading, isAuthenticated, refreshProfile]);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<UserProfile | null> => {
      if (saving) {
        return profile;
      }

      setSaving(true);
      setError(null);
      updateController.current?.abort();
      const controller = new AbortController();
      updateController.current = controller;

      try {
        const responseProfile = await ProfileApi.updateProfile(payload, controller.signal);
        const optimisticPatch: Partial<UserProfile> = {
          username: payload.username ?? profile?.username ?? null,
          fullName: payload.fullName ?? profile?.fullName ?? null,
          displayName: payload.displayName ?? profile?.displayName ?? null,
          email: payload.email ?? profile?.email ?? null,
          phone: payload.phone ?? profile?.phone ?? null,
          gender: payload.gender ?? profile?.gender ?? null,
          dateOfBirth: payload.dateOfBirth ?? profile?.dateOfBirth ?? null,
          avatarUrl: resolveImageUri(payload.avatar ?? null) ?? profile?.avatarUrl ?? null,
          currentLocation: currentLocationRef.current,
        };

        const merged = mergeProfile(profile, responseProfile ?? optimisticPatch);
        // console.log("Update profile payload: ", payload);
        // console.log("Update profile merged: ", merged);
        setProfile(merged);
        return merged;
      } catch (updateError) {
        const message = getProfileErrorMessage(updateError);
        console.log("Error in update profile", updateError);
        setError(message);
        throw updateError;
      } finally {
        if (updateController.current === controller) {
          updateController.current = null;
        }
        setSaving(false);
      }
    },
    [profile, saving],
  );

  const setResidentialLocation = useCallback((residentialLocation: ResidentialLocation | null) => {
    setProfile((prev) => {
      if (!prev) return prev;
      if (prev.residentialLocation?.formattedAddress === residentialLocation?.formattedAddress) {
        return prev;
      }
      return mergeProfile(prev, { residentialLocation });
    });
  }, []);

  const setLocalProfile = useCallback((nextProfile: UserProfile | null) => {
    setProfile(nextProfile);
  }, []);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    hasLoadedOnce.current = false;
    inFlightRefresh.current = null;
    refreshController.current?.abort();
    updateController.current?.abort();
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      loading,
      isLoading: loading,
      refreshing,
      saving,
      error,
      currentLocation,
      refreshProfile,
      updateProfile,
      clearProfile,
      setProfile: setLocalProfile,
      setResidentialLocation,
      setLocalProfile,
    }),
    [
      currentLocation,
      clearProfile,
      error,
      loading,
      profile,
      refreshProfile,
      refreshing,
      saving,
      setLocalProfile,
      setResidentialLocation,
      updateProfile,
    ],
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = (): ProfileContextValue => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }

  return context;
};

export default ProfileContext;
