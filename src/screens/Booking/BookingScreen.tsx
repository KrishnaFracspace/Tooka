import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';

import BookingApi from '../../api/BookingApi';
import BookingOptionCard from './components/BookingOptionCard';
import BookingSchedule from './components/BookingSchedule';
import GuestSelector from './components/GuestSelector';
import HeroHeader from './components/HeroHeader';
import PaymentFooter from './components/PaymentFooter';
import TimeSlotGrid from './components/TimeSlotGrid';
import { bookingOption } from './bookingData';
import { styles } from './styles';
import { useAuth } from '../../context/AuthContext';
import { usePaymentContext } from '../../context/PaymentContext';
import { paymentLogger } from '../../payment/paymentLogger';
import { buildBookingDateAndTime } from '../../utils/bookingDateTime';
import { useProfile } from '../../context/ProfileContext';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { BookingScheduleDate, BookingSlot } from '../../types/booking';
import type { BookingDate, BookingService, TimeSlot } from './types';
import { Analytics, AnalyticsEvents, AnalyticsParams, AnalyticsScreens } from '../../services/firebase/analytics';

type BookingScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'BookingScreen'
>;
type BookingScreenRouteProp = RouteProp<RootStackParamList, 'BookingScreen'>;

const FALLBACK_IMAGE = {
  uri: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1200&q=80',
};
const DEFAULT_GUEST_MAX = 10;

const pad = (value: number): string => String(value).padStart(2, '0');

const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const addDays = (date: Date, days: number): Date => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const formatTabLabel = (date: Date, index: number): string => {
  if (index === 0) {
    return 'Today';
  }

  if (index === 1) {
    return 'Tomorrow';
  }

  return 'Day After';
};

const buildScheduleDates = (): BookingScheduleDate[] => {
  const today = new Date();

  return [0, 1, 2].map(offset => {
    const date = addDays(today, offset);
    const dateKey = toDateKey(date);

    return {
      id: dateKey,
      label: formatTabLabel(date, offset),
      date: dateKey,
    };
  });
};

const normalizeTime = (time: string): string => {
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
    return time;
  }

  if (/^\d{2}:\d{2}$/.test(time)) {
    return `${time}:00`;
  }

  return time;
};

const buildAppointmentAt = (slot: BookingSlot): string =>
  `${slot.date}T${normalizeTime(slot.startTime)}Z`;

const formatTimeLabel = (time: string): string => {
  const [hoursRaw, minutesRaw = '00'] = time.split(':');
  const hours = Number(hoursRaw);
  const minutes = Number(minutesRaw);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return time;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const twelveHour = hours % 12 || 12;
  return `${pad(twelveHour)}:${pad(minutes)} ${period}`;
};

const parsePrice = (value: number | string | null | undefined): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
};

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

  return 'Something went wrong. Please try again.';
};

