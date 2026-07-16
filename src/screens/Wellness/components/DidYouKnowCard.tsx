import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, styles } from '../styles';

interface DidYouKnowCardProps {
  content: string;
}

export const DidYouKnowCard: React.FC<DidYouKnowCardProps> = React.memo(({ content }) => {
  return (
    <View style={styles.dykCard}>
      <View style={styles.dykHeader}>
        <Ionicons name="bulb-outline" size={24} color={COLORS.primary} />
        <Text style={styles.dykTitle}>Did you know?</Text>
      </View>
      <Text style={styles.dykBody}>{content}</Text>
      
      {/* Decorative large icon in the background */}
      <View style={styles.dykDecoration}>
        <Ionicons name="bulb-outline" size={100} color={COLORS.primary} />
      </View>
    </View>
  );
});
