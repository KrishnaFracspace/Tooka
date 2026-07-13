import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
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
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

import BookingApi from '../../api/BookingApi';
import type {
  BackendBookingListItem,
  BookingStatus,
} from '../../types/booking';

const BOOKING_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
};

type BookingTab = Extract<
  BookingStatus,
  'upcoming' | 'completed' | 'cancelled'
>;

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

const PAGE_SIZE = 20;

const TABS: Array<{ label: string; status: BookingTab }> = [
  { label: 'Upcoming', status: 'upcoming' },
  { label: 'Completed', status: 'completed' },
  { label: 'Cancelled', status: 'cancelled' },
];

const getErrorMessage = (error: unknown): string => {
  if (axios.isCancel(error)) {
    return '';
  }

  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }

    if (error.message.toLowerCase().includes('network')) {
      return 'You are offline. Please check your internet connection.';
    }
  }

  return 'Unable to load bookings. Please try again.';
};

const TabButton: React.FC<TabButtonProps> = ({
  label,
  isActive,
  onPress,
  style,
}) => (
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

const BookingCard: React.FC<BookingCardProps> = ({ booking, style }) => {
  const statusLabel =
    booking.status === 'upcoming'
      ? 'Confirmed'
      : booking.status === 'completed'
      ? 'Completed'
      : 'Cancelled';
  const statusColor = booking.status === 'cancelled' ? '#C85A54' : '#2E8B57';
  const people = booking.guestCount
    ? `${booking.guestCount} ${booking.guestCount === 1 ? 'Person' : 'People'}`
    : 'Guest details pending';
  const bookingCode = booking.bookingReference ?? booking.bookingId;

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
      </View>
    </View>
  );
};

const AllBookingScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const requestControllerRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(0);
  const [activeTab, setActiveTab] = useState<BookingTab>('upcoming');
  const [bookings, setBookings] = useState<BackendBookingListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(
    async (options?: {
      page?: number;
      refresh?: boolean;
      append?: boolean;
    }) => {
      const nextPage = options?.page ?? 1;
      const append = options?.append ?? false;
      const refresh = options?.refresh ?? false;

      requestControllerRef.current?.abort();
      const controller = new AbortController();
      requestControllerRef.current = controller;
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (append) {
        setLoadingMore(true);
      } else if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const result = await BookingApi.getBookingHistory({
          status: activeTab,
          page: nextPage,
          limit: PAGE_SIZE,
          signal: controller.signal,
        });

        if (requestIdRef.current !== requestId) {
          return;
        }

        setPage(result.page);
        setHasMore(result.hasMore);
        setBookings(current =>
          append ? [...current, ...result.items] : result.items,
        );
      } catch (loadError) {
        if (controller.signal.aborted || axios.isCancel(loadError)) {
          return;
        }

        if (requestIdRef.current === requestId) {
          setError(getErrorMessage(loadError));
          if (!append) {
            setBookings([]);
            setHasMore(false);
          }
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoading(false);
          setRefreshing(false);
          setLoadingMore(false);
          requestControllerRef.current = null;
        }
      }
    },
    [activeTab],
  );

  useFocusEffect(
    useCallback(() => {
      loadBookings();

      return () => {
        requestControllerRef.current?.abort();
      };
    }, [loadBookings]),
  );

  const handleRefresh = useCallback(() => {
    loadBookings({ page: 1, refresh: true });
  }, [loadBookings]);

  const handleEndReached = useCallback(() => {
    if (!hasMore || loading || refreshing || loadingMore) {
      return;
    }

    loadBookings({ page: page + 1, append: true });
  }, [hasMore, loadBookings, loading, loadingMore, page, refreshing]);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={bookings}
        key={isTablet ? 'tablet' : 'phone'}
        numColumns={isTablet ? 2 : 1}
        keyExtractor={item => item.id}
        renderItem={renderBooking}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FFB02E"
          />
        }
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.35}
        ListHeaderComponent={
          <>
            <View
              style={[
                styles.tabContainer,
                isTablet && styles.tabContainerTablet,
              ]}
            >
              {TABS.map((tab, index) => (
                <TabButton
                  key={tab.status}
                  label={tab.label}
                  isActive={activeTab === tab.status}
                  onPress={() => setActiveTab(tab.status)}
                  style={index === 1 && styles.tabButtonMiddle}
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
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.stateContainer}>
              <ActivityIndicator color="#FFB02E" />
              <Text style={styles.stateText}>Loading bookings...</Text>
            </View>
          ) : error ? (
            <View style={styles.stateContainer}>
              <Text style={styles.stateTitle}>Unable to load bookings</Text>
              <Text style={styles.stateText}>{error}</Text>
              <Pressable
                style={styles.retryButton}
                onPress={() => loadBookings()}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.stateContainer}>
              <Text style={styles.stateTitle}>No {activeTab} bookings</Text>
              <Text style={styles.stateText}>
                Your bookings from Tooka will appear here.
              </Text>
            </View>
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color="#FFB02E" />
            </View>
          ) : null
        }
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
  footerLoader: {
    paddingVertical: 20,
  },
});

export default AllBookingScreen;
