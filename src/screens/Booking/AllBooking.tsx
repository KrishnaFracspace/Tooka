import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BOOKING_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=60',
};

type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

type TabButtonProps = {
  label: string;
  isActive: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress, style }) => (
  <Pressable
    onPress={onPress}
    style={[styles.tabButton, isActive && styles.tabButtonActive, style]}
    android_ripple={{ color: 'rgba(255,255,255,0.2)', borderless: false }}
  >
    <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
  </Pressable>
);

type BookingCardProps = {
  spaName: string;
  location: string;
  service: string;
  people: string;
  date: string;
  time: string;
  bookingId: string;
  status: BookingStatus;
  imageSource?: { uri: string };
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const BookingCard: React.FC<BookingCardProps> = ({
  spaName,
  location,
  service,
  people,
  date,
  time,
  bookingId,
  status,
  imageSource,
  onPress,
  style,
}) => {
  const statusLabel =
    status === 'upcoming' ? 'Confirmed' : status === 'completed' ? 'Completed' : 'Cancelled';
  const statusColor =
    status === 'upcoming' ? '#7B8B55' : status === 'completed' ? '#2E8B57' : '#C85A54';

  return (
    <View style={[styles.bookingCard, style]}>
      <View style={styles.cardImageContainer}>
        <Image source={imageSource ?? BOOKING_IMAGE} style={styles.cardImage} resizeMode="cover" />
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusBadgeText}>{statusLabel}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.spaName}>{spaName}</Text>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{location}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>🧖</Text>
          <Text style={styles.detailText}>{service}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>👤</Text>
          <Text style={styles.detailText}>{people}</Text>
        </View>

        <View style={styles.detailRowDual}>
          <View style={styles.detailRowItem}>
            <Text style={styles.detailIcon}>📅</Text>
            <Text style={styles.detailText}>{date}</Text>
          </View>
          <View style={styles.detailRowItem}>
            <Text style={styles.detailIcon}>⏰</Text>
            <Text style={styles.detailText}>{time}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.bookingIdRow}>
          <View>
            <Text style={styles.bookingIdLabel}>Booking ID</Text>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>
          <Pressable style={styles.bookNowButton} onPress={onPress}>
            <Text style={styles.bookNowButtonText}>Book Now</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const AllBookingScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [activeTab, setActiveTab] = useState<BookingStatus>('upcoming');

  const bookings = [
    {
      id: '1',
      spaName: 'Tiamoz Salon & Spa',
      location: 'Banjara Hills, Hyderabad',
      service: 'Body Massage (60 mins)',
      people: '1 Person',
      date: 'Today, 21 Jun',
      time: '12:00 PM',
      bookingId: 'TK987654',
      status: 'upcoming' as BookingStatus,
    },
    {
      id: '2',
      spaName: 'Tiamoz Salon & Spa',
      location: 'Banjara Hills, Hyderabad',
      service: 'Body Massage (60 mins)',
      people: '1 Person',
      date: 'Today, 21 Jun',
      time: '12:00 PM',
      bookingId: 'TK987654',
      status: 'upcoming' as BookingStatus,
    },
  ];

  const filteredBookings = bookings.filter((b) => b.status === activeTab);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Bookings</Text>
        </View>

        <View style={[styles.tabContainer, isTablet && styles.tabContainerTablet]}>
          <TabButton
            label="Upcoming"
            isActive={activeTab === 'upcoming'}
            onPress={() => setActiveTab('upcoming')}
          />
          <TabButton
            label="Completed"
            isActive={activeTab === 'completed'}
            onPress={() => setActiveTab('completed')}
            style={styles.tabButtonMiddle}
          />
          <TabButton
            label="Cancelled"
            isActive={activeTab === 'cancelled'}
            onPress={() => setActiveTab('cancelled')}
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'upcoming' && 'Upcoming Bookings'}
            {activeTab === 'completed' && 'Completed Bookings'}
            {activeTab === 'cancelled' && 'Cancelled Bookings'}
          </Text>
        </View>

        <View style={[styles.bookingsList, isTablet && styles.bookingsListTablet]}>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((booking, index) => (
              <BookingCard
                key={booking.id}
                spaName={booking.spaName}
                location={booking.location}
                service={booking.service}
                people={booking.people}
                date={booking.date}
                time={booking.time}
                bookingId={booking.bookingId}
                status={booking.status}
                onPress={() => undefined}
                style={[
                  styles.bookingCardItem,
                  isTablet && styles.bookingCardItemTablet,
                  index > 0 && isTablet && { marginLeft: 12 },
                ]}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No {activeTab} bookings</Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 8,
    marginBottom: 28,
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
    backgroundColor: '#7B8B55',
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
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E1E1E',
  },
  bookingsList: {
    flexDirection: 'column',
  },
  bookingsListTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bookingCardItem: {
    marginBottom: 20,
  },
  bookingCardItemTablet: {
    width: '48%',
    marginBottom: 20,
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
    backgroundColor: '#7B8B55',
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
  },
  bookNowButton: {
    borderWidth: 1,
    borderColor: '#D4CFBD',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookNowButtonText: {
    color: '#8A8A8A',
    fontWeight: '700',
    fontSize: 13,
  },
  emptyState: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8A8A8A',
    fontWeight: '600',
  },
});

export default AllBookingScreen;
