import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

const FullScreenLoader: React.FC = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#FFB02E" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
});

export default React.memo(FullScreenLoader);
