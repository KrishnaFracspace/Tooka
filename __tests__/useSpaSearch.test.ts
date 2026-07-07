import { normalizeSearchQuery, shouldSearchRequest } from '../src/hooks/useSpaSearch';

describe('useSpaSearch helpers', () => {
  it('trims whitespace and collapses repeated spaces', () => {
    expect(normalizeSearchQuery('   hyd   ')).toBe('hyd');
    expect(normalizeSearchQuery('spa   house')).toBe('spa house');
  });

  it('returns empty values for blank input', () => {
    expect(normalizeSearchQuery('')).toBe('');
    expect(normalizeSearchQuery('   ')).toBe('');
  });

  it('requires at least two characters before requesting the API', () => {
    expect(shouldSearchRequest('')).toBe(false);
    expect(shouldSearchRequest('h')).toBe(false);
    expect(shouldSearchRequest('hy')).toBe(true);
  });
});
