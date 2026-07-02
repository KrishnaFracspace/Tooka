import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

import { HeroSection } from './components/HeroSection';
import { OptionGrid } from './components/OptionGrid';
import { ProgressIndicator } from './components/ProgressIndicator';
import { ContinueButton } from './components/ContinueButton';
import { onboardingData } from './onboardingData';
import { styles } from './styles';
import { OnboardingAnswers } from './types';
import { saveOnboarding } from '../../utils/onboardingStorage';
import { RootStackParamList } from '../../navigation/AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({
    goals: [],
    preferences: [],
  });

  const slideOffset = useSharedValue(0);

  const currentStep = onboardingData[currentStepIndex];
  const selectedOptions = answers[currentStep.key];

  const handleToggleOption = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      setAnswers((prev) => ({
        ...prev,
        [currentStep.key]: prev[currentStep.key].filter((id) => id !== optionId),
      }));
    } else {
      if (selectedOptions.length < 3) {
        setAnswers((prev) => ({
          ...prev,
          [currentStep.key]: [...prev[currentStep.key], optionId],
        }));
      }
    }
  };

  const animatedSlideStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: slideOffset.value }],
    };
  });

  const handleContinue = async () => {
    const isLastStep = currentStepIndex === onboardingData.length - 1;

    if (isLastStep) {
      // Save data to AsyncStorage and replace route
      await saveOnboarding(answers);
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomNavigation' }],
      });
    } else {
      // Slide current screen out to left
      slideOffset.value = withTiming(-width, { duration: 250 }, (finished) => {
        if (finished) {
          runOnJS(setCurrentStepIndex)(currentStepIndex + 1);
        }
      });
    }
  };

  // Slide new screen in from right when step index changes
  useEffect(() => {
    if (currentStepIndex > 0) {
      slideOffset.value = width;
      slideOffset.value = withTiming(0, { duration: 250 });
    }
  }, [currentStepIndex, width, slideOffset]);

  const isContinueDisabled = selectedOptions.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <HeroSection />

        <Animated.View style={[animatedSlideStyle, { flex: 1 }]}>
          <View style={styles.textSection}>
            <Text style={styles.title}>{currentStep.title}</Text>
            <Text style={styles.subtitle}>{currentStep.subtitle}</Text>
          </View>

          <OptionGrid
            options={currentStep.options}
            selectedIds={selectedOptions}
            onToggleOption={handleToggleOption}
          />
        </Animated.View>
      </ScrollView>

      {/* Sticky Bottom Row for progress & action button */}
      <SafeAreaView style={styles.footer} edges={['bottom', 'left', 'right']}>
        <View style={styles.footerRow}>
          <ProgressIndicator
            currentStep={currentStepIndex}
            totalSteps={onboardingData.length}
          />
          <ContinueButton
            onPress={handleContinue}
            disabled={isContinueDisabled}
            text={currentStepIndex === onboardingData.length - 1 ? 'Finish' : 'Continue'}
          />
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
