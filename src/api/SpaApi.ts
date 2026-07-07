import axiosClient from './axiosClient';
import tookaAxiosClient from './tookaAxiosClient';
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

interface ApiResponse<T> {
  data: T;
}

export const SpaApi = {
  /**
   * Get spas by city
   */
  getSpasByCity: async (city: string): Promise<Spa[]> => {
    const response = await axiosClient.get<ApiResponse<Spa[]>>(
      '/spa/spas/discover',
      {
        params: {
          city,
        },
      },
    );

    return Array.isArray(response.data?.data) ? response.data.data : [];
  },

  /**
   * Get spa details
   */
  getSpaDetails: async (spaId: string, signal?: AbortSignal): Promise<SpaDetails> => {
    const response = await axiosClient.get<ApiResponse<SpaDetails>>(
      `/spa/spas/${spaId}`,
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
    const response = await axiosClient.get(
      '/spa/spas/discover',
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