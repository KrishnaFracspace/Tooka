import React from 'react';
import { View, Text, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { WellnessRecommendedSpa } from '../types';
import { BookNowButton } from './BookNowButton';
import { COLORS, styles } from '../styles';

interface SpaBookingCardProps {
  spa: WellnessRecommendedSpa;
  onBookPress: (spaId: string) => void;
}

export const SpaBookingCard: React.FC<SpaBookingCardProps> = React.memo(({ spa, onBookPress }) => {
  return (
    <View style={styles.spaCard}>
      <Image source={spa.image} style={styles.spaImage} resizeMode="cover" />
      <View style={styles.spaContent}>
        <Text style={styles.spaName} numberOfLines={1}>{spa.name}</Text>
        
        <View style={styles.spaMeta}>
          <Ionicons name="star" size={12} color={COLORS.secondaryText} />
          <Text style={styles.spaMetaText}>{spa.rating.toFixed(1)}</Text>
          <Text style={styles.spaDot}>•</Text>
          <Text style={styles.spaMetaText}>{spa.distance}</Text>
        </View>
        
        <BookNowButton onPress={() => onBookPress(spa.id)} />
      </View>
    </View>
  );
});
