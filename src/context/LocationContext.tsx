import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  getSavedLocation as readSavedLocation,
  hasLocationPermission as checkLocationPermission,
  refreshLocation as refreshDeviceLocation,
} from '../services/locationService';
import type {
  LocationContextValue,
  StoredLocation,
} from '../types/location';

const LocationContext =
  createContext<LocationContextValue | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<StoredLocation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getSavedLocation = useCallback(async () => {
    const saved = await readSavedLocation();
    setLocation(saved);
    return saved;
  }, []);

  const refreshLocation = useCallback(
    async (forceRequestPermission = false) => {
      const nextLocation = await refreshDeviceLocation(forceRequestPermission);
      setLocation(nextLocation);
      return nextLocation;
    },
    [],
  );

  const hasLocationPermission = useCallback(
    () => checkLocationPermission(),
    [],
  );

  useEffect(() => {
    let isMounted = true;

    const initializeLocation = async () => {
      try {
        const nextLocation = await refreshDeviceLocation(false);
        if (
          __DEV__ &&
          nextLocation?.permission === 'granted' &&
          nextLocation.latitude !== null &&
          nextLocation.longitude !== null
        ) {
          console.log('[LocationContext] startup location:', nextLocation);
        }

        if (isMounted) {
          setLocation(nextLocation);
        }
      } catch (error) {
        if (__DEV__) {
          console.warn('[LocationContext] initializeLocation error:', error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<LocationContextValue>(
    () => ({
      location,
      loading,
      refreshLocation,
      getSavedLocation,
      hasLocationPermission,
    }),
    [
      location,
      loading,
      refreshLocation,
      getSavedLocation,
      hasLocationPermission,
    ],
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextValue => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within LocationProvider');
  }

  return context;
};
