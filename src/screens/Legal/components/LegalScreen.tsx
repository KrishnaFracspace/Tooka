import React, { useEffect, useRef } from 'react';
import { Animated, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { LegalScreenProps } from '../types';
import { layout, styles } from '../styles';
import LegalHeader from './LegalHeader';
import LegalSection from './LegalSection';

function LegalScreen({
  title,
  lastUpdated,
  sections,
}: LegalScreenProps): React.ReactElement {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isTablet = width >= layout.tabletBreakpoint;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
        <LegalHeader title={title} onBack={() => navigation.goBack()} />

        <View style={styles.cardContainer}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              isTablet && styles.tabletContent,
            ]}
            showsVerticalScrollIndicator={false}
            bounces
            overScrollMode="always"
          >
            <Text
              style={styles.lastUpdated}
              allowFontScaling
              maxFontSizeMultiplier={1.3}
              accessibilityRole="text"
            >
              Last Updated: {lastUpdated}
            </Text>

            {sections.map((section) => (
              <LegalSection key={section.heading} section={section} />
            ))}
          </ScrollView>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

export default React.memo(LegalScreen);
