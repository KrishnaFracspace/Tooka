import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { AUTH_COLORS } from '../constants/auth';

export const TermsText: React.FC = React.memo(() => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>By continuing you agree to Tooka&apos;s </Text>
      <Pressable onPress={() => console.log('Privacy Policy pressed')}>
        <Text style={styles.link}>Privacy Policy</Text>
      </Pressable>
      <Text style={styles.text}> and </Text>
      <Pressable onPress={() => console.log('Terms pressed')}>
        <Text style={styles.link}>Terms of Service</Text>
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    color: AUTH_COLORS.secondaryText,
    textAlign: 'center',
  },
  link: {
    fontFamily: 'WorkSans-SemiBold',
    fontSize: 12,
    color: AUTH_COLORS.primary,
  },
});
