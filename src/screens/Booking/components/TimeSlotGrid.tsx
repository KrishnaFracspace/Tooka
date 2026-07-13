import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import TimeSlotButton from './TimeSlotButton';
import { colors, styles } from '../styles';
import type { TimeSlot } from '../types';

type Props = {
  slots: TimeSlot[];
  selectedSlotId: string;
  onSelectSlot: (id: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
};

function TimeSlotGrid({
  slots,
  selectedSlotId,
  onSelectSlot,
  loading = false,
  error,
}: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const slotWidth = useMemo(() => {
    const contentWidth = Math.min(width, 720) - 70;
    return Math.floor((contentWidth - 24) / 3);
  }, [width]);

  return (
    <View style={styles.section}>
      <View style={styles.slotCard}>
        {loading && (
          <View style={styles.slotState}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.slotStateText}>Checking availability...</Text>
          </View>
        )}
        {!loading && error ? (
          <View style={styles.slotState}>
            <Text style={styles.slotStateTitle}>Unable to load slots</Text>
            <Text style={styles.slotStateText}>{error}</Text>
          </View>
        ) : null}
        {!loading && !error && slots.length === 0 ? (
          <View style={styles.slotState}>
            <Text style={styles.slotStateTitle}>No slots available</Text>
            <Text style={styles.slotStateText}>Please try another date.</Text>
          </View>
        ) : null}
        <View style={styles.slotGrid}>
          {slots.map(slot => (
            <TimeSlotButton
              key={slot.id}
              slot={slot}
              width={slotWidth}
              selected={slot.id === selectedSlotId}
              onSelectSlot={onSelectSlot}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export default React.memo(TimeSlotGrid);
