import React, { useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';

import TimeSlotButton from './TimeSlotButton';
import { styles } from '../styles';
import type { TimeSlot } from '../types';

type Props = {
  slots: TimeSlot[];
  selectedSlotId: string;
  onSelectSlot: (id: string) => void;
};

function TimeSlotGrid({ slots, selectedSlotId, onSelectSlot }: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const slotWidth = useMemo(() => {
    const contentWidth = Math.min(width, 720) - 70;
    return Math.floor((contentWidth - 24) / 3);
  }, [width]);

  return (
    <View style={styles.section}>
      <View style={styles.slotCard}>
        <View style={styles.slotGrid}>
          {slots.map((slot) => (
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
