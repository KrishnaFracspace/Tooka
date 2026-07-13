import { useCallback, useEffect, useRef } from 'react';
import type { CFErrorResponse } from 'react-native-cashfree-pg-sdk';

import { usePaymentContext } from '../context/PaymentContext';
import { paymentLogger } from '../payment/paymentLogger';
import { SdkPaymentResult } from '../payment/PaymentTypes';
import PaymentService from '../services/PaymentService';

interface UsePaymentCallbacks {
  onSdkResult: (result: {
    sdkResult: SdkPaymentResult;
    orderId?: string;
    message?: string;
  }) => void;
}

export const usePayment = ({ onSdkResult }: UsePaymentCallbacks) => {
  const {
    context,
    hydrateSession,
    markSdkLaunched,
    markWaitingForSdk,
    markVerifying,
    markTerminalState,
    markSdkLaunchFailed,
    resetPaymentFlow,
  } = usePaymentContext();
  const callbackLockRef = useRef(false);
  const launchLockRef = useRef(false);
  const mountedRef = useRef(true);
  const resultRef = useRef(onSdkResult);

  resultRef.current = onSdkResult;

  useEffect(() => {
    mountedRef.current = true;

    PaymentService.registerSdkCallbacks({
      onVerify: orderId => {
        if (callbackLockRef.current || !mountedRef.current) {
          return;
        }

        callbackLockRef.current = true;
        PaymentService.logSdkCallback(SdkPaymentResult.Success, orderId);
        resultRef.current({
          sdkResult: SdkPaymentResult.Success,
          orderId,
        });
      },
      onError: (error: CFErrorResponse, orderId: string) => {
        if (callbackLockRef.current || !mountedRef.current) {
          return;
        }

        callbackLockRef.current = true;
        const sdkResult = PaymentService.mapSdkCallbackResult(error);
        PaymentService.logSdkCallback(sdkResult, orderId, error);
        resultRef.current({
          sdkResult,
          orderId,
          message: error.getMessage?.(),
        });
      },
    });

    return () => {
      mountedRef.current = false;
      PaymentService.removeSdkCallbacks();
    };
  }, []);

  const launchSdk = useCallback((): boolean => {
    if (launchLockRef.current || callbackLockRef.current) {
      return false;
    }

    launchLockRef.current = true;
    markSdkLaunched();

    try {
      PaymentService.launchCashfreeCheckout({
        paymentSessionId: context.paymentSessionId,
        cashfreeOrderId: context.cashfreeOrderId,
      });
      markWaitingForSdk();
      return true;
    } catch (error) {
      launchLockRef.current = false;
      const mapped = PaymentService.mapError(error);
      markSdkLaunchFailed(mapped.userMessage);
      paymentLogger.error('SDK Launch Failed', error);
      return false;
    }
  }, [
    context.cashfreeOrderId,
    context.paymentSessionId,
    markSdkLaunchFailed,
    markSdkLaunched,
    markWaitingForSdk,
  ]);

  const resetSdkLocks = useCallback(() => {
    callbackLockRef.current = false;
    launchLockRef.current = false;
  }, []);

  return {
    context,
    hydrateSession,
    launchSdk,
    resetPaymentFlow,
    resetSdkLocks,
    markVerifying,
    markTerminalState,
  };
};

export default usePayment;
