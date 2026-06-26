import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SpaDetailsSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safeArea}>
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSkeleton} />
      <View style={styles.badgeRow}>
        <View style={styles.badgeSkeleton} />
        <View style={styles.badgeSkeleton} />
        <View style={styles.badgeSkeleton} />
        <View style={styles.badgeSkeleton} />
      </View>
      <View style={styles.sectionSkeleton} />
      <View style={styles.cardSkeleton} />
      <View style={styles.cardSkeleton} />
      <View style={styles.cardSkeleton} />
      <View style={styles.sectionSkeleton} />
      <View style={styles.reviewSkeletonRow}>
        <View style={styles.reviewSkeleton} />
        <View style={styles.reviewSkeleton} />
      </View>
      <View style={styles.sectionSkeleton} />
      <View style={styles.mapSkeleton} />
      <View style={styles.sectionSkeleton} />
      <View style={styles.actionSkeleton} />
      <View style={styles.actionSkeleton} />
      <View style={styles.sectionSkeleton} />
      <View style={styles.offerSkeleton} />
      <View style={styles.sectionSkeleton} />
      <View style={styles.offerSkeleton} />
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F1E8',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  heroSkeleton: {
    width: '100%',
    height: 320,
    borderRadius: 28,
    backgroundColor: '#E4DFD5',
    marginTop: 16,
    marginBottom: 24,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  badgeSkeleton: {
    width: '23%',
    height: 52,
    borderRadius: 10,
    backgroundColor: '#E4DFD5',
  },
  sectionSkeleton: {
    width: '48%',
    height: 20,
    borderRadius: 8,
    backgroundColor: '#E4DFD5',
    marginBottom: 16,
  },
  cardSkeleton: {
    width: '100%',
    height: 130,
    borderRadius: 24,
    backgroundColor: '#E4DFD5',
    marginBottom: 16,
  },
  reviewSkeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reviewSkeleton: {
    width: '48%',
    height: 140,
    borderRadius: 24,
    backgroundColor: '#E4DFD5',
    marginBottom: 16,
  },
  mapSkeleton: {
    width: '100%',
    height: 180,
    borderRadius: 24,
    backgroundColor: '#E4DFD5',
    marginBottom: 16,
  },
  actionSkeleton: {
    width: '100%',
    height: 56,
    borderRadius: 18,
    backgroundColor: '#E4DFD5',
    marginBottom: 12,
  },
  offerSkeleton: {
    width: '100%',
    height: 120,
    borderRadius: 28,
    backgroundColor: '#E4DFD5',
    marginBottom: 16,
  },
});

export default React.memo(SpaDetailsSkeleton);
