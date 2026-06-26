// ─────────────────────────────────────────────────────────────────────────────
// OtpScreen
//
// Navigation after successful OTP verification:
//
//  Case A — from SpaDetails booking flow (spaId present):
//   → navigate to SpaDetails with openEnquiry=true
//
//  Case B — from Profile tab embedded Login (isFromProfileTab=true):
//   → navigate to BottomNavigation (reset stack)
//   → The Profile tab will automatically show ProfileScreen because
//     auth state is now updated (isAuthenticated=true).
//
//  Case C — fallback (neither spaId nor isFromProfileTab):
//   → goBack() to the calling screen
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth } from '../../context/AuthContext';

const OTP_LENGTH = 6;

type OtpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Otp'>;
type OtpScreenRouteProp = RouteProp<RootStackParamList, 'Otp'>;

// ─── OTP Digit Input ─────────────────────────────────────────────────────────

type OtpDigitInputProps = {
  value: string;
  active: boolean;
  onChangeText: (text: string) => void;
  onKeyPress: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
  onFocus: () => void;
  inputRef: (ref: TextInput | null) => void;
};

const OtpDigitInput: React.FC<OtpDigitInputProps> = ({
  value,
  active,
  onChangeText,
  onKeyPress,
  onFocus,
  inputRef,
}) => (
  <TextInput
    ref={inputRef}
    value={value}
    keyboardType="number-pad"
    returnKeyType="done"
    maxLength={1}
    onChangeText={onChangeText}
    onKeyPress={onKeyPress}
    onFocus={onFocus}
    style={[styles.otpCell, active && styles.otpCellActive]}
    textContentType="oneTimeCode"
    selectionColor="#FFB02E"
  />
);

// ─── OtpScreen ────────────────────────────────────────────────────────────────

const OtpScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const navigation = useNavigation<OtpScreenNavigationProp>();
  const route = useRoute<OtpScreenRouteProp>();
  const {
    phoneNumber = '',
    spaId,
    serviceId,
    serviceName,
    isFromProfileTab = false,
  } = route.params ?? {};
  const { verifyOtp, loginStart } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(30);
  const [verifying, setVerifying] = useState<boolean>(false);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  // ─── Countdown Timer ──────────────────────────────────────────────────────

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ─── Auto-focus ───────────────────────────────────────────────────────────

  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

  // ─── OTP Input Handlers ───────────────────────────────────────────────────

  const handleChangeText = (text: string, index: number) => {
    if (!text) {
      setOtp((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    const digit = text.slice(-1);
    if (!/^[0-9]$/.test(digit)) {
      return;
    }

    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    if (index < OTP_LENGTH - 1) {
      setActiveIndex(index + 1);
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      setActiveIndex(index - 1);
      setOtp((prev) => {
        const next = [...prev];
        next[index - 1] = '';
        return next;
      });
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────────────────────

  const handleResend = useCallback(async () => {
    if (!phoneNumber) return;
    try {
      await loginStart(phoneNumber);
      setSeconds(30);
      setOtp(Array(OTP_LENGTH).fill(''));
      setActiveIndex(0);
      Toast.show({ type: 'success', text1: 'OTP resent' });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Please try again.';
      Toast.show({
        type: 'error',
        text1: 'Could not resend OTP',
        text2: message,
      });
    }
  }, [phoneNumber, loginStart]);

  // ─── Verify ───────────────────────────────────────────────────────────────

  const isComplete = otp.every((digit) => digit !== '');

  const handleVerify = useCallback(async () => {
    if (verifying || !isComplete) return;

    const code = otp.join('');
    setVerifying(true);
    try {
    //   await verifyOtp(phoneNumber, code);
      const loggedInUser =
  await verifyOtp(phoneNumber, code);

      // Navigate based on the origin of the OTP flow.
      if (spaId) {
        // Case A: Booking flow — return to SpaDetails with enquiry open.
        navigation.navigate('SpaDetails', {
          spaId,
          serviceId,
          serviceName,
          openEnquiry: true,
        });
      } else if (isFromProfileTab) {
        // Case B: Profile tab flow — go to BottomNavigation.
        // The Profile tab will automatically render ProfileScreen because
        // isAuthenticated is now true (auth state already updated above).
        console.log(
            'LOGIN SUCCESS USER =>',
            loggedInUser,
        );
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomNavigation' }],
        });
      } else {
        // Case C: Generic fallback — go back to calling screen.
        navigation.goBack();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Please check the code and try again.';
      Toast.show({
        type: 'error',
        text1: 'OTP verification failed',
        text2: message,
      });
    } finally {
      setVerifying(false);
    }
  }, [
    verifying,
    isComplete,
    otp,
    verifyOtp,
    phoneNumber,
    spaId,
    serviceId,
    serviceName,
    isFromProfileTab,
    navigation,
  ]);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, isTablet && styles.heroTablet]}>
          <View style={styles.heroTopCurve} />
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoIcon}>🔒</Text>
            </View>
            <Text style={styles.heroTitle}>Verify your number</Text>
            <Text style={styles.heroSubtitle}>Enter the 6-digit code sent to</Text>
            <Text style={styles.heroPhone}>+91 {phoneNumber}</Text>
          </View>
        </View>

        <View style={[styles.codeRow, isTablet && styles.codeRowTablet]}>
          {otp.map((value, index) => (
            <OtpDigitInput
              key={index}
              value={value}
              active={index === activeIndex}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => setActiveIndex(index)}
              inputRef={(ref) => {
                inputsRef.current[index] = ref;
              }}
            />
          ))}
        </View>

        <View style={styles.otpFooter}>
          <Text style={styles.otpFooterText}>Resend OTP? in </Text>
          <Text style={styles.otpFooterTimer}>{`00:${seconds.toString().padStart(2, '0')}`}</Text>
          <Pressable onPress={handleResend} disabled={seconds > 0}>
            <Text style={[styles.otpFooterLink, seconds > 0 && styles.otpFooterLinkDisabled]}>
              Resend
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={[
            styles.verifyButton,
            isComplete && !verifying
              ? styles.verifyButtonActive
              : styles.verifyButtonDisabled,
          ]}
          disabled={!isComplete || verifying}
          onPress={handleVerify}
        >
          {verifying ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          )}
        </Pressable>
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
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  hero: {
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: '#FFB02E',
    minHeight: 380,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  heroTablet: {
    minHeight: 420,
  },
  heroTopCurve: {
    position: 'absolute',
    top: -120,
    left: -120,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: '#F6F1E8',
  },
  heroContent: {
    paddingHorizontal: 26,
    paddingBottom: 36,
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: '#F6F1E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  logoIcon: {
    fontSize: 40,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.82)',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  heroPhone: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  codeRow: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  codeRowTablet: {
    marginTop: 34,
  },
  otpCell: {
    width: 52,
    height: 62,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#E3E0D7',
  },
  otpCellActive: {
    borderColor: '#FFB02E',
  },
  otpFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  otpFooterText: {
    color: '#FFB02E',
    fontSize: 14,
  },
  otpFooterTimer: {
    color: '#FFB02E',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  otpFooterLink: {
    color: '#FFB02E',
    fontSize: 14,
    fontWeight: '700',
  },
  otpFooterLinkDisabled: {
    color: '#FFB02E',
    opacity: 0.5,
  },
  verifyButton: {
    marginTop: 26,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  verifyButtonActive: {
    backgroundColor: '#FFB02E',
  },
  verifyButtonDisabled: {
    backgroundColor: '#ada291',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OtpScreen;
