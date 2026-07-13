import {
  PaymentFlowContext,
  PaymentFlowState,
  type BookingSummaryData,
  type PaymentSessionData,
} from './PaymentTypes';

export const createInitialPaymentFlowContext = (): PaymentFlowContext => ({
  flowState: PaymentFlowState.Idle,
  paymentId: '',
  bookingId: '',
  bookingRef: undefined,
  paymentSessionId: '',
  cashfreeOrderId: '',
  amount: 0,
  currency: 'INR',
  sdkLaunched: false,
});

export const mergePaymentSession = (
  current: PaymentFlowContext,
  session: PaymentSessionData,
  summary?: BookingSummaryData,
): PaymentFlowContext => ({
  ...current,
  ...session,
  ...summary,
  flowState: PaymentFlowState.Ready,
  sdkLaunched: false,
  failureReason: undefined,
  userMessage: undefined,
});

const LEGAL_TRANSITIONS: Record<PaymentFlowState, readonly PaymentFlowState[]> = {
  [PaymentFlowState.Idle]: [PaymentFlowState.Ready, PaymentFlowState.Error],
  [PaymentFlowState.Ready]: [PaymentFlowState.SdkOpening, PaymentFlowState.Error],
  [PaymentFlowState.SdkOpening]: [
    PaymentFlowState.SdkOpen,
    PaymentFlowState.Error,
    PaymentFlowState.Failed,
  ],
  [PaymentFlowState.SdkOpen]: [
    PaymentFlowState.Verifying,
    PaymentFlowState.Cancelled,
    PaymentFlowState.Failed,
    PaymentFlowState.Error,
  ],
  [PaymentFlowState.Verifying]: [
    PaymentFlowState.Success,
    PaymentFlowState.Failed,
    PaymentFlowState.Cancelled,
    PaymentFlowState.Refunded,
    PaymentFlowState.Timeout,
    PaymentFlowState.Error,
    PaymentFlowState.Verifying,
  ],
  [PaymentFlowState.Success]: [],
  [PaymentFlowState.Failed]: [],
  [PaymentFlowState.Cancelled]: [],
  [PaymentFlowState.Refunded]: [],
  [PaymentFlowState.Timeout]: [],
  [PaymentFlowState.Error]: [],
};

export const canTransitionPaymentFlow = (
  from: PaymentFlowState,
  to: PaymentFlowState,
): boolean => from === to || LEGAL_TRANSITIONS[from].includes(to);

export const setPaymentFlowState = (
  current: PaymentFlowContext,
  flowState: PaymentFlowState,
  patch?: Partial<PaymentFlowContext>,
): PaymentFlowContext => {
  if (!canTransitionPaymentFlow(current.flowState, flowState)) {
    return current;
  }

  return {
    ...current,
    flowState,
    ...patch,
  };
};

export const isTerminalFlowState = (state: PaymentFlowState): boolean =>
  state === PaymentFlowState.Success ||
  state === PaymentFlowState.Failed ||
  state === PaymentFlowState.Cancelled ||
  state === PaymentFlowState.Refunded ||
  state === PaymentFlowState.Timeout ||
  state === PaymentFlowState.Error;

export const canLaunchSdk = (context: PaymentFlowContext): boolean =>
  Boolean(context.paymentSessionId) &&
  Boolean(context.cashfreeOrderId) &&
  !context.sdkLaunched &&
  context.flowState === PaymentFlowState.Ready;
