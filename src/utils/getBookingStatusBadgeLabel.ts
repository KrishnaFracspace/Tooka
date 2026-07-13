import { BOOKING_STATUS } from '../types/booking';
import { getBookingSection } from './getBookingSection';

export function getBookingStatusBadgeLabel(status: string): string {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case BOOKING_STATUS.PENDING_PAYMENT:
      return 'Pending';
    case BOOKING_STATUS.CONFIRMED:
      return 'Confirmed';
    case BOOKING_STATUS.CHECKED_IN:
      return 'Checked In';
    case BOOKING_STATUS.COMPLETED:
      return 'Completed';
    case BOOKING_STATUS.CANCELLED_BY_USER:
    case BOOKING_STATUS.CANCELLED_BY_SPA:
    case BOOKING_STATUS.NO_SHOW:
    case BOOKING_STATUS.REFUNDED:
    case BOOKING_STATUS.DISPUTED:
      return 'Cancelled';
    default:
      return getBookingSection(status) === 'cancelled' ? 'Cancelled' : 'Booking';
  }
}
