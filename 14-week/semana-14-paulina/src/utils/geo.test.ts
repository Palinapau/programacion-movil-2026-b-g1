import { describe, expect, it } from 'vitest';
import { formatCoords, mapsLink } from './geo';

describe('geo utils', () => {
  it('formats Neiva coordinates with hemispheres', () => {
    expect(formatCoords({ latitude: 2.9273, longitude: -75.2819 })).toBe('2.9273° N, 75.2819° W');
  });

  it('builds a maps link', () => {
    expect(mapsLink({ latitude: 2.9, longitude: -75.2 })).toBe('https://www.google.com/maps?q=2.9,-75.2');
  });
});
