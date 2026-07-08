import React from 'react';
import { Text, View } from 'react-native';

import GuestButton from './GuestButton';
import { styles } from '../styles';
import type { GuestCount } from '../types';

type Props = {
  guests: GuestCount[];
  selectedGuest: GuestCount;
  onSelectGuest: (value: GuestCount) => void;
};

function GuestSelector({ guests, selectedGuest, onSelectGuest }: Props): React.ReactElement {
  return (
    <View style={[styles.section, styles.firstSection]}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Who’s joining?</Text>
        <Text style={styles.sectionSideText}>Guest Count</Text>
      </View>
      <View style={styles.guestRow}>
        {guests.map((guest) => (
          <GuestButton
            key={guest}
            label={guest}
            selected={guest === selectedGuest}
            onPress={onSelectGuest}
          />
        ))}
      </View>
    </View>
  );
}

export default React.memo(GuestSelector);
