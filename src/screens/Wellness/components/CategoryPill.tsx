import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';

interface CategoryPillProps {
  category: string;
}

export const CategoryPill: React.FC<CategoryPillProps> = React.memo(({ category }) => {
  return (
    <View style={styles.categoryPill}>
      <Text style={styles.categoryText}>{category}</Text>
    </View>
  );
});
