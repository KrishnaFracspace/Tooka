import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AUTH_COLORS } from '../constants/auth';

interface ResendOtpProps {
  timeLeft: number;
  isExpired: boolean;
  onResend: () => void;
}

export const ResendOtp: React.FC<ResendOtpProps> = React.memo(({ timeLeft, isExpired, onResend }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{isExpired ? 'Didn’t receive the code?' : `Resend in 00:${timeLeft.toString().padStart(2, '0')}`}</Text>
      <Pressable onPress={onResend} disabled={!isExpired} accessibilityRole="button">
        <Text style={[styles.link, !isExpired ? styles.linkDisabled : null]}>Resend OTP</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    flexWrap: 'wrap',
  },
  text: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    color: AUTH_COLORS.secondaryText,
  },
  link: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 13,
    color: AUTH_COLORS.primary,
    marginLeft: 4,
  },
  linkDisabled: {
    opacity: 0.5,
  },
});
