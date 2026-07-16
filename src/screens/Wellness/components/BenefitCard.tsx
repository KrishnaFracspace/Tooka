import React from 'react';
import { View, Text } from 'react-native';
import { WellnessBenefit } from '../types';
import { styles } from '../styles';

interface BenefitCardProps {
  benefit: WellnessBenefit;
}

export const BenefitCard: React.FC<BenefitCardProps> = React.memo(({ benefit }) => {
  return (
    <View style={styles.benefitCard}>
      <View style={styles.benefitIconContainer}>
        {/* Since icons could be strings or components, assuming simple string emoji/text for now */}
        <Text style={{ fontSize: 24 }}>{benefit.icon}</Text>
      </View>
      <Text style={styles.benefitTitle}>{benefit.title}</Text>
      <Text style={styles.benefitDesc}>{benefit.description}</Text>
    </View>
  );
});
