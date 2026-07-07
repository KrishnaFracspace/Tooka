import AsyncStorage from '@react-native-async-storage/async-storage';
import {Booking} from '../types/booking';

const STORAGE_KEY = '@tooka_bookings';

export async function getBookings(): Promise<Booking[]> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);

    if (!value) {
      return [];
    }

    return JSON.parse(value);
  } catch (e) {
    console.log('getBookings', e);
    return [];
  }
}

export async function saveBooking(
  booking: Booking,
): Promise<void> {
  try {
    const existing = await getBookings();

    existing.unshift(booking);

    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(existing),
    );
  } catch (e) {
    console.log('saveBooking', e);
  }
}

export async function clearBookings() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}