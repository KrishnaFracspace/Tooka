import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, styles } from '../styles';

export type MenuItemConfig = {
  id: string;
  title: string;
  iconName: string;
  destructive?: boolean;
  onPress: () => void;
};

type Props = MenuItemConfig & {
  showDivider: boolean;
};

function MenuItem({
  title,
  iconName,
  destructive,
  onPress,
  showDivider,
}: Props): React.ReactElement {
  const iconColor = destructive ? colors.logout : colors.primary;

  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.58 }]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.menuIconWrap}>
          <Ionicons name={iconName} size={20} color={iconColor} />
        </View>
        <Text
          style={[styles.menuLabel, destructive && styles.menuLabelDestructive]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <Ionicons name="chevron-forward" size={24} color={iconColor} />
      </Pressable>
      {showDivider && <View style={styles.menuDivider} />}
    </>
  );
}

export default React.memo(MenuItem);
