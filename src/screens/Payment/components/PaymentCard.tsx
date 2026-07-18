import React, { useMemo } from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { BackendBookingListItem } from '../../../types/booking';
import {
  extractPaymentDate,
  formatCurrency,
  formatDateTime,
  getPaymentStatusUI,
} from '../utils/paymentFormatters';
import Icon from 'react-native-vector-icons/Ionicons';

// ─── Constants & Types ────────────────────────────────────────────────────────

const FALLBACK_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=400&q=60',
};

// Colors from Tooka brand matching Figma
const C = {
  white: '#FFFFFF',
  cardBorder: '#EFE9DD',
  divider: '#EFE9DD',
  heading: '#1E1E1E',
  muted: '#8A8A8A',
  primary: '#FFAE2B',
  primaryBg: '#FFF6E5', // For the slot pill
  pillText: '#F59B00',
  methodIcon: '#4A4A4A',
};

export interface PaymentCardProps {
  booking: BackendBookingListItem;
  style?: StyleProp<ViewStyle>;
}

// ─── Sub-component: PaymentStatusBadge ────────────────────────────────────────

const PaymentStatusBadge = React.memo<{ status: string | null | undefined }>(
  function PaymentStatusBadge({ status }) {
    const ui = useMemo(() => getPaymentStatusUI(status), [status]);

    return (
      <View
        style={[styles.badge, { backgroundColor: ui.backgroundColor }]}
        accessibilityRole="text"
        accessibilityLabel={`Payment status: ${ui.label}`}
      >
        <Text style={[styles.badgeText, { color: ui.textColor }]}>
          {ui.label}
        </Text>
      </View>
    );
  },
);

// ─── Main Component: PaymentCard ──────────────────────────────────────────────

