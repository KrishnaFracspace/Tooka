import { NotificationPayload } from './notificationTypes';

class NotificationNavigation {
  navigate(payload: NotificationPayload) {
    switch (payload.type) {
      case 'BOOKING_CONFIRMED':
        break;

      case 'PAYMENT_SUCCESS':
        break;

      case 'PROMOTION':
        break;

      default:
        break;
    }
  }
}

export default new NotificationNavigation();