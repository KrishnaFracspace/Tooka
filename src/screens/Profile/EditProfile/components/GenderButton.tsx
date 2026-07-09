import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../constants';
import { styles } from '../styles';
import type { GenderOption } from '../types';

type Props = {
  option: GenderOption;
  selected: boolean;
  onPress: (id: GenderOption['id']) => void;
};

function GenderButton({ option, selected, onPress }: Props): React.ReactElement {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.02 : 1,
      speed: 22,
      bounciness: 7,
      useNativeDriver: true,
    }).start();
  }, [scale, selected]);

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={() => onPress(option.id)}
        style={[styles.genderButton, selected && styles.genderButtonSelected]}
        accessibilityRole="button"
        accessibilityState={{ selected }}
      >
        <Ionicons
          name={option.iconName}
          size={18}
          color={selected ? COLORS.white : COLORS.placeholder}
        />
        <Text style={[styles.genderText, selected && styles.genderTextSelected]}>
          {option.label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(GenderButton);
