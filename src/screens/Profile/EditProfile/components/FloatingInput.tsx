import React from 'react';
import { Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../constants';
import { styles } from '../styles';
import type { FloatingInputProps } from '../types';

function FloatingInput({
  label,
  value,
  placeholder,
  editable = true,
  keyboardType,
  error,
  leftIcon,
  rightIcon,
  multiline,
  onChangeText,
}: FloatingInputProps): React.ReactElement {
  return (
    <View>
      <View style={[styles.inputShell, !editable && styles.inputDisabled]}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={styles.inputRow}>
          {leftIcon ? (
            <Ionicons name={leftIcon} size={20} color={COLORS.placeholder} />
          ) : null}
          <TextInput
            value={value}
            placeholder={placeholder}
            placeholderTextColor={COLORS.placeholder}
            editable={editable}
            keyboardType={keyboardType}
            multiline={multiline}
            onChangeText={onChangeText}
            style={styles.inputText}
            selectionColor={COLORS.primary}
          />
          {rightIcon ? (
            <Ionicons name={rightIcon} size={22} color={COLORS.heading} />
          ) : null}
        </View>
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default React.memo(FloatingInput);
