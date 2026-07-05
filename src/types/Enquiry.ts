export type BookingStatus = 'pending' | 'upcoming' | 'completed' | 'cancelled';

export interface EnquiryFormValues {
  name: string;
  email: string;
  message: string;
}

export interface SpaEnquiryContext {
  spaId: string;
  spaName: string;
  spaImage?: string;
  location: string;
  serviceId?: string;
  serviceName?: string;
}

export interface PendingEnquiry extends SpaEnquiryContext {
  id: string;
  customerName: string;
  customerEmail: string;
  enquiryMessage: string;
  bookingId: string;
  status: BookingStatus;
  people: string;
  date: string;
  time: string;
  note: string;
  createdAt: string;
}

export interface EnquirySubmissionPayload extends SpaEnquiryContext {
  customerName: string;
  customerEmail: string;
  enquiryMessage: string;
}

export interface BookingCardData {
  id: string;
  spaName: string;
  location: string;
  people: string;
  date: string;
  time: string;
  bookingId: string;
  status: BookingStatus;
  isPending?: boolean;
  note?: string;
  imageSource?: { uri: string };
}
