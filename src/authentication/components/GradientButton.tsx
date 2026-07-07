import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { AUTH_COLORS } from '../constants/auth';

interface GradientButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const GradientButton: React.FC<GradientButtonProps> = React.memo(({ label, onPress, loading, disabled }) => {
  return (
    <Pressable
      style={[styles.button, (disabled || loading) ? styles.buttonDisabled : null]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {loading ? <ActivityIndicator color={AUTH_COLORS.white} /> : <Text style={styles.label}>{label}</Text>}
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    backgroundColor: AUTH_COLORS.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
    marginTop:20
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  label: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 15,
    color: AUTH_COLORS.white,
  },
});
