import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../constants';
import { styles } from '../styles';

type Props = {
  addressLine1: string;
  addressLine2: string;
  onEditAddress: () => void;
};

function AddressCard({
  addressLine1,
  addressLine2,
  onEditAddress,
}: Props): React.ReactElement {
  const opacity = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.timing(opacity, {
      toValue: value,
      duration: 120,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[styles.addressCard, { opacity }]}>
      <View style={styles.addressHeader}>
        <Text style={styles.inputLabel}>ADDRESS</Text>
        <Pressable
          onPress={onEditAddress}
          onPressIn={() => animateTo(0.68)}
          onPressOut={() => animateTo(1)}
          style={styles.editAddressButton}
          accessibilityRole="button"
          accessibilityLabel="Edit address"
        >
          <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
          <Text style={styles.editAddressText}>Edit</Text>
        </Pressable>
      </View>
      <Text style={styles.addressLineOne}>{addressLine1}</Text>
      <Text style={styles.addressLineTwo}>{addressLine2}</Text>
    </Animated.View>
  );
}

export default React.memo(AddressCard);
