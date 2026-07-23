/**
 * BookingCard
 *
 * Reusable booking card UI component that matches the Figma design for the
 * All Bookings screen. Supports Upcoming, Completed, and Cancelled tabs.
 *
 * Layout (per Figma):
 *  ┌──────────────────────────────────────────────┐
 *  │  [Date & Time]          [Badge/Toggle]       │
 *  ├──────────────────────────────────────────────┤
 *  │  [Image]  │  Spa Name                        │
 *  │           │  📍 Location                     │
 *  │           │  🌸 Service • Duration           │
 *  │           │  👤 1 Person                     │
 *  │           │  Booking ID: TK123456            │
 *  ├──────────────────────────────────────────────┤
 *  │  [Chat With Spa]       [Free Call Spa]       │ ← Upcoming
 *  │  [Book Again]          [View Receipt]        │ ← Completed
 *  │            [View Receipt]                    │ ← Cancelled
 *  └──────────────────────────────────────────────┘
 */

import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BackendBookingListItem } from '../../../types/booking';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { getBookingSection } from '../../../utils/getBookingSection';

// ─── Constants ───────────────────────────────────────────────────────────────

const FALLBACK_IMAGE = {
  uri: 'https://d2f15ematxpwp4.cloudfront.net/appImages/bookingPlaceholder.png',
};

const CARD_IMAGE_ASPECT = 100 / 130; // width / height ≈ Figma ratio

// Tooka brand colours
const C = {
  primary: '#FFAE2B',
  primaryDark: '#F59B00',
  white: '#FFFFFF',
  bg: '#FFF8F0',
  cardBg: '#FFFFFF',
  border: '#EFE9DD',
  heading: '#1E1E1E',
  body: '#4D4D4D',
  muted: '#8A8A8A',
  divider: '#EEE8DE',
  completed: '#2DB87A',
  completedBg: '#E6F9EF',
  cancelled: '#D94A45',
  cancelledBg: '#FBE9E8',
  outlinedBorder: '#FFB02E',
};

// ─── Types ────────────────────────────────────────────────────────────────────

export type BookingSection = 'upcoming' | 'completed' | 'cancelled';

export type BookingCardProps = {
  booking: BackendBookingListItem;
  style?: StyleProp<ViewStyle>;
};

// ─── Sub-component: StatusBadge ───────────────────────────────────────────────

type StatusBadgeProps = {
  section: BookingSection;
};

const StatusBadge = React.memo<StatusBadgeProps>(function StatusBadge({
  section,
}) {
  if (section === 'upcoming') {
    return null; // Upcoming uses a toggle — not a badge
  }

  const isCompleted = section === 'completed';

  return (
    <View
      style={[
        styles.badge,
        isCompleted ? styles.badgeCompleted : styles.badgeCancelled,
      ]}
      accessibilityRole="text"
      accessibilityLabel={isCompleted ? 'Booking completed' : 'Booking cancelled'}
    >
      <Text
        style={[
          styles.badgeText,
          isCompleted ? styles.badgeTextCompleted : styles.badgeTextCancelled,
        ]}
      >
        {isCompleted ? 'Completed' : 'Cancelled'}
      </Text>
    </View>
  );
});

// ─── Sub-component: ReminderToggle ────────────────────────────────────────────

const ReminderToggle = React.memo(function ReminderToggle() {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => setEnabled(v => !v), []);

  return (
    <View style={styles.reminderRow} accessibilityRole="none">
      <Text style={styles.reminderLabel}>Remind me</Text>
      <Switch
        value={enabled}
        onValueChange={toggle}
        trackColor={{ false: '#E0D8CC', true: C.primary }}
        thumbColor={C.white}
        ios_backgroundColor="#E0D8CC"
        accessibilityRole="switch"
        accessibilityLabel="Set booking reminder"
        accessibilityState={{ checked: enabled }}
        style={styles.reminderSwitch}
      />
    </View>
  );
});

// ─── Sub-component: BookingInfoRow ────────────────────────────────────────────

type BookingInfoRowProps = {
  iconName: string;
  label: string;
  numberOfLines?: number;
};

const BookingInfoRow = React.memo<BookingInfoRowProps>(function BookingInfoRow({
  iconName,
  label,
  numberOfLines = 1,
}) {
  return (
    <View style={styles.infoRow}>
      <Ionicons
        name={iconName}
        size={12}
        color={C.muted}
        style={styles.infoIcon}
      />
      <Text
        style={styles.infoText}
        numberOfLines={numberOfLines}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </View>
  );
});

