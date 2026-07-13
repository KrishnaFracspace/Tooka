import React, { memo, useMemo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { formatPaymentAmount } from '../../../payment/PaymentMapper';
import type { BookingSummaryData } from '../../../payment/PaymentTypes';
import { buildBookingDateAndTime } from '../../../utils/bookingDateTime';

interface PaymentSummaryProps extends BookingSummaryData {
  amount: number;
  currency: string;
  bookingRef?: string;
}

const FALLBACK_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=70',
};

function PaymentSummaryComponent({
  amount,
  currency,
  bookingRef,
  spaName,
  spaImage,
  location,
  serviceName,
  serviceDurationMinutes,
  appointmentDate,
  appointmentTime,
  bookingDateAndTime,
}: PaymentSummaryProps): React.ReactElement {
  const serviceText = useMemo(() => {
    if (!serviceName) {
      return '--';
    }

    return serviceDurationMinutes
      ? `${serviceName} (${serviceDurationMinutes} mins)`
      : serviceName;
  }, [serviceDurationMinutes, serviceName]);

  const dateTime = buildBookingDateAndTime({
    bookingDateAndTime,
    appointmentDate,
    appointmentTime,
  });

  return (
    <View style={styles.container} accessibilityRole="summary">
      <View style={styles.amountCard}>
        <Text style={styles.amountLabel}>Amount Payable</Text>
        <Text
          style={styles.amountValue}
          accessibilityLabel={`Amount ${formatPaymentAmount(amount, currency)}`}
        >
          {formatPaymentAmount(amount, currency)}
        </Text>
        {bookingRef ? (
          <Text
            style={styles.bookingRef}
            accessibilityLabel={`Booking reference ${bookingRef}`}
          >
            Ref: {bookingRef}
          </Text>
        ) : null}
      </View>

      <View style={styles.detailsCard}>
        <View style={styles.spaRow}>
          <Image
            source={spaImage ? { uri: spaImage } : FALLBACK_IMAGE}
            style={styles.spaImage}
            resizeMode="cover"
            accessibilityLabel="Spa image"
          />
          <View style={styles.spaCopy}>
            <Text style={styles.spaName} numberOfLines={2}>
              {spaName ?? '--'}
            </Text>
            <Text style={styles.location} numberOfLines={1}>
              {location ?? '--'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>Service</Text>
        <Text style={styles.detailValue}>{serviceText}</Text>

        <View style={styles.divider} />

        <Text style={styles.cardLabel}>Date & Time</Text>
        <Text style={styles.detailValue}>{dateTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 16,
  },
  amountCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD08A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  amountLabel: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#9A9A9A',
    marginBottom: 8,
  },
  amountValue: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: '#242424',
  },
  bookingRef: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#9A9A9A',
    marginTop: 8,
  },
  detailsCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFD08A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  spaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  spaImage: {
    width: 92,
    height: 62,
    borderRadius: 10,
    backgroundColor: '#FFF0D6',
  },
  spaCopy: {
    flex: 1,
    marginLeft: 20,
  },
  spaName: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: '#242424',
    marginBottom: 10,
  },
  location: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 16,
    color: '#9A9A9A',
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#F3DDBB',
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: 'WorkSans-Regular',
    fontSize: 14,
    color: '#9A9A9A',
    marginBottom: 8,
  },
  detailValue: {
    fontFamily: 'Sora-SemiBold',
    fontSize: 18,
    color: '#242424',
    marginBottom: 18,
  },
});

export const PaymentSummary = memo(PaymentSummaryComponent);
export default PaymentSummary;
