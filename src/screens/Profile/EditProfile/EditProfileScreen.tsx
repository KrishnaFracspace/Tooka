import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
} from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  launchImageLibrary,
  type ImageLibraryOptions,
} from 'react-native-image-picker';
import {
  GooglePlacesAutocomplete,
  type GooglePlaceData,
  type GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import AddressCard from './components/AddressCard';
import DatePickerInput from './components/DatePickerInput';
import FloatingInput from './components/FloatingInput';
import GenderSelector from './components/GenderSelector';
import GradientButton from './components/GradientButton';
import Header from './components/Header';
import PhoneInput from './components/PhoneInput';
import ProfilePhotoCard from './components/ProfilePhotoCard';
import { DATE_FORMATTER, INITIAL_FORM } from './constants';
import { styles } from './styles';
import type { EditProfileForm, Gender } from './types';
import type { RootStackParamList } from '../../../navigation/AppNavigator';
import { useProfile } from '../../../context/ProfileContext';
import { GOOGLE_GEOCODING_API_KEY } from '../../../services/locationAddress';
import { prepareProfileImageUpload } from '../../../services/profileImageUpload';
import {
  buildUpdateProfilePayload,
  formFromProfile,
  residentialLocationToAddressLines,
} from '../../../utils/profileForm';
import { validateProfileUpdate, getProfileErrorMessage } from '../../../utils/profileValidation';
import { residentialLocationFromGooglePlace } from '../../../utils/googlePlaces';

type EditProfileNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EditProfile'>;

const imagePickerOptions: ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  selectionLimit: 1,
};

