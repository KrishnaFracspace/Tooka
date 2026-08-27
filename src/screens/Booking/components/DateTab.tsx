import React from 'react';
import { Pressable, Text } from 'react-native';

import { styles } from '../styles';
import type { BookingDate } from '../types';

type Props = {
  date: BookingDate;
  selected: boolean;
  onPress: (id: string) => void;
};

const formatDateSubLabel = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = Number(parts[2]);
  const monthIdx = Number(parts[1]) - 1;
  if (!Number.isFinite(day) || !monthNames[monthIdx]) return '';
  return `${day} ${monthNames[monthIdx]}`;
};

function DateTab({ date, selected, onPress }: Props): React.ReactElement {
  const dateFormatted = formatDateSubLabel(date.date);
  const labelText = dateFormatted ? `📅 ${date.label} • ${dateFormatted}` : date.label;

  return (
    <Pressable
      onPress={() => onPress(date.id)}
      style={[styles.dateTab, selected && styles.dateTabActive]}
      accessibilityRole="tab"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.dateTabText, selected && styles.dateTabTextActive]} numberOfLines={1}>
        {labelText}
      </Text>
    </Pressable>
  );
}

export default React.memo(DateTab);
