import axios from 'axios';

export interface ReverseGeocodeAddress {
  locality?: string | null;
  subLocality?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface LocationDisplayParts {
  primary: string;
  secondary: string;
  isLoading: boolean;
}

const GOOGLE_GEOCODING_API_KEY = 'AIzaSyA3ZlDDtq14fvyne4xX1eXDWn9QKsIRsjw';
const LOCATION_CACHE_TTL_MS = 10 * 60 * 1000;

const normalizeValue = (value?: string | null): string | null => {
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const findAddressComponent = (
  components: Array<{ long_name?: string; short_name?: string; types?: string[] }> | undefined,
  types: string[],
): string | null => {
  const match = components?.find((component) =>
    component.types?.some((type) => types.includes(type)),
  );

  return normalizeValue(match?.long_name ?? match?.short_name);
};

export const getLocationDisplayParts = (
  address: ReverseGeocodeAddress | null | undefined,
  options?: { isLoading?: boolean },
): LocationDisplayParts => {
  const normalizedAddress = {
    locality: normalizeValue(address?.locality),
    subLocality: normalizeValue(address?.subLocality),
    city: normalizeValue(address?.city),
    state: normalizeValue(address?.state),
    country: normalizeValue(address?.country),
  };

  const primary =
    normalizedAddress.locality ??
    normalizedAddress.subLocality ??
    normalizedAddress.city ??
    'Unknown Location';

  const secondary =
    normalizedAddress.city ??
    normalizedAddress.state ??
    normalizedAddress.country ??
    (primary === 'Unknown Location' ? 'Unknown Location' : primary);

  return {
    primary,
    secondary,
    isLoading: Boolean(options?.isLoading),
  };
};

export const isAddressCacheFresh = (
  timestamp: number | null | undefined,
): boolean => {
  if (!timestamp) {
    return false;
  }

  return Date.now() - timestamp < LOCATION_CACHE_TTL_MS;
};

export const resolveAddressForCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeAddress> => {
  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json',
      {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_GEOCODING_API_KEY,
          language: 'en',
        },
        timeout: 8000,
      },
    );

    const results = Array.isArray(response?.data?.results)
      ? response.data.results
      : [];

    const [firstResult] = results;
    if (!firstResult?.address_components) {
      return {};
    }

    const locality = findAddressComponent(firstResult.address_components, [
      'locality',
      'sublocality',
      'sublocality_level_1',
    ]);
    const subLocality = findAddressComponent(firstResult.address_components, [
      'sublocality',
      'sublocality_level_1',
      'neighborhood',
    ]);
    const city =
      findAddressComponent(firstResult.address_components, ['locality']) ??
      findAddressComponent(firstResult.address_components, [
        'administrative_area_level_2',
      ]);
    const state = findAddressComponent(firstResult.address_components, [
      'administrative_area_level_1',
    ]);
    const country = findAddressComponent(firstResult.address_components, [
      'country',
    ]);

    return {
      locality: locality ?? null,
      subLocality: subLocality ?? null,
      city: city ?? null,
      state: state ?? null,
      country: country ?? null,
    };
  } catch (error) {
    if (__DEV__) {
      console.warn('[locationAddress] reverse geocoding failed', error);
    }
    return {};
  }
};