function EditProfileScreen(): React.ReactElement {
  const navigation = useNavigation<EditProfileNavigationProp>();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const [form, setForm] = useState<EditProfileForm>(INITIAL_FORM);
  // console.log('EditProfileScreen Render. Form:', form);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showPlacesSearch, setShowPlacesSearch] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [imagePicking, setImagePicking] = useState<boolean>(false);
  const { profile, currentLocation, saving, updateProfile, setResidentialLocation } = useProfile();
  // console.log('EditProfileScreen Render. Profile:', profile, 'CurrentLocation:', currentLocation, 'Saving:', saving);
  const profileHydrationKey = useMemo(
    () => [
      profile?.id,
      profile?.displayName,
      profile?.fullName,
      profile?.username,
      profile?.email,
      profile?.phone,
      profile?.gender,
      profile?.dateOfBirth,
      profile?.avatarUrl,
      profile?.residentialLocation?.formattedAddress,
      profile?.residentialLocation?.latitude,
      profile?.residentialLocation?.longitude,
    ].join('|'),
    [
      profile?.avatarUrl,
      profile?.dateOfBirth,
      profile?.displayName,
      profile?.email,
      profile?.fullName,
      profile?.gender,
      profile?.id,
      profile?.phone,
      profile?.residentialLocation?.formattedAddress,
      profile?.residentialLocation?.latitude,
      profile?.residentialLocation?.longitude,
      profile?.username,
    ],
  );

  useEffect(() => {
    setForm(formFromProfile(profile));
  }, [profileHydrationKey]);

  const minimumDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 100);
    return date;
  }, []);

  const maximumDate = useMemo(() => new Date(), []);

  const updateField = useCallback(
    <K extends keyof EditProfileForm>(key: K, value: EditProfileForm[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleChoosePhoto = useCallback(() => {
    if (imagePicking) {
      return;
    }

    setImagePicking(true);
    launchImageLibrary(imagePickerOptions, (response) => {
      setImagePicking(false);
      if (response.didCancel || response.errorCode) {
        if (response.errorCode) {
          Toast.show({
            type: 'error',
            text1: 'Photo selection failed',
            text2: response.errorMessage ?? 'Please try again.',
          });
        }
        return;
      }

      const [asset] = response.assets ?? [];
      const prepared = asset ? prepareProfileImageUpload(asset) : null;
      if (!prepared) {
        Toast.show({
          type: 'error',
          text1: 'Photo selection failed',
          text2: 'Selected image was invalid.',
        });
        return;
      }

      updateField('profilePhotoUri', prepared.uri);
    });
  }, [imagePicking, updateField]);

  const handleSelectGender = useCallback(
    (gender: Gender) => {
      updateField('gender', gender);
    },
    [updateField],
  );

  const handlePressDate = useCallback(() => {
    if (showDatePicker) {
      return;
    }

    setShowDatePicker(true);
  }, [showDatePicker]);

  const handleDateChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false);
      }

      if (event.type === 'dismissed' || !selectedDate) {
        return;
      }

      updateField('dateOfBirth', selectedDate);
    },
    [updateField],
  );

  const handleEditAddress = useCallback(() => {
    setShowPlacesSearch((value) => !value);
  }, []);

  const handleClosePlaces = useCallback(() => {
    setShowPlacesSearch(false);
  }, []);

  const handleSelectPlace = useCallback(
    (_data: GooglePlaceData, details: GooglePlaceDetail | null = null) => {
      const residentialLocation = residentialLocationFromGooglePlace(details);

      if (!residentialLocation) {
        Toast.show({
          type: 'error',
          text1: 'Invalid address',
          text2: 'Please choose an address from the suggestions.',
        });
        return;
      }

      const lines = residentialLocationToAddressLines(residentialLocation);
      setForm((prev) => ({
        ...prev,
        residentialLocation,
        addressLine1: lines.addressLine1,
        addressLine2: lines.addressLine2,
      }));
      setResidentialLocation(residentialLocation);
      setShowPlacesSearch(false);
    },
    [setResidentialLocation],
  );

  const handlePlacesFail = useCallback((error: unknown) => {
    Toast.show({
      type: 'error',
      text1: 'Address search failed',
      text2: 'Please try again.',
    });
  }, []);

  const handleSave = useCallback(async () => {
    if (saving || submitted) {
      return;
    }

    setSubmitted(true);
    const payload = buildUpdateProfilePayload(form, currentLocation);
    const validation = validateProfileUpdate(payload, form.residentialLocation);

    // console.log('handleSave: payload:', payload, 'validation:', validation);

    if (!validation.valid) {
      Toast.show({
        type: 'info',
        text1: 'Check profile details',
        text2: validation.message,
      });
      setSubmitted(false);
      return;
    }

    try {
      if (form.residentialLocation) {
        setResidentialLocation(form.residentialLocation);
      }

      await updateProfile(payload);
      if (form.residentialLocation) {
        setResidentialLocation(form.residentialLocation);
      }
      Toast.show({
        type: 'success',
        text1: 'Profile Updated Successfully',
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Profile update failed',
        text2: getProfileErrorMessage(error),
      });
    } finally {
      setSubmitted(false);
    }
  }, [
    currentLocation,
    form,
    navigation,
    saving,
    setResidentialLocation,
    submitted,
    updateProfile,
  ]);

  const dateDisplayValue = DATE_FORMATTER.format(form.dateOfBirth);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.screenRoot}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            contentContainerStyle={[styles.scrollContent, isTablet && styles.tabletContent]}
          >
            <Header />
            <View style={styles.contentCard}>
              <ProfilePhotoCard
                photoUri={form.profilePhotoUri}
                onChoosePhoto={handleChoosePhoto}
              />

            <View style={styles.row}>
              <View style={styles.rowItem}>
                <FloatingInput
                  label="FIRST NAME"
                  value={form.firstName}
                  onChangeText={(value) => updateField('firstName', value)}
                />
              </View>
              <View style={styles.rowItem}>
                <FloatingInput
                  label="LAST NAME"
                  value={form.lastName}
                  onChangeText={(value) => updateField('lastName', value)}
                />
              </View>
            </View>

            <View style={styles.blockSpacing}>
              <FloatingInput
                label="EMAIL ADDRESS"
                value={form.email}
                keyboardType="email-address"
                onChangeText={(value) => updateField('email', value)}
              />
            </View>

            <View style={styles.blockSpacing}>
              <PhoneInput
                countryCode={form.countryCode}
                phoneNumber={form.phoneNumber}
                onChangePhoneNumber={(value) =>
                  updateField('phoneNumber', value.replace(/\D/g, ''))
                }
              />
            </View>

            <View style={styles.blockSpacing}>
              <GenderSelector
                selectedGender={form.gender}
                onSelectGender={handleSelectGender}
              />
            </View>

            <View style={styles.blockSpacing}>
              <DatePickerInput
                value={form.dateOfBirth}
                displayValue={dateDisplayValue}
                onPress={handlePressDate}
              />
              {showDatePicker ? (
                <DateTimePicker
                  value={form.dateOfBirth}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  maximumDate={maximumDate}
                  minimumDate={minimumDate}
                  onChange={handleDateChange}
                />
              ) : null}
            </View>

            <View style={styles.blockSpacing}>
              <AddressCard
                addressLine1={form.addressLine1 || 'Add residential address'}
                addressLine2={form.addressLine2 || 'Not specified'}
                onEditAddress={handleEditAddress}
              />
            </View>

            <View style={styles.saveWrap}>
              <GradientButton
                title="Save Profile"
                onPress={handleSave}
                loading={saving || submitted}
                disabled={saving || submitted}
              />
            </View>
            </View>
          </ScrollView>

          {showPlacesSearch ? (
            <>
              <Pressable
                style={styles.placesOverlayBackdrop}
                onPress={handleClosePlaces}
                accessibilityRole="button"
                accessibilityLabel="Close address search"
              />
              <GooglePlacesAutocomplete
                placeholder="Search residential address"
                fetchDetails
                debounce={250}
                enablePoweredByContainer={false}
                keyboardShouldPersistTaps="handled"
                listViewDisplayed="auto"
                onPress={handleSelectPlace}
                onFail={handlePlacesFail}
                onNotFound={() => {
                  Toast.show({
                    type: 'info',
                    text1: 'No address found',
                    text2: 'Try a different search.',
                  });
                }}
                query={{
                  key: GOOGLE_GEOCODING_API_KEY,
                  language: 'en',
                }}
                styles={{
                  container: styles.placesContainer,
                  textInput: styles.placesTextInput,
                  listView: styles.placesListView,
                  row: styles.placesRow,
                  description: styles.placesDescription,
                }}
              />
            </>
          ) : null}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default EditProfileScreen;
