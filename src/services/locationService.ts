import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation, {
  type GeolocationError,
  type GeolocationResponse,
} from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';
import type {
  LocationPermissionStatus,
  StoredLocation,
} from '../types/location';
import {
  isAddressCacheFresh,
  resolveAddressForCoordinates,
} from './locationAddress';

const LOCATION_STORAGE_KEY = 'TOOKA_LOCATION_V1';
const GEOLOCATION_PERMISSION_DENIED = 1;
const GEOLOCATION_POSITION_UNAVAILABLE = 2;
const GEOLOCATION_TIMEOUT = 3;

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  authorizationLevel: 'whenInUse',
  locationProvider: Platform.OS === 'android' ? 'android' : 'auto',
});

const EMPTY_LOCATION: StoredLocation = {
  latitude: null,
  longitude: null,
  accuracy: null,
  timestamp: null,
  permission: 'unknown',
  error: null,
  locality: null,
  subLocality: null,
  city: null,
  state: null,
  country: null,
};

const STARTUP_FINAL_STATUSES: LocationPermissionStatus[] = [
  'denied',
  'blocked',
  'restricted',
  'disabled',
];

const LOCATION_PERMISSION_STATUSES: LocationPermissionStatus[] = [
  'unknown',
  'granted',
  'denied',
  'blocked',
  'restricted',
  'disabled',
  'unavailable',
];

const isValidStoredLocation = (value: unknown): value is StoredLocation => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const data = value as Partial<StoredLocation>;
  return LOCATION_PERMISSION_STATUSES.includes(
    data.permission as LocationPermissionStatus,
  );
};

const persistLocation = async (
  location: StoredLocation,
): Promise<StoredLocation> => {
  try {
    await AsyncStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(location),
    );
  } catch (error) {
    if (__DEV__) {
      console.warn('[locationService] persistLocation error:', error);
    }
  }

  return location;
};

const persistPermissionStatus = async (
  permission: LocationPermissionStatus,
  error: string | null = null,
): Promise<StoredLocation> => {
  return persistLocation({
    ...EMPTY_LOCATION,
    permission,
    error,
    timestamp: Date.now(),
  });
};

// const requestAndroidPermission =
//   async (): Promise<LocationPermissionStatus> => {
//     try {
//       const androidVersion = Number(Platform.Version);
//       if (androidVersion < 23) {
//         return 'granted';
//       }

//       const alreadyGranted = await PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );

//       if (alreadyGranted) {
//         return 'granted';
//       }

//       const result = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );

//       if (result === PermissionsAndroid.RESULTS.GRANTED) {
//         return 'granted';
//       }

//       if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
//         return 'blocked';
//       }

//       return 'denied';
//     } catch (error) {
//       if (__DEV__) {
//         console.warn('[locationService] requestAndroidPermission error:', error);
//       }
//       return 'unavailable';
//     }
//   };

const requestAndroidPermission = async (): Promise<LocationPermissionStatus> => {
  try {
    console.log('Android Version:', Platform.Version);

    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    console.log('alreadyGranted:', alreadyGranted);

    if (alreadyGranted) {
      return 'granted';
    }

    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    console.log('Permission Result:', result);

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return 'granted';
    }

    if (result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      return 'blocked';
    }

    return 'denied';
  } catch (e) {
    console.log('Permission Exception:', e);
    return 'unavailable';
  }
};

const requestLocationPermission =
  async (): Promise<LocationPermissionStatus> => {
    if (Platform.OS === 'android') {
      return requestAndroidPermission();
    }

    if (Platform.OS === 'ios') {
      return requestIOSPermission();
    }

    return 'unavailable';
  };

const requestIOSPermission =
  async (): Promise<LocationPermissionStatus> =>
    new Promise((resolve) => {
      Geolocation.requestAuthorization(
        () => resolve('granted'),
        (error) => {
          if (__DEV__) {
            console.warn('[locationService] requestAuthorization error:', error);
          }

          resolve(mapLocationError(error));
        },
      );
    });

// const getPosition = (): Promise<GeolocationResponse> =>
//   new Promise((resolve, reject) => {
//     Geolocation.getCurrentPosition(
//       resolve,
//       reject,
//       {
//         // enableHighAccuracy: true,
//         enableHighAccuracy: false,
//         timeout: 10000,
//         maximumAge: 30000,
//         // timeout: 15000,
//         // maximumAge: 10000,
//       },
//     );
//   });
const LOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 15000,
  maximumAge: 30000,
};

const getPosition = (): Promise<GeolocationResponse> =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      resolve,
      reject,
      LOCATION_OPTIONS,
    );
  });

const watchPositionUntilFound = (): Promise<GeolocationResponse> =>
  new Promise((resolve, reject) => {
    let watchId: number | null = null;

    const timeoutId = setTimeout(() => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
      }

      reject(new Error('Location timeout'));
    }, 20000);

    watchId = Geolocation.watchPosition(
      (position) => {
        if (
          position.coords.accuracy &&
          position.coords.accuracy <= 30
        ) {
          clearTimeout(timeoutId);
          Geolocation.clearWatch(watchId!);
          resolve(position);
        }
      },
      (error) => {
        clearTimeout(timeoutId);

        if (watchId !== null) {
          Geolocation.clearWatch(watchId);
        }

        reject(error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 2000,
        fastestInterval: 1000,
      },
    );
  });

