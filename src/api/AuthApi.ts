import axiosClient from './axiosClient';

export interface RegisterPayload {
  userName: string;
  phoneNumber: string;
  email: string;
  countryCode: string;
}

export interface LoginPayload {
  phoneNumber: string;
  smsCountry: boolean;
}

export interface VerifyOtpPayload {
  phoneNumber: string;
  otp: string;
  smsCountry: boolean;
}

const AuthApi = {
  GetRegistration: async (payload: RegisterPayload) => {
    try {
      const resp = await axiosClient.post('/users/userRegisterationWithoutPassword', payload);
      return resp.data;
    } catch (error: any) {
      throw error?.response?.data ?? error;
    }
  },

  GetLogin: async (payload: LoginPayload) => {
    try {
      const stringifiedPayload = JSON.stringify(payload);
      const resp = await axiosClient.post('/users/loginWithPhoneNumber', stringifiedPayload);
      return resp.data;
    } catch (error: any) {
      throw error?.response?.data ?? error;
    }
  },

  GetOtpForLoginWithNumber: async (payload: VerifyOtpPayload) => {
    try {
      const stringifiedPayload = JSON.stringify(payload);
      const resp = await axiosClient.post('/users/loginOTPverificationWithPhoneNumber', stringifiedPayload);
      return resp.data;
    } catch (error: any) {
      throw error?.response?.data ?? error;
    }
  },
};

export default AuthApi;
