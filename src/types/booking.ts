export type BookingStatus =
  | 'pending'
  | 'upcoming'
  | 'completed'
  | 'cancelled';

export interface Booking {
  id: string;

  spaId: string;
  spaName: string;
  spaImage?: string;
  location: string;

  serviceId?: string;
  serviceName?: string;

  customerName: string;
  customerEmail: string;
  enquiryMessage: string;

  people: string;

  bookingId: string;

  status: BookingStatus;

  date: string;
  time: string;

  note?: string;

  createdAt: string;
}