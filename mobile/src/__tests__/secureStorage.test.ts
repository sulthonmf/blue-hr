(globalThis as any).__DEV__ = true;

import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockSecureStore, mockAsyncStorage } = vi.hoisted(() => ({
  mockSecureStore: {} as Record<string, string>,
  mockAsyncStorage: {} as Record<string, string>
}));

vi.mock('react-native', () => ({
  Platform: { OS: 'ios' }
}));

vi.mock('expo-secure-store', () => ({
  isAvailableAsync: vi.fn().mockResolvedValue(true),
  getItemAsync: vi.fn().mockImplementation(async (key: string) => mockSecureStore[key] || null),
  setItemAsync: vi.fn().mockImplementation(async (key: string, val: string) => { mockSecureStore[key] = val; }),
  deleteItemAsync: vi.fn().mockImplementation(async (key: string) => { delete mockSecureStore[key]; }),
  AFTER_FIRST_UNLOCK: 'AFTER_FIRST_UNLOCK'
}));

vi.mock('@react-native-async-storage/async-storage', () => ({
  default: {
    getItem: vi.fn().mockImplementation(async (key: string) => mockAsyncStorage[key] || null),
    setItem: vi.fn().mockImplementation(async (key: string, val: string) => { mockAsyncStorage[key] = val; }),
    removeItem: vi.fn().mockImplementation(async (key: string) => { delete mockAsyncStorage[key]; }),
  }
}));

import { secureStorage } from '../utils/secureStorage';

describe('SecureStorage Utility', () => {
  beforeEach(() => {
    Object.keys(mockSecureStore).forEach((k) => delete mockSecureStore[k]);
    Object.keys(mockAsyncStorage).forEach((k) => delete mockAsyncStorage[k]);
  });

  it('should store and retrieve data securely from native SecureStore', async () => {
    await secureStorage.setItem('bluehr_mobile_token', 'jwt_secret_token_abc');

    const result = await secureStorage.getItem('bluehr_mobile_token');
    expect(result).toBe('jwt_secret_token_abc');
    expect(mockSecureStore['bluehr_mobile_token']).toBe('jwt_secret_token_abc');
  });

  it('should auto-migrate legacy data from unencrypted AsyncStorage to SecureStore', async () => {
    // Simulate legacy token left in AsyncStorage
    mockAsyncStorage['bluehr_mobile_token'] = 'legacy_unencrypted_token';

    // Fetch via secureStorage
    const migratedToken = await secureStorage.getItem('bluehr_mobile_token');

    // Should fetch the legacy token and migrate it to SecureStore
    expect(migratedToken).toBe('legacy_unencrypted_token');
    expect(mockSecureStore['bluehr_mobile_token']).toBe('legacy_unencrypted_token');
    // Legacy storage should be cleared
    expect(mockAsyncStorage['bluehr_mobile_token']).toBeUndefined();
  });

  it('should remove data securely from SecureStore', async () => {
    await secureStorage.setItem('bluehr_mobile_token', 'test_token');
    await secureStorage.removeItem('bluehr_mobile_token');

    const result = await secureStorage.getItem('bluehr_mobile_token');
    expect(result).toBeNull();
    expect(mockSecureStore['bluehr_mobile_token']).toBeUndefined();
  });
});
