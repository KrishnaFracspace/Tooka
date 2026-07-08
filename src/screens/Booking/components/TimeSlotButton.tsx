import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { styles } from '../styles';
import type { TimeSlot } from '../types';

type Props = {
  slot: TimeSlot;
  selected: boolean;
  width: number;
  onSelectSlot: (id: string) => void;
};

function TimeSlotButton({ slot, selected, width, onSelectSlot }: Props): React.ReactElement {
  const scale = useRef(new Animated.Value(1)).current;
  const disabled = slot.status === 'disabled';

  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.02 : 1,
      useNativeDriver: true,
      speed: 22,
      bounciness: 7,
    }).start();
  }, [scale, selected]);

  return (
    <Animated.View style={{ width, transform: [{ scale }] }}>
      <Pressable
        disabled={disabled}
        onPress={() => onSelectSlot(slot.id)}
        style={[
          styles.slotButton,
          selected && styles.slotButtonSelected,
          disabled && styles.slotButtonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled, selected }}
      >
        <Text
          style={[
            styles.slotText,
            selected && styles.slotTextSelected,
            disabled && styles.slotTextDisabled,
          ]}
        >
          {slot.label}
        </Text>
        {selected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedBadgeText}>SELECTED</Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(TimeSlotButton);
