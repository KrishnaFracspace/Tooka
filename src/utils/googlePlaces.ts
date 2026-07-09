import type { ResidentialLocation } from '../types/profile';

type GoogleAddressComponent = {
  long_name?: string;
  short_name?: string;
  types?: string[];
};

type GooglePlaceDetails = {
  formatted_address?: string;
  place_id?: string;
  geometry?: {
    location?: {
      lat?: number;
      lng?: number;
    };
  };
  address_components?: GoogleAddressComponent[];
};

const getAddressPart = (
  components: GoogleAddressComponent[] | undefined,
  types: string[],
): string | null => {
  const match = components?.find((component) =>
    component.types?.some((type) => types.includes(type)),
  );

  return match?.long_name ?? match?.short_name ?? null;
};

export const residentialLocationFromGooglePlace = (
  details: GooglePlaceDetails | null | undefined,
): ResidentialLocation | null => {
  const latitude = details?.geometry?.location?.lat;
  const longitude = details?.geometry?.location?.lng;
  const formattedAddress = details?.formatted_address;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    !formattedAddress
  ) {
    return null;
  }

  return {
    formattedAddress,
    latitude,
    longitude,
    city:
      getAddressPart(details.address_components, ['locality']) ??
      getAddressPart(details.address_components, ['administrative_area_level_2']),
    state: getAddressPart(details.address_components, ['administrative_area_level_1']),
    country: getAddressPart(details.address_components, ['country']),
    postalCode: getAddressPart(details.address_components, ['postal_code']),
    placeId: details.place_id ?? null,
  };
};
