import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, styles } from '../styles';

type Props = {
  price: number;
  selectedTimeLabel?: string;
  onProceed: () => void;
  disabled?: boolean;
  loading?: boolean;
};

function PaymentFooter({
  price,
  selectedTimeLabel,
  onProceed,
  disabled = false,
  loading = false,
}: Props): React.ReactElement {
  const insets = useSafeAreaInsets();
  const buttonLabel = selectedTimeLabel
    ? `Continue with ${selectedTimeLabel}`
    : 'Continue to Payment';

  return (
    <View
      style={[
        styles.footerWrap,
        { paddingBottom: Math.max(insets.bottom, 14) },
      ]}
    >
      <Pressable
        disabled={disabled || loading}
        onPress={onProceed}
        style={({ pressed }) => [
          styles.proceedButton,
          pressed && styles.proceedPressed,
          (disabled || loading) && styles.proceedButtonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
      >
        <View style={styles.proceedGradient}>
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Text style={styles.proceedText}>{buttonLabel}</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.white} style={{ marginLeft: 8 }} />
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}

export default React.memo(PaymentFooter);