const PaymentCard = React.memo<PaymentCardProps>(function PaymentCard({
  booking,
  style,
}) {
  const { width } = useWindowDimensions();
  // console.log("payment card booking data: ", booking);

  // Extract data
  // const bookingRef = booking.bookingReference || booking.bookingId || 'N/A';
  const bookingRef = booking?.raw?.payment?.cf_payment_id || 'N/A';
  const paymentDateIso = extractPaymentDate(booking.raw);
  const paymentDateTimeStr = formatDateTime(paymentDateIso) || '--';

  const spaName = booking.spaName || 'Unknown Spa';
  const location = `${booking.raw.spa_snapshot?.locality_name}, ${booking.raw.spa_snapshot?.city_name}` || booking.raw.spa_snapshot?.address;
  const spaImage = booking.spaImage ? { uri: booking.spaImage } : FALLBACK_IMAGE;

  const amountStr = formatCurrency(booking.raw.amount_paid);

  // Slot timing mapping
  const slotDate = booking.date;
  const slotTime = booking.time;
  const hasSlotTiming = Boolean(slotDate && slotTime);

  // Future-proofing payment method (as requested)
  // Assuming a future interface: { type: 'visa' | 'upi' | 'wallet' | 'netbanking', displayName: string }
  // Currently defaulting to missing (but extracted from raw to satisfy TS typing).
  const paymentMethod = booking.raw?.payment as { type?: string; displayName?: string } | undefined;
  const bookingMethod = booking?.raw?.payment?.payment_method?.upi?.upi_id

  return (
    <View style={[styles.card, style]} accessibilityRole="none">
      {/* ── Top Section ── */}
      <View style={styles.topSection}>
        <View style={styles.topLeft}>
          <Text style={styles.bookingRefText} numberOfLines={1}>
            Txn_Id: {bookingRef.replace(/^#/, '')}
          </Text>
          <Text style={styles.paymentDateText} numberOfLines={1}>
            {paymentDateTimeStr}
          </Text>
        </View>
        <View style={styles.topRight}>
          <PaymentStatusBadge status={booking.paymentStatus} />
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Middle Section ── */}
      <View style={styles.middleSection}>
        <View style={styles.middleLeft}>
          {/* <Image
            source={spaImage}
            style={styles.spaImage}
            resizeMode="cover"
            accessibilityLabel={`${spaName} image`}
          /> */}
          <View style={styles.spaIcon}>
            <Icon name={'flower'} size={20} color={'#FFB02E'}/>
          </View>
          <View style={styles.spaInfo}>
            <Text style={styles.spaNameText} numberOfLines={1}>
              {spaName}
            </Text>
            
            {location ? (
              <View style={{flexDirection:'row',alignItems:'center',marginTop:0}}>
                <Icon name='location-outline' size={13} color={'#8A8A8A'} style={{marginRight: 2}}/>
                <Text style={styles.locationText} numberOfLines={1}>
                  {location}
                </Text>
              </View>
            ) : null}
            
          </View>
        </View>
        <View style={styles.middleRight}>
          <Text style={styles.amountText} numberOfLines={1}>
            {amountStr}
          </Text>
        </View>
      </View>

      {/* ── Slot Timing Pill ── */}
      {hasSlotTiming && (
        <View style={styles.slotTimingContainer}>
          <View style={styles.slotPill}>
            <Ionicons
              name="time-outline"
              size={12}
              color={C.white}
              style={styles.slotIcon}
            />
            <Text style={styles.slotText} numberOfLines={1}>
              Slot Timing: {slotDate} | {slotTime}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.divider} />

      {/* ── Bottom Section ── */}
      <View style={styles.bottomSection}>
        {paymentMethod ? (
          <View style={styles.paymentMethodRow}>
            <Ionicons
              name={getIconForPaymentType()}
              size={18}
              color={C.methodIcon}
              style={styles.methodIcon}
            />
            <Text style={styles.methodText} numberOfLines={1}>
              {bookingMethod}
            </Text>
          </View>
        ) : (
          <View style={styles.paymentMethodRow}>
            <Ionicons
              name="card-outline"
              size={18}
              color={C.muted}
              style={styles.methodIcon}
            />
            <Text style={styles.methodTextMissing} numberOfLines={1}>
              Payment Method Unavailable
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default PaymentCard;

// ─── Helpers ───

function getIconForPaymentType(type?: string): string {
  switch (type?.toLowerCase()) {
    case 'visa':
    case 'mastercard':
    case 'card':
      return 'card-outline';
    case 'upi':
      return 'phone-portrait-outline';
    case 'wallet':
      return 'wallet-outline';
    case 'netbanking':
      return 'business-outline';
    default:
      return 'cash-outline';
  }
}

// ─── Styles ───

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.cardBorder,
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  
  // Top Section
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  topLeft: {
    flex: 1,
    marginRight: 12,
  },
  bookingRefText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    fontWeight: '700',
    color: C.primary,
    marginBottom: 4,
  },
  paymentDateText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    color: C.muted,
  },
  topRight: {
    flexShrink: 0,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
    fontWeight: '700',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginHorizontal: 16,
  },
  
  // Middle Section
  middleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  middleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  spaIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF7EE',
    marginRight: 12,
    alignItems:'center',justifyContent:'center'
  },
  spaImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  spaInfo: {
    flex: 1,
  },
  spaNameText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 14,
    fontWeight: '700',
    color: C.heading,
    marginBottom: 2,
  },
  locationText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 12,
    color: C.muted,
  },
  middleRight: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
  amountText: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    fontWeight: '800',
    color: C.heading,
  },
  
  // Slot Timing
  slotTimingContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  slotPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
  },
  slotIcon: {
    marginRight: 6,
  },
  slotText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 11,
    fontWeight: '600',
    color: C.white,
  },
  
  // Bottom Section
  bottomSection: {
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIcon: {
    marginRight: 8,
  },
  methodText: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 13,
    fontWeight: '600',
    color: C.heading,
  },
  methodTextMissing: {
    fontFamily: 'WorkSans-Medium',
    fontSize: 13,
    fontWeight: '500',
    color: C.muted,
  },
});
