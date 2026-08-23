import { describe, it, expect, vi } from 'vitest';

// Mock react-native and async-storage before importing stores
vi.mock('react-native', () => ({
  Platform: { OS: 'ios' }
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    setItem: vi.fn().mockResolvedValue(undefined),
    removeItem: vi.fn().mockResolvedValue(undefined),
  }
}));

import { useLanguageStore } from '../stores/useLanguageStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useHRStore } from '../stores/useHRStore';

describe('Mobile Clean Architecture Zustand Stores', () => {
  it('should manage Mobile language mode correctly (ID / EN)', () => {
    const { lang, t } = useLanguageStore.getState();
    expect(lang).toBe('ID');
    expect(t.welcome).toBe('Selamat Datang');
    expect(t.clockInNow).toBe('Clock In Sekarang');

    useLanguageStore.getState().toggleLanguage();
    const updated = useLanguageStore.getState();
    expect(updated.lang).toBe('EN');
    expect(updated.t.welcome).toBe('Welcome Back');
    expect(updated.t.clockInNow).toBe('Clock In Now');
  });

  it('should manage Mobile theme mode correctly (light / dark)', () => {
    expect(useThemeStore.getState().theme).toBe('dark');
    useThemeStore.getState().toggleTheme();
    expect(useThemeStore.getState().theme).toBe('light');
  });

  it('should manage Mobile Auth state correctly', () => {
    const dummyUser = {
      id: 1,
      name: 'Royhan Mobile',
      email: 'royhan@bluehr.com',
      role_name: 'Employee',
      position: 'Designer',
      department: 'Product',
      leave_quota: 12,
      permissions: ['clock_in_out']
    };

    useAuthStore.getState().setAuth('mock_mobile_token_123', dummyUser);
    expect(useAuthStore.getState().token).toBe('mock_mobile_token_123');
    expect(useAuthStore.getState().user?.name).toBe('Royhan Mobile');

    useAuthStore.getState().logout();
    expect(useAuthStore.getState().token).toBeNull();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('should manage Mobile Geofencing distance simulation correctly', () => {
    expect(useHRStore.getState().simulatedDistanceKm).toBe(1.2);

    useHRStore.getState().setSimulatedDistance(6.5);
    expect(useHRStore.getState().simulatedDistanceKm).toBe(6.5);
  });
});
