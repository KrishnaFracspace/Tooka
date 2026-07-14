import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FullScreenLoader from '../../components/loaders/FullScreenLoader';
import { useMyBookings } from '../../hooks/useMyBookings';
import type { BackendBookingListItem, BookingSection } from '../../types/booking';
import BookingCard from './components/BookingCard';

type BookingTab = BookingSection;

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const TABS: Array<{ label: string; section: BookingTab }> = [
  { label: 'Upcoming', section: 'upcoming' },
  { label: 'Completed', section: 'completed' },
  { label: 'Cancelled', section: 'cancelled' },
];

const EMPTY_STATE_MESSAGES: Record<BookingTab, string> = {
  upcoming: 'No upcoming bookings',
  completed: 'No completed bookings',
  cancelled: 'No cancelled bookings',
};

const TabButton = React.memo<TabButtonProps>(function TabButton({
  label,
  isActive,
  onPress,
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, isActive && styles.tabButtonActive, style]}
      android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
    >
      <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
});

const AllBookingScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');

  const {
    upcomingBookings,
    completedBookings,
    cancelledBookings,
    loading,
    refreshing,
    error,
    hasFetchedOnce,
    refetch,
    onRefresh,
  } = useMyBookings();

  const activeBookings = useMemo(() => {
    switch (activeTab) {
      case 'upcoming':
        return upcomingBookings;
      case 'completed':
        return completedBookings;
      case 'cancelled':
        return cancelledBookings;
      default:
        return upcomingBookings;
    }
  }, [activeTab, upcomingBookings, completedBookings, cancelledBookings]);

  const handleTabPress = useCallback((section: BookingTab) => {
    setActiveTab(section);
  }, []);

  const renderBooking = useCallback(
    ({ item, index }: { item: BackendBookingListItem; index: number }) => (
      <BookingCard
        booking={item}
        style={[
          styles.bookingCardItem,
          isTablet && styles.bookingCardItemTablet,
          index % 2 === 1 && isTablet && styles.tabletCardRight,
        ]}
      />
    ),
    [isTablet],
  );

  const keyExtractor = useCallback(
    (item: BackendBookingListItem) => item.id,
    [],
  );

  const listHeader = useMemo(
    () => (
      <>
        <View
          style={[styles.tabContainer, isTablet && styles.tabContainerTablet]}
        >
          {TABS.map((tab, index) => (
            <TabButton
              key={tab.section}
              label={tab.label}
              isActive={activeTab === tab.section}
              onPress={() => handleTabPress(tab.section)}
              style={index === 1 ? styles.tabButtonMiddle : undefined}
            />
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'upcoming' && 'Upcoming Bookings'}
            {activeTab === 'completed' && 'Completed Bookings'}
            {activeTab === 'cancelled' && 'Cancelled Bookings'}
          </Text>
        </View>
      </>
    ),
    [activeTab, handleTabPress, isTablet],
  );

  const listEmpty = useMemo(() => {
    if (error) {
      return (
        <View style={styles.stateContainer}>
          <Text style={styles.stateTitle}>Unable to load bookings</Text>
          <Text style={styles.stateText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <View style={styles.stateContainer}>
        <Text style={styles.stateTitle}>{EMPTY_STATE_MESSAGES[activeTab]}</Text>
      </View>
    );
  }, [activeTab, error, refetch]);

  if (loading && !hasFetchedOnce) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <FullScreenLoader />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={activeBookings}
        key={isTablet ? 'tablet' : 'phone'}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={keyExtractor}
        renderItem={renderBooking}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFB02E"
          />
        }
        ListHeaderComponent={listHeader}
        ListEmptyComponent={listEmpty}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF7EE',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 20,
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 8,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  tabContainerTablet: {
    maxWidth: 400,
    alignSelf: 'center',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  tabButtonMiddle: {
    marginHorizontal: 8,
  },
  tabButtonActive: {
    backgroundColor: '#FFB02E',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6D6D6D',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  bookingCardItem: {
    marginBottom: 16,
  },
  bookingCardItemTablet: {
    width: '48%',
    marginBottom: 20,
  },
  tabletCardRight: {
    marginLeft: 12,
  },
  stateContainer: {
    paddingVertical: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateTitle: {
    fontSize: 17,
    color: '#1E1E1E',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  stateText: {
    fontSize: 14,
    color: '#8A8A8A',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 18,
    backgroundColor: '#FFB02E',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
});

export default AllBookingScreen;
