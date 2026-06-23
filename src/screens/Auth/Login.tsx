import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/AppNavigator';

const SocialButton: React.FC<{
  label: string;
  iconName: string;
  onPress?: () => void;
}> = ({ label, iconName, onPress }) => (
  <Pressable style={styles.socialButton} onPress={onPress}>
    <Ionicons name={iconName} size={20} color="#1F1F1F" style={styles.socialIcon} />
    <Text style={styles.socialButtonText}>{label}</Text>
  </Pressable>
);

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation<LoginScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}>
        <View style={[styles.hero, isTablet && styles.heroTablet]}>
          <View style={styles.heroTopLeftButton}>
            <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
          </View>
          <View style={styles.heroLogoWrap}>
            <Text style={styles.heroLogo}>TOOKA</Text>
            <Text style={styles.heroLogoTagline}>TAKE A BREAK</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            Sign up to discover and book best wellness experiences
          </Text>

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
          </View>

          <View style={styles.phoneRow}>
            <Pressable style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
              <Ionicons name="chevron-down" size={16} color="#7B8B55" />
            </Pressable>
            <TextInput
              placeholder="Enter your number"
              placeholderTextColor="#9A9A9A"
              keyboardType="phone-pad"
              style={styles.phoneInput}
              maxLength={10}
            />
          </View>

          <Pressable onPress={() => {
            navigation.navigate('Otp');
          }} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Send OTP</Text>
          </Pressable>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          <SocialButton onPress={() => {navigation.navigate('Otp')}} label="Continue with Google" iconName="logo-google" />
          <SocialButton onPress={() => {navigation.navigate('Otp')}} label="Continue with Apple" iconName="logo-apple" />

          <View style={styles.bottomTextRow}>
            <Text style={styles.bottomText}>Already have an account?</Text>
            <Pressable>
              <Text style={styles.bottomLink}> Login</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1E8',
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 36,
  },
  containerTablet: {
    maxWidth: 640,
    alignSelf: 'center',
  },
  hero: {
    marginTop: 12,
    minHeight: 320,
    borderRadius: 36,
    backgroundColor: '#7B8B55',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 24,
    overflow: 'hidden',
  },
  heroTablet: {
    minHeight: 380,
  },
  heroTopLeftButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroLogoWrap: {
    alignItems: 'center',
    marginTop: 14,
  },
  heroLogo: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 3,
  },
  heroLogoTagline: {
    color: '#FFFFFF',
    fontSize: 12,
    letterSpacing: 5,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 22,
    marginTop: -40,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  subtitle: {
    color: '#6D6D6D',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  fieldLabelRow: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '700',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F2EC',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
  countryCodeText: {
    marginRight: 8,
    color: '#4C5A39',
    fontSize: 15,
    fontWeight: '700',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#F3F2EC',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 15,
    color: '#1E1E1E',
  },
  primaryButton: {
    backgroundColor: '#7B8B55',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E3D8',
  },
  dividerText: {
    marginHorizontal: 14,
    color: '#8B8B8B',
    fontSize: 13,
    fontWeight: '700',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 14,
  },
  socialIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#1F1F1F',
    fontWeight: '700',
  },
  bottomTextRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  bottomText: {
    color: '#7A7A7A',
    fontSize: 14,
  },
  bottomLink: {
    color: '#7B8B55',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
