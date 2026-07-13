export type BookingStatus = 'pending' | 'upcoming' | 'completed' | 'cancelled';

export type BookingSlotStatus = 'available' | 'booked' | 'blocked';

export interface BookingScheduleDate {
  id: string;
  label: string;
  date: string;
}

export interface BookingSlot {
  slotId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingSlotStatus;
}

export interface BookingPricing {
  total?: number | string | null;
  amount?: number | string | null;
  currency?: string | null;
  [key: string]: unknown;
}

export interface DirectBookingResponse {
  id: string;
  booking_ref?: string | null;
  pricing?: BookingPricing | null;
  status?: BookingStatus | string | null;
  [key: string]: unknown;
}

export interface BackendBookingListItem {
  id: string;
  bookingId: string;
  bookingReference?: string | null;
  spaName: string;
  spaImage?: string | null;
  location: string;
  guestCount: number | null;
  appointmentAt?: string | null;
  date: string;
  time: string;
  status: BookingStatus;
  pricing?: BookingPricing | null;
  raw: Record<string, unknown>;
}

export interface BookingListResult {
  items: BackendBookingListItem[];
  page: number;
  hasMore: boolean;
}
