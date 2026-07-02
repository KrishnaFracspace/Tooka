import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  type NativeSyntheticEvent,
  type TextInputKeyPressEventData,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthHeader } from '../components/AuthHeader';
import { AuthCard } from '../components/AuthCard';
import { GradientButton } from '../components/GradientButton';
import { NameInput } from '../components/NameInput';
import { OTPInput } from '../components/OTPInput';
import { PhoneInput } from '../components/PhoneInput';
import { ResendOtp } from '../components/ResendOtp';
import { StepIndicator } from '../components/StepIndicator';
import { TermsText } from '../components/TermsText';
import { AUTH_COLORS, AUTH_CONFIG, AUTH_TEXT, getKeyboardBehavior, saveName, sendOtp, verifyOtp } from '../constants/auth';
import { useKeyboard } from '../hooks/useKeyboard';
import { useOtpTimer } from '../hooks/useOtpTimer';
import type { AuthStep } from '../types/auth';

const AuthenticationScreen: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(AUTH_CONFIG.otpLength).fill(''));
  const [otpDigits, setOtpDigits] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const otpRefs = useRef<Array<TextInput | null>>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isKeyboardVisible = useKeyboard();
  const { timeLeft, reset, isExpired } = useOtpTimer(AUTH_CONFIG.resendSeconds);

  const stepIndex = useMemo(() => ({ phone: 0, otp: 1, name: 2, success: 2 })[step], [step]);

  const animateTransition = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    animateTransition();
  }, [step, animateTransition]);

  const handlePhoneSubmit = useCallback(async () => {
    if (phone.length !== AUTH_CONFIG.phoneLength || loading) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    const response = await sendOtp(phone);
    setLoading(false);
    if (!response.success) {
      setError(response.message ?? 'Unable to send OTP');
      return;
    }

    setSuccessMessage('OTP sent successfully');
    setStep('otp');
    setOtpDigits('');
    setOtp(Array(AUTH_CONFIG.otpLength).fill(''));
    reset();
  }, [loading, phone, reset]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) {
      return;
    }
    const nextOtp = [...otp];
    nextOtp[index] = value;
    setOtp(nextOtp);
    setOtpDigits(nextOtp.join(''));
    if (value && index < AUTH_CONFIG.otpLength - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  }, [otp]);

  const handleOtpKeyPress = useCallback((index: number, event: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      const nextOtp = [...otp];
      nextOtp[index - 1] = '';
      setOtp(nextOtp);
      setOtpDigits(nextOtp.join(''));
      otpRefs.current[index - 1]?.focus();
    }
  }, [otp]);

  const handleOtpSubmit = useCallback(async () => {
    if (otpDigits.length !== AUTH_CONFIG.otpLength || submitting) {
      return;
    }

    setSubmitting(true);
    setError('');
    const response = await verifyOtp(otpDigits);
    setSubmitting(false);

    if (!response.success) {
      setError(response.message ?? 'Wrong OTP');
      return;
    }

    setSuccessMessage(response.message ?? 'Verified');
    const existingUser = await (await import('../constants/auth')).checkExistingUser(phone);
    if (existingUser) {
      setStep('success');
      return;
    }

    setStep('name');
  }, [otpDigits, phone, submitting]);

  const handleNameSubmit = useCallback(async () => {
    if (name.trim().length < AUTH_CONFIG.minNameLength || submitting) {
      setError('Please enter at least 2 characters');
      return;
    }

    setSubmitting(true);
    setError('');
    const response = await saveName(name);
    setSubmitting(false);

    if (!response.success) {
      setError(response.message ?? 'Unable to save profile');
      return;
    }

    setSuccessMessage(response.message ?? 'Done');
    setStep('success');
  }, [name, submitting]);

  const handleResendOtp = useCallback(() => {
    setOtp(Array(AUTH_CONFIG.otpLength).fill(''));
    setOtpDigits('');
    reset();
    setError('');
    setSuccessMessage('OTP resent');
  }, [reset]);

  const renderBody = () => {
    if (step === 'success') {
      return (
        <Animated.View style={styles.successCard}>
          <Text style={styles.successTitle}>Authentication complete</Text>
          <Text style={styles.successSubtitle}>You’re all set to explore Tooka wellness experiences.</Text>
          <GradientButton label="Continue" onPress={() => {}} disabled />
        </Animated.View>
      );
    }

    return (
      <Animated.View style={styles.formCard}>
        {/* <Text style={styles.cardTitle}>{step === 'phone' ? AUTH_TEXT.title : step === 'otp' ? AUTH_TEXT.otpTitle : AUTH_TEXT.nameTitle}</Text> */}
        {/* <Text style={styles.cardSubtitle}>{step === 'phone' ? AUTH_TEXT.subtitle : step === 'otp' ? AUTH_TEXT.otpSubtitle : AUTH_TEXT.nameSubtitle}</Text> */}

        {step === 'phone' ? (
          <PhoneInput value={phone} onChangeText={setPhone} error={error} disabled={loading} />
        ) : step === 'otp' ? (
          <View style={styles.otpContainer}>
            <View style={styles.otpBoxes}>
              {otp.map((digit, index) => (
                <OTPInput
                  key={index}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  onKeyPress={(event) => handleOtpKeyPress(index, event)}
                  onFocus={() => otpRefs.current[index]?.focus()}
                  inputRef={(ref) => {
                    otpRefs.current[index] = ref;
                  }}
                  autoFocus={index === 0}
                />
              ))}
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <ResendOtp timeLeft={timeLeft} isExpired={isExpired} onResend={handleResendOtp} />
          </View>
        ) : (
          <NameInput value={name} onChangeText={setName} error={error} />
        )}

        {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}

        <GradientButton
          label={step === 'phone' ? 'Send OTP' : step === 'otp' ? 'Verify OTP' : 'Continue'}
          onPress={step === 'phone' ? handlePhoneSubmit : step === 'otp' ? handleOtpSubmit : handleNameSubmit}
          loading={loading || submitting}
          disabled={step === 'phone' ? phone.length !== AUTH_CONFIG.phoneLength : step === 'otp' ? otpDigits.length !== AUTH_CONFIG.otpLength : name.trim().length < AUTH_CONFIG.minNameLength}
        />

        {step === 'phone' || step === 'otp' ? <TermsText /> : null}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.flex} behavior={getKeyboardBehavior()} keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.flex}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <AuthHeader title={step === 'phone' ? AUTH_TEXT.title : step === 'otp' ? AUTH_TEXT.otpTitle : step === 'name' ? AUTH_TEXT.nameTitle : 'You’re all set'} subtitle={step === 'phone' ? AUTH_TEXT.subtitle : step === 'otp' ? AUTH_TEXT.otpSubtitle : step === 'name' ? AUTH_TEXT.nameSubtitle : 'Authentication complete'} />
              <AuthCard>
                {/* <StepIndicator activeStep={stepIndex} /> */}
                {renderBody()}
              </AuthCard>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AUTH_COLORS.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 28,
  },
  formCard: {
    marginTop: 12,
  },
  successCard: {
    marginTop: 12,
    paddingVertical: 24,
    alignItems: 'center',
  },
  cardTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 22,
    color: AUTH_COLORS.text,
    textAlign: 'center',
  },
  cardSubtitle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: AUTH_COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
  },
  otpContainer: {
    width: '100%',
    marginTop: 4,
  },
  otpBoxes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  errorText: {
    marginTop: 8,
    color: AUTH_COLORS.error,
    fontFamily: 'WorkSans-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
  successText: {
    marginTop: 10,
    color: AUTH_COLORS.primary,
    fontFamily: 'WorkSans-Regular',
    fontSize: 13,
    textAlign: 'center',
  },
  successTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 22,
    color: AUTH_COLORS.text,
  },
  successSubtitle: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: AUTH_COLORS.secondaryText,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 18,
    lineHeight: 20,
  },
});

export default AuthenticationScreen;
