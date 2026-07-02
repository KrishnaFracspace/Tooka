export type AuthStep = 'phone' | 'otp' | 'name' | 'success';

export interface AuthFormState {
  phone: string;
  otp: string;
  name: string;
}

export interface AuthActionResult {
  success: boolean;
  message?: string;
}
