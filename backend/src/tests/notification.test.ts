import { describe, it, expect } from 'vitest';
import { isWithinGeofence } from '../domain/math';

describe('Backend Notification & Geofencing Business Logic', () => {
  it('should generate valid ON_TIME status when user is within 5km radius', () => {
    const officeLat = -6.2088;
    const officeLng = 106.8456;
    const userLat = -6.2100;
    const userLng = 106.8460;

    const result = isWithinGeofence(userLat, userLng, officeLat, officeLng, 5.0);
    expect(result.isAllowed).toBe(true);
    expect(result.distanceKm).toBeLessThan(5.0);
  });

  it('should generate OUT_OF_BOUNDS status when user is outside 5km radius', () => {
    const officeLat = -6.2088;
    const officeLng = 106.8456;
    const userLat = -6.3000;
    const userLng = 106.9000;

    const result = isWithinGeofence(userLat, userLng, officeLat, officeLng, 5.0);
    expect(result.isAllowed).toBe(false);
    expect(result.distanceKm).toBeGreaterThan(5.0);
  });
});
