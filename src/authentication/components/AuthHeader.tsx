import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AUTH_COLORS } from '../constants/auth';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = React.memo(({ title, subtitle }) => {
  return (
    <View style={styles.container}>
      <View style={styles.heroImage}>
        <View style={styles.heroGlow} />
        <View style={styles.heroCard}>
          <Ionicons name="sparkles" size={28} color={AUTH_COLORS.primary} />
        </View>
      </View>
      <View style={styles.logoWrap}>
        <Text style={styles.logo}>TOOKA</Text>
        <Text style={styles.logoCaption}>Wellness, made easy</Text>
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 180,
    borderRadius: 28,
    backgroundColor: AUTH_COLORS.primary,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.18)',
    top: -40,
    right: -50,
  },
  heroCard: {
    width: 120,
    height: 120,
    borderRadius: 40,
    backgroundColor: AUTH_COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  logoWrap: {
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 24,
    color: AUTH_COLORS.text,
    letterSpacing: 2,
  },
  logoCaption: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    color: AUTH_COLORS.secondaryText,
    marginTop: 4,
  },
  textWrap: {
    marginTop: 16,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 24,
    color: AUTH_COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: AUTH_COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
