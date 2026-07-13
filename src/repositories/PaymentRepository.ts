import PaymentApi from '../api/PaymentApi';
import { paymentLogger } from '../payment/paymentLogger';
import { PaymentType } from '../payment/PaymentTypes';
import type {
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  PaymentVerificationResponse,
} from '../payment/PaymentTypes';

export interface InitiateBookingPaymentParams {
  bookingId: string;
  signal?: AbortSignal;
}

export interface VerifyPaymentParams {
  paymentId: string;
  signal?: AbortSignal;
}

export const PaymentRepository = {
  initiateBookingPayment: async ({
    bookingId,
    signal,
  }: InitiateBookingPaymentParams): Promise<InitiatePaymentResponse> => {
    const payload: InitiatePaymentPayload = {
      booking_id: bookingId,
      payment_type: PaymentType.BookingAmount,
    };

    try {
      return await PaymentApi.initiatePayment(payload, signal);
    } catch (error) {
      paymentLogger.error('Initiate Payment Failed', error);
      throw error;
    }
  },

  verifyPaymentStatus: async ({
    paymentId,
    signal,
  }: VerifyPaymentParams): Promise<PaymentVerificationResponse> => {
    try {
      return await PaymentApi.verifyPaymentStatus({ paymentId, signal });
    } catch (error) {
      paymentLogger.error('Verify Payment Failed', error);
      throw error;
    }
  },
};

export default PaymentRepository;
