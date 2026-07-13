import {
  CFDropCheckoutPayment,
  CFEnvironment,
  CFSession,
  CFThemeBuilder,
} from 'cashfree-pg-api-contract';
import {
  CFErrorResponse,
  CFPaymentGatewayService,
} from 'react-native-cashfree-pg-sdk';

import { CASHFREE_ENVIRONMENT } from '../payment/constants';
import { mapPaymentError, mapSdkErrorToResult } from '../payment/PaymentMapper';
import { paymentLogger } from '../payment/paymentLogger';
import {
  SdkPaymentResult,
  type BookingSummaryData,
  type PaymentSessionData,
} from '../payment/PaymentTypes';
import PaymentRepository from '../repositories/PaymentRepository';

export interface LaunchCashfreeParams {
  paymentSessionId: string;
  cashfreeOrderId: string;
}

export interface SdkCallbackHandlers {
  onVerify: (orderId: string) => void;
  onError: (error: CFErrorResponse, orderId: string) => void;
}

export interface InitiatePaymentResponseMapped {
  paymentId: string;
  paymentSessionId: string;
  cashfreeOrderId: string;
  amount: number;
  currency: string;
}

const buildDropCheckoutPayment = ({
  paymentSessionId,
  cashfreeOrderId,
}: LaunchCashfreeParams): CFDropCheckoutPayment => {
  const session = new CFSession(
    paymentSessionId,
    cashfreeOrderId,
    CASHFREE_ENVIRONMENT,
  );
  const theme = new CFThemeBuilder()
    .setNavigationBarBackgroundColor('#FFAF2E')
    .setNavigationBarTextColor('#FFFFFF')
    .setButtonBackgroundColor('#FFAF2E')
    .setButtonTextColor('#FFFFFF')
    .setPrimaryTextColor('#242424')
    .setSecondaryTextColor('#9A9A9A')
    .build();

  return new CFDropCheckoutPayment(session, null, theme);
};

export const PaymentService = {
  initiateBookingPayment: async (
    bookingId: string,
    signal?: AbortSignal,
  ): Promise<InitiatePaymentResponseMapped> => {
    const response = await PaymentRepository.initiateBookingPayment({
      bookingId,
      signal,
    });

    return {
      paymentId: response.payment_id,
      paymentSessionId: response.payment_session_id,
      cashfreeOrderId: response.cashfree_order_id,
      amount: response.order_amount,
      currency: response.order_currency,
    };
  },

  registerSdkCallbacks: (handlers: SdkCallbackHandlers): void => {
    CFPaymentGatewayService.setCallback({
      onVerify: handlers.onVerify,
      onError: handlers.onError,
    });
  },

  removeSdkCallbacks: (): void => {
    CFPaymentGatewayService.removeCallback();
  },

  launchCashfreeCheckout: ({
    paymentSessionId,
    cashfreeOrderId,
  }: LaunchCashfreeParams): void => {
    const payment = buildDropCheckoutPayment({
      paymentSessionId,
      cashfreeOrderId,
    });
    CFPaymentGatewayService.doPayment(payment);
  },

  mapSdkCallbackResult: (error?: CFErrorResponse): SdkPaymentResult => {
    if (!error) {
      return SdkPaymentResult.Success;
    }

    return mapSdkErrorToResult(error);
  },

  buildSessionFromInitiateResponse: (
    bookingId: string,
    bookingRef: string | undefined,
    response: InitiatePaymentResponseMapped,
    summary?: BookingSummaryData,
  ): PaymentSessionData & BookingSummaryData => ({
    paymentId: response.paymentId,
    bookingId,
    bookingRef,
    paymentSessionId: response.paymentSessionId,
    cashfreeOrderId: response.cashfreeOrderId,
    amount: response.amount,
    currency: response.currency,
    ...summary,
  }),

  mapError: mapPaymentError,

  logSdkCallback: (
    result: SdkPaymentResult,
    orderId?: string,
    error?: CFErrorResponse,
  ): void => {
    paymentLogger.debug('SDK Callback', {
      result,
      orderId,
      message: error?.getMessage?.(),
      code: error?.getCode?.(),
    });
  },

  getCashfreeEnvironment: (): CFEnvironment => CASHFREE_ENVIRONMENT,
};

export default PaymentService;
