import React, { useMemo, useRef } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AUTH_COLORS, AUTH_CONFIG } from '../constants/auth';

interface OTPInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onKeyPress: (event: any) => void;
  onFocus: () => void;
  inputRef?: React.Ref<TextInput>;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = React.memo((props) => {
  const inputRef = useRef<TextInput>(null);
  const resolvedRef = (props.inputRef as any) ?? inputRef;

  return (
    <TextInput
      ref={resolvedRef}
      value={props.value}
      onChangeText={props.onChangeText}
      onKeyPress={props.onKeyPress}
      onFocus={props.onFocus}
      keyboardType="number-pad"
      maxLength={1}
      autoFocus={props.autoFocus}
      style={styles.input}
      textContentType="oneTimeCode"
      selectionColor={AUTH_COLORS.primary}
      accessibilityLabel="OTP digit"
      editable={!props.disabled}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    width: 44,
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    textAlign: 'center',
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: AUTH_COLORS.text,
    backgroundColor: AUTH_COLORS.white,
  },
});
