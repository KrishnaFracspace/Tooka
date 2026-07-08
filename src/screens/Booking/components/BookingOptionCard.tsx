import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { styles } from '../styles';
import type { BookingOption } from '../types';

type Props = {
  option: BookingOption;
  selected: boolean;
  onPress: () => void;
};

function BookingOptionCard({ option, selected, onPress }: Props): React.ReactElement {
  const radioScale = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(radioScale, {
      toValue: selected ? 1 : 0,
      useNativeDriver: true,
      speed: 22,
      bounciness: 8,
    }).start();
  }, [radioScale, selected]);

  return (
    <View style={[styles.section, styles.optionSection]}>
      <Text style={styles.sectionTitle}>Booking option</Text>
      <Pressable
        onPress={onPress}
        style={styles.optionCard}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
      >
        <View style={styles.priceBubble}>
          <Text style={styles.priceBubbleText}>₹{option.price}</Text>
        </View>
        <View style={styles.optionTopRow}>
          <View style={styles.radioOuter}>
            <Animated.View style={[styles.radioInner, { transform: [{ scale: radioScale }] }]} />
          </View>
          <View style={styles.optionCopy}>
            <Text style={styles.optionTitle}>{option.title}</Text>
            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            <Text style={styles.optionDescription}>{option.description}</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

export default React.memo(BookingOptionCard);
