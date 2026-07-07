import authAxiosClient from './authAxiosClient';

export interface SendOtpResponse {
  success: boolean;
  data: {
    phone: string;
    isRegistered: boolean;
    expiresInMinutes: number;
  };
}

export interface RegisterPayload {
  phone: string;
  otp: string;
  username: string;
  fullName: string;
  email: string;
}

export interface LoginPayload {
  phone: string;
  otp: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      userName: string;
      fullName?: string;
      email?: string;
      phoneNumber: string;
    };
  };
}

const AuthApi = {
  sendOtp: async (phone: string, signal?: AbortSignal): Promise<SendOtpResponse> => {
    try {
      const resp = await authAxiosClient.post('/auth/send-otp', { phone }, { signal });
      return resp.data;
    } catch (error: any) {
      throw error?.response?.data ?? error;
    }
  },

  register: async (payload: RegisterPayload, signal?: AbortSignal): Promise<AuthResponse> => {
    try {
      const resp = await authAxiosClient.post('/auth/register', payload, { signal });
      return resp.data;
    } catch (error: any) {
      throw error?.response?.data ?? error;
    }
  },

  login: async (payload: LoginPayload, signal?: AbortSignal): Promise<AuthResponse> => {
    try {
      const resp = await authAxiosClient.post('/auth/login', payload, { signal });
      return resp.data;
    } catch (error: any) {
      throw error?.response?.data ?? error;
    }
  },
};

export default AuthApi;
