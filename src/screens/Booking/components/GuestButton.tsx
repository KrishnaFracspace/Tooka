import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, useWindowDimensions } from 'react-native';

import { styles } from '../styles';
import type { GuestCount } from '../types';

type Props = {
  label: GuestCount;
  selected: boolean;
  onPress: (value: GuestCount) => void;
};

function GuestButton({ label, selected, onPress }: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const scale = useRef(new Animated.Value(selected ? 1 : 0.96)).current;
  const buttonWidth = Math.min(146, (width - 84) / 4);

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1 : 0.96,
      useNativeDriver: true,
      speed: 22,
      bounciness: 7,
    }).start();
  }, [scale, selected]);

  return (
    <Animated.View style={{ width: buttonWidth, transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress(label)}
        style={[styles.guestButton, selected && styles.guestButtonSelected]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Text style={[styles.guestText, selected && styles.guestTextSelected]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(GuestButton);