// ─── Sub-component: BookingActions ────────────────────────────────────────────

type BookingActionsProps = {
  section: BookingSection;
  booking: BackendBookingListItem;
};

const BookingActions = React.memo<BookingActionsProps>(function BookingActions({
  section,
  booking,
}) {
  const handleChatWithSpa = useCallback(() => {
    // Navigation / business logic preserved externally
  }, []);
  // console.log("bookinddd: ", booking);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleFreeCallSpa = useCallback(() => {
    navigation.navigate('CallScreen', {
      bookingId: booking.id,
      spaId: (booking.raw.spa_id as string) || (booking.raw.spa as any)?.id || 'unknown_spa',
      callType: 'voice',
      spaName: booking.spaName || 'Unknown Spa',
      spaAvatar: booking.raw?.spa_snapshot?.cover_photo_url || FALLBACK_IMAGE.uri,
    });
  }, [navigation, booking]);

  const handleBookAgain = useCallback(() => {
    // Navigation / business logic preserved externally
  }, []);

  const handleViewReceipt = useCallback(() => {
    // Navigation / business logic preserved externally
  }, []);

  if (section === 'upcoming') {
    return (
      <View style={styles.actionsRow}>
        <Pressable
          onPress={handleChatWithSpa}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionBtnOutlined,
            styles.actionBtnHalf,
            pressed && styles.actionBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Chat with spa"
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextOutlined]}>
            Chat With Spa
          </Text>
        </Pressable>

        <Pressable
          onPress={handleFreeCallSpa}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionBtnPrimary,
            styles.actionBtnHalf,
            pressed && styles.actionBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Free call spa"
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>
            Free Call Spa
          </Text>
        </Pressable>
      </View>
    );
  }

  if (section === 'completed') {
    return (
      <View style={styles.actionsRow}>
        <Pressable
          onPress={handleBookAgain}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionBtnPrimary,
            styles.actionBtnHalf,
            pressed && styles.actionBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Book again"
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextPrimary]}>
            Book Again
          </Text>
        </Pressable>

        <Pressable
          onPress={handleViewReceipt}
          style={({ pressed }) => [
            styles.actionBtn,
            styles.actionBtnOutlined,
            styles.actionBtnHalf,
            pressed && styles.actionBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="View receipt"
        >
          <Text style={[styles.actionBtnText, styles.actionBtnTextOutlined]}>
            View Receipt
          </Text>
        </Pressable>
      </View>
    );
  }

  // Cancelled — full-width outlined button
  return (
    <View style={styles.actionsRow}>
      <Pressable
        onPress={handleViewReceipt}
        style={({ pressed }) => [
          styles.actionBtn,
          styles.actionBtnOutlined,
          styles.actionBtnFull,
          pressed && styles.actionBtnPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="View receipt"
      >
        <Text style={[styles.actionBtnText, styles.actionBtnTextOutlined]}>
          View Receipt
        </Text>
      </Pressable>
    </View>
  );
});

// ─── Main Component: BookingCard ──────────────────────────────────────────────

