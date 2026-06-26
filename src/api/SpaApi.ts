import axiosClient from './axiosClient';
import type { Spa } from '../types/spa';
import type { SpaDetails } from '../types/spaDetails';

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
  getSpaDetails: async (spaId: string): Promise<SpaDetails> => {
    const response = await axiosClient.get<ApiResponse<SpaDetails>>(
      `/spa/spas/${spaId}`,
    );

    return response.data?.data ?? ({} as SpaDetails);
  },

  /**
   * Get nearby spas
   */
  getNearbySpas: async (
    lat: number,
    lng: number,
  ) => {
    const response = await axiosClient.get(
      '/spa/spas',
      {
        params: {
          lat,
          lng,
        },
      },
    );

    return response.data;
  },
};

export default SpaApi;