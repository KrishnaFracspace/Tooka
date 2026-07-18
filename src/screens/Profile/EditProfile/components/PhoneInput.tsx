import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../constants';
import { styles } from '../styles';

type Props = {
  countryCode: string;
  phoneNumber: string;
  onChangePhoneNumber: (value: string) => void;
  onPressCountryCode?: () => void;
};

function PhoneInput({
  countryCode,
  phoneNumber,
  onChangePhoneNumber,
  onPressCountryCode,
}: Props): React.ReactElement {
  return (
    <View style={styles.inputShell}>
      <Text style={styles.inputLabel}>PHONE NUMBER</Text>
      <View style={styles.inputRow}>
        <Pressable
          onPress={onPressCountryCode}
          style={styles.phoneCode}
          accessibilityRole="button"
          accessibilityLabel="Select country code"
        >
          <Text style={styles.phoneCodeText}>{countryCode}</Text>
          {/* <Ionicons name="chevron-down" size={20} color={COLORS.placeholder} /> */}
        </Pressable>
        <View style={styles.phoneDivider} />
        <TextInput
          value={phoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={onChangePhoneNumber}
          style={styles.inputText}
          selectionColor={COLORS.primary}
        />
      </View>
    </View>
  );
}

export default React.memo(PhoneInput);
