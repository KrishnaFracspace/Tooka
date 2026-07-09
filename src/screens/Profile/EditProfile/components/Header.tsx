import React from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { styles } from '../styles';

function Header(): React.ReactElement {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
      <View style={styles.headerCircleLarge} />
      <View style={styles.headerCircleSoft} />
      <View style={styles.headerDotLeft} />
      <View style={styles.headerDotRight} />
      <View style={styles.headerDotDark} />
      <Text style={styles.headerTitle}>Complete Your Profile</Text>
      <Text style={styles.headerSubtitle}>Tell us a little more about you.</Text>
    </View>
  );
}

export default React.memo(Header);
