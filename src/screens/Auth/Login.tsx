// ─────────────────────────────────────────────────────────────────────────────
// LoginScreen
//
// Supports two rendering modes controlled by the `isEmbedded` prop:
//
//  isEmbedded=false (default):
//   • Rendered from the navigation stack (e.g. from SpaDetails → Book Service)
//   • Shows a back button in the hero header
//   • Passes spaId/serviceId/serviceName through route params to Otp screen
//
//  isEmbedded=true:
//   • Rendered inline inside the Profile tab by BottomNavigation's auth gate
//   • Back button is hidden (no stack to go back to — would crash)
//   • Route params are not available; spaId/serviceId/serviceName are undefined
//   • After OTP success, auth state updates automatically and BottomNavigation
//     swaps LoginScreen → ProfileScreen without any navigation call needed
// ─────────────────────────────────────────────────────────────────────────────

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
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
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';

const EMAIL_REGEX = /.+@.+\..+/;

// ─── Sub-components ───────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  /** When true: rendered inside the Profile tab. Hide back button. No route params. */
  isEmbedded?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const LoginScreen: React.FC<LoginScreenProps> = ({ isEmbedded = false }) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  // Navigation is always available — the embedded LoginScreen is still
  // rendered inside a NavigationContainer (via BottomNavigation → AppNavigator).
  const navigation = useNavigation<LoginScreenNavigationProp>();

  // useRoute must always be called (Rules of Hooks).
  // When isEmbedded=true, the screen is rendered inside a Tab, so route.params
  // will be undefined — we safely fall back to undefined for all spa params.
  const route = useRoute<LoginScreenRouteProp>();

  const spaId = isEmbedded ? undefined : route?.params?.spaId;
  const serviceId = isEmbedded ? undefined : route?.params?.serviceId;
  const serviceName = isEmbedded ? undefined : route?.params?.serviceName;

  const { registerStart, loginStart } = useAuth();

  const [login, setLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ─── Validation ─────────────────────────────────────────────────────────

  const validate = useCallback((): string | null => {
    const trimmedPhone = phone.trim();
    if (!login) {
      if (!name.trim()) return 'Please enter your name';
      if (!email.trim()) return 'Please enter your email';
      if (!EMAIL_REGEX.test(email.trim())) return 'Please enter a valid email';
    }
    if (!trimmedPhone) return 'Please enter your mobile number';
    if (!/^\d{10}$/.test(trimmedPhone)) return 'Mobile number must be 10 digits';
    return null;
  }, [login, name, email, phone]);

  // ─── Submit ──────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      Toast.show({ type: 'error', text1: validationError });
      return;
    }

    const trimmedPhone = phone.trim();
    setSubmitting(true);
    try {
      if (login) {
        await loginStart(trimmedPhone);
      } else {
        await registerStart(name.trim(), trimmedPhone, email.trim());
      }

      // Navigate to OTP screen only in stack mode.
      // In embedded mode, OTP is not navigated — the user stays on Login
      // until OTP verification updates auth state, which auto-swaps the view.
      //
      // NOTE: For the embedded case we still navigate to OTP in the root
      // stack navigator so OTP verification works correctly. After OTP
      // success, the auth state updates and the Profile tab shows ProfileScreen.
      navigation.navigate('Otp', {
        phoneNumber: trimmedPhone,
        spaId,
        serviceId,
        serviceName,
        // Signal that this OTP was triggered from the Profile tab,
        // not from a SpaDetails booking flow.
        isFromProfileTab: isEmbedded,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Please try again.';
      Toast.show({
        type: 'error',
        text1: login ? 'Login failed' : 'Registration failed',
        text2: message,
      });
    } finally {
      setSubmitting(false);
    }
  }, [
    submitting,
    validate,
    phone,
    login,
    loginStart,
    registerStart,
    name,
    email,
    navigation,
    spaId,
    serviceId,
    serviceName,
    isEmbedded,
  ]);

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.container, isTablet && styles.containerTablet]}>
        <View style={[styles.hero, isTablet && styles.heroTablet]}>
          {/* Back button: only shown in stack mode (not embedded) */}
          {!isEmbedded && (
            <Pressable style={styles.heroTopLeftButton} onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
            </Pressable>
          )}
          {/* Spacer so logo is always vertically positioned the same way */}
          {isEmbedded && <View style={styles.heroTopLeftSpacer} />}

          <View style={styles.heroLogoWrap}>
            <Text style={styles.heroLogo}>TOOKA</Text>
            <Text style={styles.heroLogoTagline}>TAKE A BREAK</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>
            {!login ? 'Create your account' : 'Login your account'}
          </Text>
          {!login && (
            <Text style={styles.subtitle}>
              Sign up to discover and book best wellness experiences
            </Text>
          )}

          {!login && (
            <View>
              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Name</Text>
              </View>

              <View style={styles.phoneRow}>
                <TextInput
                  placeholder="Enter your Name"
                  placeholderTextColor="#9A9A9A"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  style={styles.phoneInput}
                />
              </View>

              <View style={styles.fieldLabelRow}>
                <Text style={styles.fieldLabel}>Email</Text>
              </View>

              <View style={styles.phoneRow}>
                <TextInput
                  placeholder="Enter your Email"
                  placeholderTextColor="#9A9A9A"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={styles.phoneInput}
                />
              </View>
            </View>
          )}

          <View style={styles.fieldLabelRow}>
            <Text style={styles.fieldLabel}>Mobile Number</Text>
          </View>

          <View style={styles.phoneRow}>
            <Pressable style={styles.countryCode}>
              <Text style={styles.countryCodeText}>+91</Text>
              <Ionicons name="chevron-down" size={16} color="#FFB02E" />
            </Pressable>
            <TextInput
              placeholder="Enter your number"
              placeholderTextColor="#9A9A9A"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
              style={styles.phoneInput}
              maxLength={10}
            />
          </View>

          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            style={[styles.primaryButton, submitting && styles.primaryButtonDisabled]}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {!login ? 'Create Account' : 'Send OTP'}
              </Text>
            )}
          </Pressable>

          <View style={styles.bottomTextRow}>
            {!login ? (
              <Text style={styles.bottomText}>Already have an account?</Text>
            ) : (
              <Text style={styles.bottomText}>Don't have an account?</Text>
            )}
            <Pressable onPress={() => setLogin(!login)}>
              <Text style={styles.bottomLink}>{!login ? 'Login' : 'Sign up'}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1E8',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  containerTablet: {
    maxWidth: 640,
    alignSelf: 'center',
  },
  hero: {
    marginTop: 12,
    // minHeight: 120,
    borderRadius: 36,
    backgroundColor: '#FFB02E',
    position: 'relative',
    justifyContent: 'space-between',
    padding: 24,
    overflow: 'hidden',
  },
  heroTablet: {
    minHeight: 120,
  },
  heroTopLeftButton: {
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroTopLeftSpacer: {
    // width: 42,
    // height: 42,
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
    backgroundColor: '#FFB02E',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 24,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
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
    color: '#FFB02E',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default LoginScreen;
