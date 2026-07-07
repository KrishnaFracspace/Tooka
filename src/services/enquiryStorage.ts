import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PendingEnquiry } from '../types/Enquiry';

const PENDING_ENQUIRIES_KEY = 'pending_enquiries';

const buildBookingId = (): string => `TK${Math.floor(100000 + Math.random() * 900000)}`;

export const saveEnquiry = async (enquiry: PendingEnquiry): Promise<void> => {
  const existing = await getPendingEnquiries();
  const next = [enquiry, ...existing.filter((item) => item.id !== enquiry.id)];
  await AsyncStorage.setItem(PENDING_ENQUIRIES_KEY, JSON.stringify(next));
};

export const getPendingEnquiries = async (): Promise<PendingEnquiry[]> => {
  const raw = await AsyncStorage.getItem(PENDING_ENQUIRIES_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as PendingEnquiry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('[enquiryStorage] failed to parse enquiries', error);
    return [];
  }
};

export const removeEnquiry = async (id: string): Promise<void> => {
  const existing = await getPendingEnquiries();
  const next = existing.filter((item) => item.id !== id);
  await AsyncStorage.setItem(PENDING_ENQUIRIES_KEY, JSON.stringify(next));
};

export const clearAll = async (): Promise<void> => {
  await AsyncStorage.removeItem(PENDING_ENQUIRIES_KEY);
};

export const createPendingBooking = (
  payload: Omit<PendingEnquiry, 'id' | 'bookingId' | 'status' | 'people' | 'date' | 'time' | 'note' | 'createdAt'>,
): PendingEnquiry => {
  const now = new Date();
  return {
    id: `${now.getTime()}`,
    bookingId: buildBookingId(),
    status: 'pending',
    people: '1 Person',
    date: 'To be confirmed',
    time: 'To be confirmed',
    note: 'We received your enquiry. Our team will contact you shortly to confirm your booking date and preferred time.',
    createdAt: now.toISOString(),
    ...payload,
  };
};
