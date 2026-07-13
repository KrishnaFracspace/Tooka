import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PaymentFailureScreenProps {
  title?: string;
  subtitle?: string;
  failureReason?: string;
}

function PaymentFailureScreenComponent({
  title = 'Payment Failed',
  subtitle = "We couldn't complete your payment.",
  failureReason,
}: PaymentFailureScreenProps): React.ReactElement {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.iconCircle}>
        <Ionicons name="close" size={92} color="#D94A45" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      {failureReason ? (
        <View style={styles.reasonCard}>
          <Text style={styles.reasonLabel}>Failure Reason</Text>
          <Text style={styles.reasonText}>{failureReason}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: '#242424',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    color: '#9A9A9A',
    textAlign: 'center',
    marginBottom: 16,
  },
  reasonCard: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD08A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  reasonLabel: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#9A9A9A',
    marginBottom: 6,
  },
  reasonText: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 16,
    color: '#D94A45',
  },
});

export const PaymentFailureScreen = memo(PaymentFailureScreenComponent);
export default PaymentFailureScreen;
