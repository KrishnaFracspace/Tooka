import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '../styles';

type Props = {
  price: number;
  onProceed: () => void;
};

function PaymentFooter({ price, onProceed }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.footerWrap, { paddingBottom: Math.max(insets.bottom, 14) }]}>
      <View style={styles.footerInner}>
        <View>
          <Text style={styles.payLabel}>Pay Now</Text>
          <Text style={styles.payValue}>₹{price}</Text>
        </View>
        <Pressable
          onPress={onProceed}
          style={({ pressed }) => [styles.proceedButton, pressed && styles.proceedPressed]}
          accessibilityRole="button"
          accessibilityLabel="Proceed"
        >
          <View style={styles.proceedGradient}>
            <Text style={styles.proceedText}>Proceed</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(PaymentFooter);