function BookingScreen(): React.ReactElement {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const route = useRoute<BookingScreenRouteProp>();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { initiatePayment, setBookingSummary } = usePaymentContext();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const requestIdRef = useRef(0);
  const availabilityControllerRef = useRef<AbortController | null>(null);

  const scheduleDates = useMemo(() => buildScheduleDates(), []);
  const [selectedDateId, setSelectedDateId] = useState(
    scheduleDates[0]?.id ?? '',
  );
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityError, setAvailabilityError] = useState<string | null>(
    null,
  );
  const [guestCount, setGuestCount] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const selectedDate = useMemo(
    () =>
      scheduleDates.find(date => date.id === selectedDateId) ??
      scheduleDates[0],
    [scheduleDates, selectedDateId],
  );

  const spaId = route.params.spaId;
  const servicePrice = parsePrice(route.params.servicePrice);
  const tokenPrice = parsePrice(bookingOption.price);
  const footerPrice = tokenPrice || servicePrice;

  const service = useMemo<BookingService>(
    () => ({
      name: route.params.serviceName ?? route.params.spaName ?? 'Spa booking',
      durationMinutes: route.params.serviceDurationMinutes ?? 60,
      price: servicePrice,
      image: route.params.spaImage
        ? { uri: route.params.spaImage }
        : FALLBACK_IMAGE,
    }),
    [
      route.params.serviceDurationMinutes,
      route.params.serviceName,
      route.params.spaImage,
      route.params.spaName,
      servicePrice,
    ],
  );

  const bookingDates = useMemo<BookingDate[]>(
    () =>
      scheduleDates.map(date => ({
        id: date.id,
        label: date.label,
        date: date.date,
      })),
    [scheduleDates],
  );

  const timeSlots = useMemo<TimeSlot[]>(
    () =>
      slots.map(slot => ({
        id: slot.slotId,
        label: formatTimeLabel(slot.startTime),
        status: slot.status,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    [slots],
  );

  const selectedSlot = useMemo(
    () =>
      slots.find(
        slot => slot.slotId === selectedSlotId && slot.status === 'available',
      ),
    [selectedSlotId, slots],
  );

  const guestName =
    profile?.fullName ??
    profile?.displayName ??
    profile?.username ??
    user?.fullName ??
    user?.userName ??
    '';
  const guestPhone = profile?.phone ?? user?.phoneNumber ?? user?.phone ?? '';
  const canProceed =
    Boolean(spaId) &&
    Boolean(selectedDate?.date) &&
    Boolean(selectedSlot) &&
    guestCount >= 1 &&
    guestCount <= DEFAULT_GUEST_MAX &&
    Boolean(guestName) &&
    Boolean(guestPhone) &&
    !loadingSlots &&
    !submitting;

  useEffect(() => {
    Analytics.logScreen(AnalyticsScreens.Booking);

    Analytics.logEvent(AnalyticsEvents.BOOKING_STARTED, {
      [AnalyticsParams.SPA_ID]: spaId,
    });
  }, []);

  const loadAvailability = useCallback(
    async (date: string) => {
      if (!spaId || !date) {
        return;
      }

      availabilityControllerRef.current?.abort();
      const controller = new AbortController();
      availabilityControllerRef.current = controller;
      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      setLoadingSlots(true);
      setAvailabilityError(null);
      setSelectedSlotId('');

      try {
        const nextSlots = await BookingApi.getAvailability({
          spaId,
          date,
          signal: controller.signal,
        });

        if (requestIdRef.current === requestId) {
          setSlots(nextSlots);
        }
      } catch (error) {
        if (controller.signal.aborted || axios.isCancel(error)) {
          return;
        }

        if (requestIdRef.current === requestId) {
          setSlots([]);
          setAvailabilityError(getErrorMessage(error));
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setLoadingSlots(false);
          availabilityControllerRef.current = null;
        }
      }
    },
    [spaId],
  );

  useEffect(() => {
    loadAvailability(selectedDate?.date);

    return () => {
      availabilityControllerRef.current?.abort();
    };
  }, [loadAvailability, selectedDate?.date]);

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BottomNavigation');
  }, [navigation]);

  const handleSelectDate = useCallback((dateId: string) => {
    setSelectedDateId(dateId);
    setSelectedSlotId('');
  }, []);

  const handleSelectSlot = useCallback(
    (slotId: string) => {
      const slot = slots.find(item => item.slotId === slotId);
      if (slot?.status !== 'available') {
        return;
      }

      setSelectedSlotId(slotId);
    },
    [slots],
  );

  const handleProceed = useCallback(async () => {
    if (!selectedSlot || !canProceed) {
      return;
    }

    setSubmitting(true);
    let bookingId = '';
    let bookingReference: string | undefined;
    const appointmentAt = buildAppointmentAt(selectedSlot);
    const bookingSummary = {
      spaName: route.params.spaName,
      spaImage: route.params.spaImage,
      location: route.params.location,
      serviceName: route.params.serviceName,
      serviceDurationMinutes: route.params.serviceDurationMinutes,
      appointmentDate: selectedSlot.date,
      appointmentTime: formatTimeLabel(selectedSlot.startTime),
      bookingDateAndTime: buildBookingDateAndTime({
        appointmentDate: selectedSlot.date,
        appointmentTime: formatTimeLabel(selectedSlot.startTime),
      }),
    };

    try {
      const response = await BookingApi.createDirectBooking({
        spa_id: spaId,
        slot_id: selectedSlot.slotId,
        appointment_at: appointmentAt,
        guest_name: guestName,
        guest_phone: guestPhone,
        guest_count: guestCount,
      });

      bookingId = response.id;
      if (!bookingId) {
        throw new Error('Booking response did not include a booking ID.');
      }

      bookingReference = response.booking_ref ?? undefined;
    } catch (error) {
      Alert.alert('Booking failed', getErrorMessage(error));
      setSubmitting(false);
      return;
    }

    try {
      setBookingSummary(bookingSummary);
      const paymentContext = await initiatePayment(
        bookingId,
        bookingReference,
        bookingSummary,
      );
      // console.log('payment contex of initiate payment', paymentContext);
      paymentLogger.debug('Initiate Payment Ready', {
        paymentId: paymentContext.paymentId,
        cashfreeOrderId: paymentContext.cashfreeOrderId,
      });

      navigation.navigate('PaymentScreen', {
        paymentId: paymentContext.paymentId,
        bookingId: paymentContext.bookingId,
        bookingRef: paymentContext.bookingRef,
        paymentSessionId: paymentContext.paymentSessionId,
        cashfreeOrderId: paymentContext.cashfreeOrderId,
        amount: paymentContext.amount,
        currency: paymentContext.currency,
        spaName: paymentContext.spaName,
        spaImage: paymentContext.spaImage,
        location: paymentContext.location,
        serviceName: paymentContext.serviceName,
        serviceDurationMinutes: paymentContext.serviceDurationMinutes,
        appointmentDate: paymentContext.appointmentDate,
        appointmentTime: paymentContext.appointmentTime,
        bookingDateAndTime: paymentContext.bookingDateAndTime,
      });
    } catch (error) {
      Alert.alert('Payment initiation failed', getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }, [
    canProceed,
    guestCount,
    guestName,
    guestPhone,
    initiatePayment,
    navigation,
    route.params.location,
    route.params.serviceDurationMinutes,
    route.params.serviceName,
    route.params.spaImage,
    route.params.spaName,
    selectedSlot,
    setBookingSummary,
    spaId,
  ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && styles.tabletContent,
          ]}
        >
          <HeroHeader service={service} onBack={handleBack} />
          <GuestSelector
            value={guestCount}
            min={1}
            max={DEFAULT_GUEST_MAX}
            onChange={setGuestCount}
          />
          <BookingSchedule
            dates={bookingDates}
            selectedDateId={selectedDateId}
            onSelectDate={handleSelectDate}
          />
          <TimeSlotGrid
            slots={timeSlots}
            selectedSlotId={selectedSlotId}
            onSelectSlot={handleSelectSlot}
            loading={loadingSlots}
            error={availabilityError}
          />
          <BookingOptionCard
            option={bookingOption}
            selected
            onPress={() => undefined}
          />
        </ScrollView>
        <PaymentFooter
          price={footerPrice}
          onProceed={handleProceed}
          disabled={!canProceed}
          loading={submitting}
        />
      </View>
    </SafeAreaView>
  );
}

export default BookingScreen;
