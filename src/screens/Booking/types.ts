import type { ImageSourcePropType } from 'react-native';

export type GuestCount = '1' | '2' | '3' | '4+';

export type TimeSlotStatus = 'available' | 'disabled';

export interface BookingService {
  name: string;
  durationMinutes: number;
  price: number;
  image: ImageSourcePropType;
}

export interface BookingDate {
  id: string;
  label: string;
}

export interface TimeSlot {
  id: string;
  label: string;
  status: TimeSlotStatus;
}

export interface BookingOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
}
