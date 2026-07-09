import authAxiosClient from './authAxiosClient';
import type { ProfileApiResponse, UpdateProfilePayload, UserProfile } from '../types/profile';
import { normalizeProfileResponse } from '../utils/profileMappers';

const ProfileApi = {
  getProfile: async (signal?: AbortSignal): Promise<UserProfile> => {
    const response = await authAxiosClient.get<ProfileApiResponse>('/users/profile', { signal });
    return normalizeProfileResponse(response.data);
  },

  updateProfile: async (
    payload: UpdateProfilePayload,
    signal?: AbortSignal,
  ): Promise<UserProfile | null> => {
    const response = await authAxiosClient.put<ProfileApiResponse>('/users/profile', payload, { signal });
    const raw = response.data?.data ?? response.data?.profile ?? response.data?.user ?? null;
    return raw ? normalizeProfileResponse(response.data) : null;
  },
};

export default ProfileApi;
