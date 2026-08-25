export interface DistanceResult {
  distanceStr: string;
  distanceMeters: number | null;
}

export function formatDistanceMeters(distanceMeters: number): string {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }
  return `${(distanceMeters / 1000).toFixed(1)} km`;
}

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function getSpaDistance(
  spa: {
    distance_m?: number | string | null;
    lat?: number | string | null;
    lng?: number | string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
  },
  userLat?: number | null,
  userLng?: number | null,
): DistanceResult {
  try {
    // 1. Prefer spa.distance_m if valid non-negative finite number
    let rawDistM: number | null = null;
    if (typeof spa.distance_m === 'number') {
      rawDistM = spa.distance_m;
    } else if (typeof spa.distance_m === 'string' && spa.distance_m.trim() !== '') {
      const parsed = Number.parseFloat(spa.distance_m);
      if (Number.isFinite(parsed)) {
        rawDistM = parsed;
      }
    }

    if (rawDistM !== null && Number.isFinite(rawDistM) && rawDistM >= 0) {
      return {
        distanceStr: formatDistanceMeters(rawDistM),
        distanceMeters: rawDistM,
      };
    }

    // 2. Fallback to Haversine calculation if coordinates are available
    const rawLat = spa.lat ?? spa.latitude;
    const rawLng = spa.lng ?? spa.longitude;

    const sLat = typeof rawLat === 'number' ? rawLat : typeof rawLat === 'string' ? Number.parseFloat(rawLat) : null;
    const sLng = typeof rawLng === 'number' ? rawLng : typeof rawLng === 'string' ? Number.parseFloat(rawLng) : null;

    if (
      userLat != null &&
      userLng != null &&
      Number.isFinite(userLat) &&
      Number.isFinite(userLng) &&
      sLat != null &&
      sLng != null &&
      Number.isFinite(sLat) &&
      Number.isFinite(sLng)
    ) {
      const calculatedM = calculateHaversineDistance(userLat, userLng, sLat, sLng);
      return {
        distanceStr: formatDistanceMeters(calculatedM),
        distanceMeters: calculatedM,
      };
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[getSpaDistance] Error calculating distance:', error);
    }
  }

  return {
    distanceStr: '--',
    distanceMeters: null,
  };
}
