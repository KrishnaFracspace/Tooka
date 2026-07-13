import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, styles } from '../styles';

type Props = {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
};

function GuestSelector({
  value,
  min = 1,
  max = 10,
  onChange,
}: Props): React.ReactElement {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={[styles.section, styles.firstSection]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Who's joining?</Text>
        <Text style={styles.sectionSideText}>Max {max}</Text>
      </View>
      <View style={styles.stepperRow}>
        <Pressable
          disabled={!canDecrease}
          onPress={() => onChange(Math.max(min, value - 1))}
          style={[
            styles.stepperButton,
            !canDecrease && styles.stepperButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Decrease guest count"
        >
          <Ionicons
            name="remove"
            size={22}
            color={canDecrease ? colors.heading : colors.muted}
          />
        </Pressable>
        <View style={styles.guestCountPill}>
          <Text style={styles.guestCountValue}>{value}</Text>
          <Text style={styles.guestCountLabel}>
            {value === 1 ? 'Guest' : 'Guests'}
          </Text>
        </View>
        <Pressable
          disabled={!canIncrease}
          onPress={() => onChange(Math.min(max, value + 1))}
          style={[
            styles.stepperButton,
            !canIncrease && styles.stepperButtonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Increase guest count"
        >
          <Ionicons
            name="add"
            size={22}
            color={canIncrease ? colors.heading : colors.muted}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default React.memo(GuestSelector);
