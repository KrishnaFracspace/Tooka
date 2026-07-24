import axiosClient from './axiosClient';
import type { Spa } from '../types/spa';
import type { SpaDetails } from '../types/spaDetails';
import authAxiosClient from './authAxiosClient';

export interface DiscoverSpaParams {
  city: string;
}

export interface NearbySpaParams {
  lat: number;
  lng: number;
}

export interface DiscoverResponse {
  featuredSpas: Spa[];
}

interface DiscoverRawResponse {
  success?: boolean;
  data?: Spa[];
  curated?: Spa[];
}

interface ApiResponse<T> {
  data: T;
}

export const SpaApi = {
  /**
   * Get spas by city
   */
  getSpasByCity: async (city: string, signal?: AbortSignal): Promise<DiscoverResponse> => {
    const response = await authAxiosClient.get<DiscoverRawResponse>(
      '/spas/discover',
      {
        params: {
          city,
        },
        signal,
      },
    );

    const data = Array.isArray(response.data?.data) ? response.data.data : [];
    const curated = Array.isArray(response.data?.curated) ? response.data.curated : [];
    const featuredSpas = curated.length > 0 ? curated : data;

    return { featuredSpas };
  },

  /**
   * Get spa details
   */
  getSpaDetails: async (spaId: string, signal?: AbortSignal): Promise<SpaDetails> => {
    const response = await authAxiosClient.get<ApiResponse<SpaDetails>>(
      `/spas/${spaId}`,
      {
        signal,
      },
    );

    return response.data?.data ?? ({} as SpaDetails);
  },

  /**
   * Get nearby spas
   */
  getNearbySpas: async (
    lat: number,
    lng: number,
    page?: number,
    limit?: number,
    cancelToken?: any,
  ) => {
    const response = await authAxiosClient.get(
      '/spas/discover',
      {
        params: {
          lat,
          lng,
          page,
          limit,
        },
        cancelToken,
      },
    );

    return response.data;
  },

  /**
   * Search spas by query and city
   */
  searchSpas: async (query: string, cancelToken?: any): Promise<Spa[]> => {
    const response = await authAxiosClient.get<ApiResponse<Spa[]>>(
      '/spas/search',
      {
        params: {
          q: query,
          // city_id: query,
        },
        cancelToken,
      },
    );

    return Array.isArray(response.data?.data) ? response.data.data : [];
  },
};

export default SpaApi;