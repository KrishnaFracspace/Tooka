import type { BookingDate, BookingOption, BookingService, GuestCount, TimeSlot } from './types';

export const bookingService: BookingService = {
  name: 'Body Massage',
  durationMinutes: 60,
  price: 1499,
  image: {
    uri: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
  },
};

export const guestCounts: GuestCount[] = ['1', '2', '3', '4+'];

export const bookingDates: BookingDate[] = [
  { id: 'today', label: 'Today 24 Jun' },
  { id: 'tomorrow', label: 'Thu, 25 Jun' },
  { id: 'next-day', label: 'Fri, 26 Jun' },
];

export const timeSlots: TimeSlot[] = [
  { id: '10-00', label: '10:00 AM', status: 'available' },
  { id: '10-40', label: '10:40 AM', status: 'available' },
  { id: '11-20', label: '11:20 AM', status: 'available' },
  { id: '12-00', label: '12:00 PM', status: 'available' },
  { id: '12-40', label: '12:40 PM', status: 'disabled' },
  { id: '13-20', label: '01:20 PM', status: 'available' },
  { id: '14-00', label: '02:00 PM', status: 'available' },
  { id: '14-40', label: '02:40 PM', status: 'available' },
  { id: '15-20', label: '03:20 PM', status: 'available' },
];

export const bookingOption: BookingOption = {
  id: 'standard-slot',
  title: 'Standard slot booking',
  subtitle: 'Refundable token charge',
  description: 'A refundable booking token reserves your slot and reduces no - shows',
  price: 199,
};
