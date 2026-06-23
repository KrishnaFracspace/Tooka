import React, { useEffect, useRef, useState } from 'react';
import {
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

const OTP_LENGTH = 6;

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
    selectionColor="#7B8B55"
  />
);

const OtpScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(23);
  const inputsRef = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    inputsRef.current[activeIndex]?.focus();
  }, [activeIndex]);

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

  const handleResend = () => {
    setSeconds(30);
    setOtp(Array(OTP_LENGTH).fill(''));
    setActiveIndex(0);
  };

  const isComplete = otp.every((digit) => digit !== '');

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
            <Text style={styles.heroPhone}>+91 1234567890</Text>
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
          style={[styles.verifyButton, isComplete ? styles.verifyButtonActive : styles.verifyButtonDisabled]}
          disabled={!isComplete}
        >
          <Text style={styles.verifyButtonText}>Verify OTP</Text>
        </Pressable>
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
    paddingBottom: 24,
  },
  hero: {
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: '#8F9E75',
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
    borderColor: '#7B8B55',
  },
  otpFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  otpFooterText: {
    color: '#7B8B55',
    fontSize: 14,
  },
  otpFooterTimer: {
    color: '#7B8B55',
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  otpFooterLink: {
    color: '#7B8B55',
    fontSize: 14,
    fontWeight: '700',
  },
  otpFooterLinkDisabled: {
    color: '#A0A089',
  },
  verifyButton: {
    marginTop: 26,
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
  },
  verifyButtonActive: {
    backgroundColor: '#7B8B55',
  },
  verifyButtonDisabled: {
    backgroundColor: '#C2C6AF',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OtpScreen;
