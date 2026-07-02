export type LocationPermissionStatus =
  | 'unknown'
  | 'granted'
  | 'denied'
  | 'blocked'
  | 'restricted'
  | 'disabled'
  | 'unavailable';

export type StoredLocation = {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
  permission: LocationPermissionStatus;
  error?: string | null;
  locality?: string | null;
  subLocality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export type LocationContextValue = {
  location: StoredLocation | null;
  loading: boolean;
  refreshLocation: (forceRequestPermission?: boolean) => Promise<StoredLocation | null>;
  getSavedLocation: () => Promise<StoredLocation | null>;
  hasLocationPermission: () => Promise<boolean>;
};
