import type { EditProfileForm, GenderOption } from './types';

export const COLORS = {
  background: '#FFF8F1',
  primary: '#FFAE2B',
  primaryDark: '#F59C00',
  white: '#FFFFFF',
  heading: '#222222',
  body: '#777777',
  placeholder: '#B4B4B4',
  border: '#EFE6DA',
  disabled: '#F7F7F7',
};

export const FONTS = {
  heading: 'Sora-SemiBold',
  section: 'Sora-Medium',
  body: 'WorkSans-Medium',
  regular: 'WorkSans-Regular',
};

export const INITIAL_FORM: EditProfileForm = {
  firstName: '',
  lastName: '',
  displayName: '',
  email: '',
  countryCode: '+91',
  phoneNumber: '',
  gender: 'male',
  dateOfBirth: new Date(2000, 11, 18),
  addressLine1: '',
  addressLine2: '',
  profilePhotoUri: null,
  residentialLocation: null,
};

export const GENDER_OPTIONS: GenderOption[] = [
  { id: 'female', label: 'Female', iconName: 'person' },
  { id: 'male', label: 'Male', iconName: 'person' },
  { id: 'other', label: 'Other', iconName: 'person' },
];

export const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export const LOCAL_SELECTED_PHOTO_URI =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=';