const mapLocationError = (error: GeolocationError): LocationPermissionStatus => {
  switch (error.code) {
    case GEOLOCATION_PERMISSION_DENIED:
      return 'denied';
    case GEOLOCATION_POSITION_UNAVAILABLE:
      return 'unavailable';
    case GEOLOCATION_TIMEOUT:
    default:
      return 'unavailable';
  }
};

export async function getSavedLocation(): Promise<StoredLocation | null> {
  try {
    const raw = await AsyncStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidStoredLocation(parsed)) {
      return null;
    }

    return {
      latitude: parsed.latitude ?? null,
      longitude: parsed.longitude ?? null,
      accuracy: parsed.accuracy ?? null,
      timestamp: parsed.timestamp ?? null,
      permission: parsed.permission,
      error: parsed.error ?? null,
      locality: parsed.locality ?? null,
      subLocality: parsed.subLocality ?? null,
      city: parsed.city ?? null,
      state: parsed.state ?? null,
      country: parsed.country ?? null,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[locationService] getSavedLocation error:', error);
    }
    return null;
  }
}

export async function hasLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      return PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    } catch (error) {
      if (__DEV__) {
        console.warn('[locationService] hasLocationPermission error:', error);
      }
      return false;
    }
  }

  const saved = await getSavedLocation();
  return saved?.permission === 'granted';
}

// export async function getCurrentLocation(): Promise<StoredLocation | null> {
//   const permission = await requestLocationPermission();

//   if (permission !== 'granted') {
//     return persistPermissionStatus(permission);
//   }

//   try {
//     const position = await getPosition();

//     const nextLocation: StoredLocation = {
//       latitude: position.coords.latitude,
//       longitude: position.coords.longitude,
//       accuracy: position.coords.accuracy,
//       timestamp: position.timestamp || Date.now(),
//       permission: 'granted',
//       error: null,
//     };

//     return persistLocation(nextLocation);
//   } catch (error) {
//     const geoError = error as GeolocationError;
//     const permissionStatus = mapLocationError(geoError);
//     const saved = await persistPermissionStatus(
//       permissionStatus,
//       geoError.message ?? 'Unable to get current location.',
//     );

//     if (__DEV__) {
//       console.warn('[locationService] getCurrentLocation error:', geoError);
//     }
//     console.log('Location Error:', JSON.stringify(error, null, 2));
//     // console.log('Code:', error?.code);
//     // console.log('Message:', error?.message);
//     console.log('Full Error:', error);

//     return saved;
//   }
// }

export async function getCurrentLocation(): Promise<StoredLocation | null> {
  const permission = await requestLocationPermission();

  if (permission !== 'granted') {
    return persistPermissionStatus(permission);
  }

  let position: GeolocationResponse | null = null;

  try {
    console.log('Trying getCurrentPosition()...');

    position = await getPosition();
  } catch (error) {
    console.log('First attempt failed. Retrying...');

    try {
      await new Promise<void>(resolve => {
        setTimeout(() => resolve(), 1500);
      });

      position = await getPosition();
    } catch {
      console.log('Retry failed. Switching to watchPosition()...');

      try {
        position = await watchPositionUntilFound();
      } catch (watchError) {
        const geoError = watchError as GeolocationError;

        const permissionStatus = mapLocationError(geoError);

        const saved = await persistPermissionStatus(
          permissionStatus,
          geoError.message ?? 'Unable to get current location.',
        );

        console.warn(
          '[locationService] watchPosition failed:',
          geoError,
        );

        return saved;
      }
    }
  }

  const nextLocation: StoredLocation = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp || Date.now(),
    permission: 'granted',
    error: null,
    locality: null,
    subLocality: null,
    city: null,
    state: null,
    country: null,
  };

  const cached = await getSavedLocation();
  const shouldResolveAddress =
    cached?.latitude === nextLocation.latitude &&
    cached?.longitude === nextLocation.longitude &&
    isAddressCacheFresh(cached?.timestamp);

  if (shouldResolveAddress && cached?.city) {
    return persistLocation({
      ...nextLocation,
      locality: cached.locality ?? null,
      subLocality: cached.subLocality ?? null,
      city: cached.city ?? null,
      state: cached.state ?? null,
      country: cached.country ?? null,
    });
  }

  try {
    if (nextLocation.latitude === null || nextLocation.longitude === null) {
      throw new Error('Invalid coordinates');
    }

    const resolvedAddress = await resolveAddressForCoordinates(
      nextLocation.latitude,
      nextLocation.longitude,
    );

    return persistLocation({
      ...nextLocation,
      locality: resolvedAddress.locality ?? null,
      subLocality: resolvedAddress.subLocality ?? null,
      city: resolvedAddress.city ?? null,
      state: resolvedAddress.state ?? null,
      country: resolvedAddress.country ?? null,
    });
  } catch (error) {
    if (__DEV__) {
      console.warn('[locationService] failed to resolve address:', error);
    }

    return persistLocation({
      ...nextLocation,
      locality: cached?.locality ?? null,
      subLocality: cached?.subLocality ?? null,
      city: cached?.city ?? null,
      state: cached?.state ?? null,
      country: cached?.country ?? null,
    });
  }
}

export async function refreshLocation(
  forceRequestPermission = false,
): Promise<StoredLocation | null> {
  const saved = await getSavedLocation();

  if (
    !forceRequestPermission &&
    saved?.permission &&
    STARTUP_FINAL_STATUSES.includes(saved.permission)
  ) {
    return saved;
  }

  return getCurrentLocation();
}

export const locationService = {
  getCurrentLocation,
  getSavedLocation,
  refreshLocation,
  hasLocationPermission,
};