const BookingCard = React.memo<BookingCardProps>(function BookingCard({
  booking,
  style,
}) {
  const { width } = useWindowDimensions();

  // Derive section from booking status (uses existing util, no logic change)
  const section: BookingSection =
    (getBookingSection(booking.status) as BookingSection | null) ?? 'upcoming';

  // Guest label
  const guestLabel = booking.guestCount
    ? `${booking.guestCount} ${booking.guestCount === 1 ? 'Person' : 'People'}`
    : 'Guest details pending';

  // Booking code
  const bookingCode = booking.bookingReference ?? booking.bookingId ?? 'Pending';

  // Service with duration (serviceName may encode duration already)
  const serviceLabel = booking.serviceName ?? 'Service details pending';

  // Date + time formatted as "24 June 2026 | 03:00 PM"
  const dateTimeLabel =
    booking.date && booking.time
      ? `${booking.date} | ${booking.time}`
      : booking.date || '--';

  // Image: responsive based on screen width
  const imageSize = Math.min(Math.floor(width * 0.24), 100);

  return (
    <View
      style={[styles.card, style]}
      accessibilityRole="none"
    >
      {/* ── Top Row ── */}
      <View style={styles.topRow}>
        <View style={styles.topRowLeft}>
          <Ionicons
            name="calendar-outline"
            size={11}
            color={C.muted}
            style={styles.topRowCalIcon}
          />
          <Text style={styles.dateTimeText} numberOfLines={1}>
            {dateTimeLabel}
          </Text>
        </View>

        <View style={styles.topRowRight}>
          {section === 'upcoming' ? (
            <ReminderToggle />
          ) : (
            <StatusBadge section={section} />
          )}
        </View>
      </View>

      {/* ── Divider ── */}
      <View style={styles.topDivider} />

      {/* ── Content Row ── */}
      <View style={styles.contentRow}>
        {/* Left: Spa image */}
        <View
          style={[
            styles.imageWrapper,
            { width: imageSize, height: Math.floor(imageSize / CARD_IMAGE_ASPECT) },
          ]}
        >
          <Image
            source={booking.raw.spa_snapshot?.cover_photo_url ? { uri: booking.raw.spa_snapshot?.cover_photo_url } : FALLBACK_IMAGE}
            style={styles.spaImage}
            resizeMode="cover"
            accessibilityRole="image"
            accessibilityLabel={`${booking.spaName} spa image`}
          />
        </View>

        {/* Right: Details */}
        <View style={styles.detailsColumn}>
          <Text
            style={styles.spaName}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityRole="text"
          >
            {booking.spaName}
          </Text>

          <BookingInfoRow
            iconName="location-sharp"
            label={`${booking?.raw?.spa_snapshot?.locality_name}, ${booking?.raw?.spa_snapshot?.city_name}` || 'Location unavailable'}
          />

          <BookingInfoRow
            iconName="flower-outline"
            label={serviceLabel}
          />

          <BookingInfoRow
            iconName="person-outline"
            label={guestLabel}
          />

          {/* Booking ID */}
          <View style={styles.bookingIdBlock}>
            <Text style={styles.bookingIdLabel}>Booking ID: </Text>
            <Text
              style={styles.bookingIdValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {bookingCode}
            </Text>
          </View>
        </View>
      </View>

      {/* ── Bottom Actions Divider ── */}
      <View style={styles.actionDivider} />

      {/* ── Actions ── */}
      <BookingActions section={section} booking={booking} />
    </View>
  );
});

export default BookingCard;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Card ──
  card: {
    backgroundColor: C.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    overflow: 'hidden',
  },

  // ── Top Row ──
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    marginRight: 8,
  },
  topRowCalIcon: {
    marginRight: 4,
  },
  dateTimeText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    color: C.muted,
    flexShrink: 1,
  },
  topRowRight: {
    flexShrink: 0,
  },

  // ── Status Badge ──
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeCompleted: {
    backgroundColor: C.completedBg,
  },
  badgeCancelled: {
    backgroundColor: C.cancelledBg,
  },
  badgeText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextCompleted: {
    color: C.completed,
  },
  badgeTextCancelled: {
    color: C.cancelled,
  },

  // ── Reminder Toggle ──
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reminderLabel: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
    color: C.muted,
  },
  reminderSwitch: {
    transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
  },

  // ── Dividers ──
  topDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginHorizontal: 14,
  },
  actionDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginHorizontal: 14,
    marginTop: 12,
  },

  // ── Content Row ──
  contentRow: {
    flexDirection: 'row',
    padding: 14,
    gap: 14,
  },

  // ── Image ──
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    flexShrink: 0,
    backgroundColor: '#F0EAE0',
  },
  spaImage: {
    width: '100%',
    height: '100%',
  },

  // ── Details Column ──
  detailsColumn: {
    flex: 1,
    flexShrink: 1,
    gap: 8,
  },
  spaName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 15,
    fontWeight: '700',
    color: C.heading,
    marginBottom: 2,
  },

  // ── Info Row ──
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoIcon: {
    flexShrink: 0,
  },
  infoText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    color: C.body,
    flexShrink: 1,
  },

  // ── Booking ID ──
  bookingIdBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    marginTop: 2,
    flexShrink: 1,
  },
  bookingIdLabel: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
    color: C.muted,
    flexShrink: 0,
  },
  bookingIdValue: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
    fontWeight: '700',
    color: C.heading,
    flexShrink: 1,
  },

  // ── Actions ──
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  actionBtn: {
    borderRadius: 10,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  actionBtnHalf: {
    flex: 1,
  },
  actionBtnFull: {
    flex: 1,
  },
  actionBtnPrimary: {
    backgroundColor: C.primary,
  },
  actionBtnOutlined: {
    borderWidth: 1,
    borderColor: C.outlinedBorder,
    backgroundColor: 'transparent',
  },
  actionBtnPressed: {
    opacity: 0.75,
  },
  actionBtnText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  actionBtnTextPrimary: {
    color: C.white,
  },
  actionBtnTextOutlined: {
    color: C.primaryDark,
  },
});
