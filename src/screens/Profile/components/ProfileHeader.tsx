import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NotificationButton from './NotificationButton';
import { styles } from '../styles';

type Props = {
  onNotificationPress?: () => void;
};

function ProfileHeader({ onNotificationPress }: Props): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
      <View style={styles.headerCircleLarge} />
      <View style={styles.headerCircleSoft} />
      <View style={styles.headerDotOne} />
      <View style={styles.headerDotTwo} />
      <View style={styles.headerDotDark} />

      <View style={styles.headerTopRow}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <NotificationButton onPress={onNotificationPress} />
      </View>
    </View>
  );
}

export default React.memo(ProfileHeader);
