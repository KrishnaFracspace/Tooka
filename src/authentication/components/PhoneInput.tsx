import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AUTH_COLORS, AUTH_CONFIG } from '../constants/auth';

interface PhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = React.memo(({ value, onChangeText, error, disabled }) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Mobile Number</Text>
      </View>
      <View style={[styles.row, error ? styles.rowError : null]}>
        <Pressable style={styles.countryCode} disabled>
          <Text style={styles.countryCodeText}>+91</Text>
          <Ionicons name="chevron-down" size={14} color={AUTH_COLORS.primary} />
        </Pressable>
        <TextInput
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/[^0-9]/g, ''))}
          keyboardType="number-pad"
          maxLength={AUTH_CONFIG.phoneLength}
          placeholder="Enter your number"
          placeholderTextColor={AUTH_COLORS.secondaryText}
          style={styles.input}
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="done"
          editable={!disabled}
          accessibilityLabel="Phone number input"
        />
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 8,
  },
  labelRow: {
    marginBottom: 8,
  },
  label: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 13,
    color: AUTH_COLORS.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: AUTH_COLORS.white,
  },
  rowError: {
    borderColor: AUTH_COLORS.error,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: AUTH_COLORS.border,
    marginRight: 10,
  },
  countryCodeText: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 14,
    color: AUTH_COLORS.text,
    marginRight: 4,
  },
  input: {
    flex: 1,
    fontFamily: 'WorkSans-Regular',
    fontSize: 15,
    color: AUTH_COLORS.text,
    paddingVertical: 0,
  },
  error: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    color: AUTH_COLORS.error,
    marginTop: 6,
  },
});
