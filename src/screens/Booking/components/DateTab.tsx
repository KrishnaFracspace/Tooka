import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text } from 'react-native';

import { styles } from '../styles';
import type { BookingDate } from '../types';

type Props = {
  date: BookingDate;
  selected: boolean;
  onPress: (id: string) => void;
};

function DateTab({ date, selected, onPress }: Props): React.ReactElement {
  const underlineScale = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(underlineScale, {
      toValue: selected ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [selected, underlineScale]);

  return (
    <Pressable
      onPress={() => onPress(date.id)}
      style={styles.dateTab}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.dateTabText, selected && styles.dateTabTextActive]}>{date.label}</Text>
      <Animated.View style={[styles.dateUnderline, { transform: [{ scaleX: underlineScale }] }]} />
    </Pressable>
  );
}

export default React.memo(DateTab);
