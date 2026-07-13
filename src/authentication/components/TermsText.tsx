import React, { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../navigation/AppNavigator';
import { AUTH_COLORS } from '../constants/auth';

type AuthNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TermsText: React.FC = React.memo(() => {
  const navigation = useNavigation<AuthNavigationProp>();

  const openPrivacyPolicy = useCallback(() => {
    navigation.navigate('PrivacyPolicy');
  }, [navigation]);

  const openTerms = useCallback(() => {
    navigation.navigate('TermsAndConditions');
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>By continuing you agree to Tooka&apos;s </Text>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Privacy Policy"
        onPress={openPrivacyPolicy}
        hitSlop={8}
      >
        <Text style={styles.link}>Privacy Policy</Text>
      </Pressable>
      <Text style={styles.text}> and </Text>
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Terms and Conditions"
        onPress={openTerms}
        hitSlop={8}
      >
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
