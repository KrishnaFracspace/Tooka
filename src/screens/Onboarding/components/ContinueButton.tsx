import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { styles } from '../styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface ContinueButtonProps {
  onPress: () => void;
  disabled: boolean;
  text?: string;
}

export const ContinueButton: React.FC<ContinueButtonProps> = ({
  onPress,
  disabled,
  text = 'Continue',
}) => {
  const opacity = useSharedValue(disabled ? 0.5 : 1);

  useEffect(() => {
    opacity.value = withTiming(disabled ? 0.5 : 1, { duration: 250 });
  }, [disabled, opacity]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <AnimatedPressable
      style={[
        styles.button,
        disabled && styles.buttonDisabled,
        animatedStyle,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {text}
      </Text>
    </AnimatedPressable>
  );
};
