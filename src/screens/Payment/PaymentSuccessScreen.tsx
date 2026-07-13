import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PaymentSuccessScreenProps {
  title?: string;
  subtitle?: string;
}

function PaymentSuccessScreenComponent({
  title = 'Booking Confirmed!',
  subtitle = 'Your wellness session is all set.',
}: PaymentSuccessScreenProps): React.ReactElement {
  return (
    <View style={styles.container} accessibilityRole="header">
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={92} color="#FFAF2E" />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
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
    backgroundColor: '#FFF0D6',
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
  },
});

export const PaymentSuccessScreen = memo(PaymentSuccessScreenComponent);
export default PaymentSuccessScreen;
