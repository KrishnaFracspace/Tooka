import React from 'react';
import { View } from 'react-native';
import { OptionCard } from './OptionCard';
import { OnboardingOption } from '../types';
import { styles } from '../styles';

interface OptionGridProps {
  options: OnboardingOption[];
  selectedIds: string[];
  onToggleOption: (id: string) => void;
}

export const OptionGrid: React.FC<OptionGridProps> = ({
  options,
  selectedIds,
  onToggleOption,
}) => {
  return (
    <View style={styles.gridContainer}>
      {options.map((option) => (
        <View key={option.id} style={styles.cardWrapper}>
          <OptionCard
            label={option.label}
            icon={option.icon}
            isSelected={selectedIds.includes(option.id)}
            onPress={() => onToggleOption(option.id)}
          />
        </View>
      ))}
    </View>
  );
};
