import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '../styles';

type Props = {
  price: number;
  onProceed: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function PaymentFooter({
  price,
  onProceed,
  disabled = false,
  loading = false,
}: Props): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.footerWrap,
        { paddingBottom: Math.max(insets.bottom, 14) },
      ]}
    >
      <View style={styles.footerInner}>
        <View>
          <Text style={styles.payLabel}>Pay Now</Text>
          <Text style={styles.payValue}>₹{price}</Text>
        </View>
        <Pressable
          disabled={disabled || loading}
          onPress={onProceed}
          style={({ pressed }) => [
            styles.proceedButton,
            pressed && styles.proceedPressed,
            (disabled || loading) && styles.proceedButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Proceed"
        >
          <View style={styles.proceedGradient}>
            <Text style={styles.proceedText}>
              {loading ? 'Booking...' : 'Proceed'}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(PaymentFooter);
