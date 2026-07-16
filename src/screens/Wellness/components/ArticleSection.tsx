import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { styles } from '../styles';

interface ArticleSectionProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ArticleSection: React.FC<ArticleSectionProps> = React.memo(({ children, style }) => {
  return (
    <View style={[styles.section, style]}>
      {children}
    </View>
  );
});
