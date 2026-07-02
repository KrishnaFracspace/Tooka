import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { AUTH_COLORS } from '../constants/auth';

interface NameInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
}

export const NameInput: React.FC<NameInputProps> = React.memo(({ value, onChangeText, error }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Enter your name"
        placeholderTextColor={AUTH_COLORS.secondaryText}
        style={[styles.input, error ? styles.inputError : null]}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        accessibilityLabel="Name input"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 8,
  },
  label: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 13,
    color: AUTH_COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AUTH_COLORS.white,
    fontFamily: 'WorkSans-Regular',
    fontSize: 15,
    color: AUTH_COLORS.text,
  },
  inputError: {
    borderColor: AUTH_COLORS.error,
  },
  error: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    color: AUTH_COLORS.error,
    marginTop: 6,
  },
});
