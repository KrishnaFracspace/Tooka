import React, { memo } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { PAYMENT_USER_MESSAGES } from '../../payment/constants';
import RetryPaymentButton from './components/RetryPaymentButton';

interface PaymentProcessingScreenProps {
  message?: string;
  showRefresh?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  spinStyle?: Animated.WithAnimatedObject<{ transform: { rotate: string }[] }>;
}

function PaymentProcessingScreenComponent({
  message = 'Please wait while we confirm your payment.',
  showRefresh = false,
  refreshing = false,
  onRefresh,
  spinStyle,
}: PaymentProcessingScreenProps): React.ReactElement {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconCircle}>
        <Animated.View style={spinStyle}>
          <Ionicons name="sync" size={72} color="#FFAF2E" />
        </Animated.View>
      </View>

      <Text style={styles.title}>Payment Processing</Text>
      <Text style={styles.subtitle}>{message}</Text>

      {showRefresh ? (
        <>
          <Text style={styles.stillProcessing}>
            {PAYMENT_USER_MESSAGES.stillProcessing}
          </Text>
          <RetryPaymentButton
            label="Refresh Status"
            onPress={onRefresh ?? (() => undefined)}
            loading={refreshing}
          />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0D6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: '#242424',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  stillProcessing: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 15,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
});

export const PaymentProcessingScreen = memo(PaymentProcessingScreenComponent);
export default PaymentProcessingScreen;
