import React from 'react';
import { Image, Pressable, Text, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Ionicons from 'react-native-vector-icons/Ionicons';

import PriceCard from './PriceCard';
import { colors, styles } from '../styles';
import type { BookingService } from '../types';

type Props = {
  service: BookingService;
  onBack: () => void;
};

function HeroHeader({ service, onBack }: Props): React.ReactElement {
  const { width } = useWindowDimensions();
  const curveHeight = Math.max(94, width * 0.18);

  return (
    <View style={[styles.heroWrap, { marginBottom: 0 }]}>
      <View style={styles.heroImageWrap}>
        <Image source={service.image} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay}>
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.8 }]}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={25} color={colors.white} />
          </Pressable>
        </View>
        <Svg width={width} height={curveHeight} viewBox={`0 0 ${width} ${curveHeight}`} style={styles.curveSvg}>
          <Path
            d={`M0 ${curveHeight * 0.38} C ${width * 0.22} ${curveHeight * 1.06}, ${width * 0.55} ${curveHeight * 0.58}, ${width} ${curveHeight * 0.83} L ${width} ${curveHeight} L 0 ${curveHeight} Z`}
            fill={colors.background}
          />
          <Path
            d={`M0 ${curveHeight * 0.33} C ${width * 0.24} ${curveHeight * 0.95}, ${width * 0.58} ${curveHeight * 0.51}, ${width} ${curveHeight * 0.78}`}
            stroke={colors.primary}
            strokeWidth={4}
            fill="none"
          />
        </Svg>
      </View>

      <View style={styles.serviceCard}>
        <View>
          <Text style={styles.serviceTitle}>{service.name}</Text>
          <View style={styles.durationRow}>
            <View style={styles.clockCircle}>
              <Ionicons name="checkmark" size={12} color={colors.muted} />
            </View>
            <Text style={styles.durationText}>{service.durationMinutes} mins</Text>
          </View>
        </View>

        <PriceCard label="Starting from" value={service.price} />
      </View>
    </View>
  );
}

export default React.memo(HeroHeader);
