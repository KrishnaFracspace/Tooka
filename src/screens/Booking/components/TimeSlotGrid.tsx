import React, { useMemo } from 'react';
import {
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
    const contentWidth = Math.min(width, 720) - 68;
    return Math.floor((contentWidth - 16) / 3);
  }, [width]);

  const firstAvailableSlot = useMemo(
    () => slots.find(s => s.status === 'available'),
    [slots],
  );

  return (
    <View style={styles.section}>
      <View style={styles.slotCard}>
        {/* Next Available Highlight Banner */}
        {!loading && !error && firstAvailableSlot ? (
          <View style={[styles.nextAvailable, { marginBottom: 12, justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'WorkSans-Regular', fontSize: 12, color: colors.muted }}>
                Next available: {' '}
              </Text>
              <Text style={{ fontFamily: 'Sora-SemiBold', fontSize: 13, color: colors.heading }}>
                {firstAvailableSlot.label}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
              <Ionicons name="star" size={12} color={colors.ratingGold} />
              <Text style={{ fontFamily: 'WorkSans-Medium', fontSize: 11, color: colors.primaryDark, marginLeft: 3 }}>
                Recommended
              </Text>
            </View>
          </View>
        ) : null}

        {slots.length > 0 && !loading && !error && (
          <Text style={[styles.sectionTitle, { fontSize: 14, marginBottom: 10 }]}>Other Slots</Text>
        )}

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

        {/* Arrival Tip Banner */}
        {!loading && !error && slots.length > 0 && (
          <View style={styles.arrivalTipCard}>
            <Text style={{ fontSize: 14 }}>🌿</Text>
            <Text style={styles.arrivalTipText}>
              Arrive 5–10 minutes early for a relaxed experience.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default React.memo(TimeSlotGrid);
