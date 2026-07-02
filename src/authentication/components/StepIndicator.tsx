import React from 'react';
import { StyleSheet, View } from 'react-native';
import { AUTH_COLORS } from '../constants/auth';

interface StepIndicatorProps {
  activeStep: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = React.memo(({ activeStep }) => {
  return (
    <View style={styles.container}>
      {[0, 1, 2].map((step) => (
        <View key={step} style={[styles.dot, activeStep === step ? styles.dotActive : null]} />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AUTH_COLORS.border,
  },
  dotActive: {
    width: 24,
    backgroundColor: AUTH_COLORS.primary,
  },
});
