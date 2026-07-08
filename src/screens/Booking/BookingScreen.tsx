import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import BookingOptionCard from './components/BookingOptionCard';
import BookingSchedule from './components/BookingSchedule';
import GuestSelector from './components/GuestSelector';
import HeroHeader from './components/HeroHeader';
import PaymentFooter from './components/PaymentFooter';
import TimeSlotGrid from './components/TimeSlotGrid';
import { bookingDates, bookingOption, bookingService, guestCounts, timeSlots } from './bookingData';
import { styles } from './styles';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import type { GuestCount } from './types';

type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookingScreen'>;

function BookingScreen(): React.ReactElement {
  const navigation = useNavigation<BookingScreenNavigationProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [selectedGuest, setSelectedGuest] = useState<GuestCount>('1');
  const [selectedDateId, setSelectedDateId] = useState(bookingDates[0]?.id ?? '');
  const [selectedSlotId, setSelectedSlotId] = useState('12-00');
  const [selectedOptionId, setSelectedOptionId] = useState(bookingOption.id);

  const selectedOption = useMemo(() => bookingOption, []);
  const isOptionSelected = selectedOptionId === selectedOption.id;

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }

    navigation.navigate('BottomNavigation');
  }, [navigation]);

  const handleProceed = useCallback(() => {
    if (__DEV__) {
      console.log('Booking selection', {
        guestCount: selectedGuest,
        dateId: selectedDateId,
        timeSlotId: selectedSlotId,
        bookingOptionId: selectedOptionId,
        tokenAmount: selectedOption.price,
      });
    }
  }, [selectedDateId, selectedGuest, selectedOption.price, selectedOptionId, selectedSlotId]);

  const handleSelectOption = useCallback(() => {
    setSelectedOptionId(selectedOption.id);
  }, [selectedOption.id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletContent]}
        >
          <HeroHeader service={bookingService} onBack={handleBack} />
          <GuestSelector
            guests={guestCounts}
            selectedGuest={selectedGuest}
            onSelectGuest={setSelectedGuest}
          />
          <BookingSchedule
            dates={bookingDates}
            selectedDateId={selectedDateId}
            onSelectDate={setSelectedDateId}
          />
          <TimeSlotGrid
            slots={timeSlots}
            selectedSlotId={selectedSlotId}
            onSelectSlot={setSelectedSlotId}
          />
          <BookingOptionCard
            option={selectedOption}
            selected={isOptionSelected}
            onPress={handleSelectOption}
          />
        </ScrollView>
        <PaymentFooter price={selectedOption.price} onProceed={handleProceed} />
      </View>
    </SafeAreaView>
  );
}

export default BookingScreen;
