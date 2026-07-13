import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
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
import { getBookingSection } from '../../utils/getBookingSection';
import { getBookingStatusBadgeLabel } from '../../utils/getBookingStatusBadgeLabel';
import { getPaymentStatusLabel } from '../../utils/getPaymentStatusLabel';

const BOOKING_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
};

type BookingTab = BookingSection;

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

type BookingCardProps = {
  booking: BackendBookingListItem;
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

const BookingCard = React.memo<BookingCardProps>(function BookingCard({
  booking,
  style,
}) {
  const statusLabel = getBookingStatusBadgeLabel(booking.status);
  const statusColor =
    getBookingSection(booking.status) === 'cancelled' ? '#C85A54' : '#2E8B57';
  const people = booking.guestCount
    ? `${booking.guestCount} ${booking.guestCount === 1 ? 'Person' : 'People'}`
    : 'Guest details pending';
  const bookingCode = booking.bookingReference ?? booking.bookingId;
  const paymentStatusLabel = getPaymentStatusLabel(booking.paymentStatus);

  return (
    <View style={[styles.bookingCard, style]}>
      <View style={styles.cardImageContainer}>
        <Image
          source={booking.spaImage ? { uri: booking.spaImage } : BOOKING_IMAGE}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusBadgeText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.spaName} numberOfLines={2}>
          {booking.spaName}
        </Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText} numberOfLines={1}>
            {booking.location || 'Location unavailable'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>👤</Text>
          <Text style={styles.detailText}>{people}</Text>
        </View>

        <View style={styles.detailRowDual}>
          <View style={styles.detailRowItem}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{booking.date}</Text>
          </View>
          <View style={styles.detailRowItem}>
            <Text style={styles.detailIcon}>⏰</Text>
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bookingIdRow}>
          <View>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue} numberOfLines={1}>
              {bookingCode || 'Pending'}
            </Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💳</Text>
          <Text style={styles.detailText}>{paymentStatusLabel}</Text>
        </View>
      </View>
    </View>
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
    backgroundColor: '#F6F1E8',
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
    marginBottom: 20,
  },
  bookingCardItemTablet: {
    width: '48%',
    marginBottom: 20,
  },
  tabletCardRight: {
    marginLeft: 12,
  },
  bookingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardImageContainer: {
    position: 'relative',
    width: 120,
    height: 160,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
  },
  cardContent: {
    flex: 1,
    padding: 18,
    justifyContent: 'space-between',
  },
  spaName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1E1E',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailRowDual: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#6D6D6D',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E3D8',
    marginVertical: 12,
  },
  bookingIdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingIdLabel: {
    fontSize: 12,
    color: '#8A8A8A',
    fontWeight: '600',
    marginBottom: 4,
  },
  bookingIdValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E1E1E',
    maxWidth: 180,
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
