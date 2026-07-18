export type BookingStatus = 'pending' | 'upcoming' | 'completed' | 'cancelled';

export type BookingSection = 'upcoming' | 'completed' | 'cancelled';

export const BOOKING_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  CHECKED_IN: 'checked_in',
  COMPLETED: 'completed',
  CANCELLED_BY_USER: 'cancelled_by_user',
  CANCELLED_BY_SPA: 'cancelled_by_spa',
  NO_SHOW: 'no_show',
  REFUNDED: 'refunded',
  DISPUTED: 'disputed',
} as const;

export type BackendBookingStatus =
  (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS];

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

export interface BackendBookingRaw {
  amount_paid?: string | number | null;
  amount_total?: string | number | null;
  currency?: string;
  spa_snapshot?: {
    name: string;
    address: string;
    locality_name: string;
    city_name: string;
    cover_photo_url: string;
  }
  payment?: {
    payment_amount?: number;
    payment_currency?: string;
    cf_payment_id?: string;
    payment_method?: {
      upi?: {
        upi_id?: string;
      }
    }
  };
  

  // keep the rest flexible
  [key: string]: unknown;
}

export interface BackendBookingListItem {
  id: string;
  bookingId: string;
  bookingReference?: string | null;
  spaName: string;
  spaImage?: string | null;
  serviceName?: string | null;
  location: string;
  guestCount: number | null;
  appointmentAt?: string | null;
  date: string;
  time: string;
  status: string;
  paymentStatus?: string | null;
  price?: number | string | null;
  currency?: string | null;
  pricing?: BookingPricing | null;
  // raw: Record<string, unknown>;
  raw: BackendBookingRaw;
}

export interface BookingListResult {
  items: BackendBookingListItem[];
  page: number;
  hasMore: boolean;
}

export interface MyBookingsResult {
  items: BackendBookingListItem[];
}

export interface MyBookingsApiResponse {
  success?: boolean;
  message?: string;
  data?: {
    rows?: Record<string, unknown>[] | null;
  };
}
