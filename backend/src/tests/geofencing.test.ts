import { describe, it, expect } from 'vitest';
import { calculateHaversineDistance, isWithinGeofence } from '../domain/math';

describe('Geofencing & Distance Calculations (TypeScript)', () => {
  const officeLat = -6.2088;
  const officeLng = 106.8456;

  it('should calculate 0 km distance for identical coordinates', () => {
    const dist = calculateHaversineDistance(officeLat, officeLng, officeLat, officeLng);
    expect(dist).toBe(0);
  });

  it('should allow check-in when user is within 5.0 km radius', () => {
    const userLat = -6.2150;
    const userLng = 106.8500;
    const result = isWithinGeofence(userLat, userLng, officeLat, officeLng, 5.0);

    expect(result.distanceKm).toBeLessThanOrEqual(5.0);
    expect(result.isAllowed).toBe(true);
  });

  it('should REJECT check-in when user is > 5.0 km radius', () => {
    const farUserLat = -6.4000;
    const farUserLng = 106.8000;
    const result = isWithinGeofence(farUserLat, farUserLng, officeLat, officeLng, 5.0);

    expect(result.distanceKm).toBeGreaterThan(5.0);
    expect(result.isAllowed).toBe(false);
  });
});
