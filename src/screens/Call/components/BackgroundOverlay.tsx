import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface BackgroundOverlayProps {
  avatarUrl?: string;
}

export const BackgroundOverlay: React.FC<BackgroundOverlayProps> = React.memo(({ avatarUrl }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {avatarUrl ? (
        <Image source={{ uri: avatarUrl }} style={styles.backgroundImage} blurRadius={50} />
      ) : (
        <View style={styles.fallbackBackground} />
      )}
      
      {/* Dark overlay to ensure text legibility */}
      <View style={styles.overlay} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill as any,
    width,
    height,
    zIndex: -1,
    backgroundColor: '#1E1E1E', // Base dark color
  },
  backgroundImage: {
    ...StyleSheet.absoluteFill as any,
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  fallbackBackground: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: '#2A2A2A',
  },
  overlay: {
    ...StyleSheet.absoluteFill as any,
    backgroundColor: 'rgba(0, 0, 0, 0.65)', // Darken for premium feel without BlurView
  },
});
