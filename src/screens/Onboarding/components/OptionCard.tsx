import React, { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { styles, COLORS } from '../styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface OptionCardProps {
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  icon,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);
  const selectionProgress = useSharedValue(0);

  useEffect(() => {
    selectionProgress.value = withTiming(isSelected ? 1 : 0, { duration: 250 });
  }, [isSelected, selectionProgress]);

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.cardBorder, COLORS.primary]
    );

    const backgroundColor = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.white, COLORS.primaryLight]
    );

    return {
      transform: [{ scale: scale.value }],
      borderColor,
      backgroundColor,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      selectionProgress.value,
      [0, 1],
      [COLORS.textDark, COLORS.primary]
    );
    return { color };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.97, { damping: 10, stiffness: 200 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 10, stiffness: 200 });
      }}
      style={[styles.optionCard, animatedStyle]}
    >
      <Text style={styles.optionIcon}>{icon}</Text>
      <Animated.Text style={[styles.optionText, animatedTextStyle]}>
        {label}
      </Animated.Text>
    </AnimatedPressable>
  );
};
