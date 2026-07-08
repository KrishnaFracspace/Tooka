import React, { useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, styles } from '../styles';

type Props = {
  eyebrow: string;
  title: string;
  iconName: string;
  onPress: () => void;
};

function SupportCard({ eyebrow, title, iconName, onPress }: Props): React.ReactElement {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value: number) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={() => animateTo(0.97)}
        onPressOut={() => animateTo(1)}
        style={styles.supportCard}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.supportIconCircle}>
          <Ionicons name={iconName} size={20} color={colors.primary} />
        </View>
        <View>
          <Text style={styles.supportEyebrow} numberOfLines={1}>
            {eyebrow}
          </Text>
          <Text style={styles.supportTitle} numberOfLines={1}>
            {title}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default React.memo(SupportCard);
