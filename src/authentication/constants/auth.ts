import { Platform } from 'react-native';
import type { AuthActionResult } from '../types/auth';

export const AUTH_COLORS = {
  primary: '#FFB02E',
  background: '#FFF8F0',
  text: '#1F1F1F',
  secondaryText: '#8D8D8D',
  border: '#E7E2DA',
  white: '#FFFFFF',
  error: '#D64545',
};

export const AUTH_CONFIG = {
  phoneLength: 10,
  otpLength: 6,
  resendSeconds: 30,
  minNameLength: 2,
  mockExistingUser: false,
};

export const AUTH_TEXT = {
  title: 'Welcome back',
  subtitle: 'Login to continue your wellness journey',
  otpTitle: 'Verify your number',
  otpSubtitle: 'Enter the 6-digit code sent to',
  nameTitle: "What's your name?",
  nameSubtitle: 'Help us personalize your experience.',
};

export const delay = (ms: number = 600) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export const sendOtp = async (phone: string): Promise<AuthActionResult> => {
  await delay(1000);
  return {
    success: phone.length === AUTH_CONFIG.phoneLength,
    message: phone.length === AUTH_CONFIG.phoneLength ? 'OTP sent' : 'Please enter a valid phone number',
  };
};

export const verifyOtp = async (otp: string): Promise<AuthActionResult> => {
  await delay(700);
  return {
    success: otp === '123456',
    message: otp === '123456' ? 'OTP verified' : 'Wrong OTP. Please try 123456.',
  };
};

export const saveName = async (name: string): Promise<AuthActionResult> => {
  await delay(700);
  return {
    success: name.trim().length >= AUTH_CONFIG.minNameLength,
    message: name.trim().length >= AUTH_CONFIG.minNameLength ? 'Profile saved' : 'Please enter your name',
  };
};

export const checkExistingUser = async (phone: string): Promise<boolean> => {
  await delay(250);
  return AUTH_CONFIG.mockExistingUser;
};

export const getKeyboardBehavior = () => (Platform.OS === 'ios' ? 'padding' : 'height');
