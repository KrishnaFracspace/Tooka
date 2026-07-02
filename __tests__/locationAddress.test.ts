import { getLocationDisplayParts } from '../src/services/locationAddress';

describe('getLocationDisplayParts', () => {
  it('prefers locality over sublocality and city for the primary line', () => {
    const result = getLocationDisplayParts({
      locality: 'Banjara Hills',
      subLocality: 'Road No 2',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    });

    expect(result.primary).toBe('Banjara Hills');
    expect(result.secondary).toBe('Hyderabad');
  });

  it('falls back to the correct labels when locality is missing', () => {
    const result = getLocationDisplayParts({
      subLocality: 'Madhapur',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
    });

    expect(result.primary).toBe('Madhapur');
    expect(result.secondary).toBe('Hyderabad');
  });

  it('returns unknown labels when no address data exists', () => {
    const result = getLocationDisplayParts(null);

    expect(result.primary).toBe('Unknown Location');
    expect(result.secondary).toBe('Unknown Location');
  });
});
