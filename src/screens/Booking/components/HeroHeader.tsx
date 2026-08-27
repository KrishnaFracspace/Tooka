import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { colors, styles } from '../styles';
import type { BookingService } from '../types';

type Props = {
  service: BookingService;
  onBack: () => void;
};

const formatPrice = (price: number | string): string => {
  const num = typeof price === 'number' ? price : Number(price);
  if (Number.isFinite(num)) {
    return `₹${num.toLocaleString('en-IN')}`;
  }
  return `₹${price}`;
};

function HeroHeader({ service, onBack }: Props): React.ReactElement {
  const spaTitle = service.spaName ?? service.location ?? 'Tooka Wellness';
  const categoryText = service.category ?? 'Massage';
  const ratingText = service.rating != null ? String(service.rating) : '4.8';

  return (
    <View style={styles.heroWrap}>
      {/* Top Header Bar */}
      <View style={styles.topHeaderBar}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [styles.headerBackButton, pressed && { opacity: 0.8 }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={colors.heading} />
        </Pressable>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* Spa & Selected Treatment Confirmation Summary Card */}
      <View style={styles.summaryCard}>
        {/* Spa Row */}
        <View style={styles.spaRow}>
          <Image source={service.image} style={styles.spaThumbnail} resizeMode="cover" />
          <View style={styles.spaMetaColumn}>
            <Text style={styles.spaNameText} numberOfLines={1}>
              {spaTitle}
            </Text>
            <View style={styles.spaLocationRow}>
              <Ionicons name="location-outline" size={14} color={colors.muted} />
              <Text style={styles.spaLocationText} numberOfLines={1}>
                {service.location || 'Hyderabad'}
              </Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={13} color={colors.ratingGold} />
                <Text style={styles.ratingText}>{ratingText}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Divider */}
        <View style={styles.serviceDivider} />

        {/* Selected Service Row */}
        <View style={styles.selectedServiceRow}>
          <View style={styles.selectedServiceMeta}>
            <Text style={styles.serviceCardTitle} numberOfLines={1}>
              {service.name}
            </Text>
            <View style={styles.servicePillsRow}>
              <View style={styles.metaPill}>
                <Ionicons name="time-outline" size={12} color={colors.body} />
                <Text style={styles.metaPillText}>{service.durationMinutes} min</Text>
              </View>
              <View style={styles.metaPill}>
                <Ionicons name="sparkles-outline" size={12} color={colors.body} />
                <Text style={styles.metaPillText}>{categoryText}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.servicePriceText}>{formatPrice(service.price)}</Text>
        </View>
      </View>
    </View>
  );
}

export default React.memo(HeroHeader);
