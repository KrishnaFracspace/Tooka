import React from 'react';
import { Text, View } from 'react-native';

import DateTab from './DateTab';
import { styles } from '../styles';
import type { BookingDate } from '../types';

type Props = {
  dates: BookingDate[];
  selectedDateId: string;
  onSelectDate: (id: string) => void;
};

function BookingSchedule({ dates, selectedDateId, onSelectDate }: Props): React.ReactElement {
  return (
    <View style={[styles.section, styles.scheduleSection]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>When would you like to visit?</Text>
      </View>
      <View style={styles.tabsCard}>
        {dates.map((date) => (
          <DateTab
            key={date.id}
            date={date}
            selected={date.id === selectedDateId}
            onPress={onSelectDate}
          />
        ))}
      </View>
    </View>
  );
}

export default React.memo(BookingSchedule);
