import authAxiosClient from './authAxiosClient';
import {
  mapInitiatePaymentResponse,
  mapPaymentVerificationResponse,
} from '../payment/PaymentMapper';
import { paymentLogger } from '../payment/paymentLogger';
import type {
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  PaymentVerificationResponse,
} from '../payment/PaymentTypes';

type ApiEnvelope<T> = {
  data?: T;
};

export interface PaymentStatusParams {
  paymentId: string;
  signal?: AbortSignal;
}

export const PaymentApi = {
  initiatePayment: async (
    payload: InitiatePaymentPayload,
    signal?: AbortSignal,
  ): Promise<InitiatePaymentResponse> => {
    paymentLogger.debug('Initiate Payment Request', payload);

    const response = await authAxiosClient.post<
      InitiatePaymentResponse | ApiEnvelope<InitiatePaymentResponse>
    >('/payments/initiate', payload, { signal });

    const mapped = mapInitiatePaymentResponse(response.data);
    paymentLogger.debug('Initiate Payment Response', mapped);
    return mapped;
  },

  verifyPaymentStatus: async ({
    paymentId,
    signal,
  }: PaymentStatusParams): Promise<PaymentVerificationResponse> => {
    paymentLogger.debug('Verification Request', { paymentId });

    const response = await authAxiosClient.get<
      PaymentVerificationResponse | ApiEnvelope<PaymentVerificationResponse>
    >(`/payments/${paymentId}/status`, { signal });

    const mapped = mapPaymentVerificationResponse(response.data);
    paymentLogger.debug('Verification Response', mapped);
    return mapped;
  },
};

export default PaymentApi;
