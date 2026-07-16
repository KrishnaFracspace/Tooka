import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { styles } from '../styles';

interface BookNowButtonProps extends TouchableOpacityProps {
  title?: string;
}

export const BookNowButton: React.FC<BookNowButtonProps> = React.memo(({ title = 'Book Now', style, ...props }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      activeOpacity={0.8}
      accessibilityRole="button"
      {...props}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
});
