import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { COLORS } from '../constants';

import { styles } from '../styles';

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
};

function GradientButton({ title, onPress, loading = false, disabled = false }: Props): React.ReactElement {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.saveButton,
        (disabled || loading) && styles.saveButtonDisabled,
        pressed && styles.saveButtonPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.white} />
      ) : (
        <Text style={styles.saveButtonText}>{title}</Text>
      )}
    </Pressable>
  );
}

export default React.memo(GradientButton);
