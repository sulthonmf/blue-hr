import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Web In-Memory & Session Storage Encryption Helper using Web Crypto API (SubtleCrypto).
 * Protects tokens from being stored as plain text in browser local storage or inspection.
 */
class WebSecureStorage {
  private inMemoryStore: Map<string, string> = new Map();
  private cryptoKey: CryptoKey | null = null;

  private async getCryptoKey(): Promise<CryptoKey | null> {
    if (this.cryptoKey) return this.cryptoKey;
    if (typeof window === 'undefined' || !window.crypto || !window.crypto.subtle) {
      return null;
    }
    try {
      this.cryptoKey = await window.crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false, // non-extractable key for enhanced security
        ['encrypt', 'decrypt']
      );
      return this.cryptoKey;
    } catch {
      return null;
    }
  }

  async getItem(key: string): Promise<string | null> {
    // 1. Check in-memory store
    if (this.inMemoryStore.has(key)) {
      return this.inMemoryStore.get(key) || null;
    }

    // 2. Try encrypted sessionStorage fallback
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const encryptedData = window.sessionStorage.getItem(`__sec_${key}`);
        if (!encryptedData) return null;

        const keyObj = await this.getCryptoKey();
        if (!keyObj) return null;

        const combined = new Uint8Array(
          atob(encryptedData)
            .split('')
            .map((c) => c.charCodeAt(0))
        );
        const iv = combined.slice(0, 12);
        const data = combined.slice(12);

        const decrypted = await window.crypto.subtle.decrypt(
          { name: 'AES-GCM', iv },
          keyObj,
          data
        );
        const decoded = new TextDecoder().decode(decrypted);
        this.inMemoryStore.set(key, decoded);
        return decoded;
      }
    } catch (e) {
      console.warn('WebSecureStorage decryption failed:', e);
    }

    return null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.inMemoryStore.set(key, value);

    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const keyObj = await this.getCryptoKey();
        if (keyObj) {
          const iv = window.crypto.getRandomValues(new Uint8Array(12));
          const encoded = new TextEncoder().encode(value);
          const encrypted = await window.crypto.subtle.encrypt(
            { name: 'AES-GCM', iv },
            keyObj,
            encoded
          );

          const combined = new Uint8Array(iv.length + encrypted.byteLength);
          combined.set(iv, 0);
          combined.set(new Uint8Array(encrypted), iv.length);

          const b64 = btoa(String.fromCharCode(...combined));
          window.sessionStorage.setItem(`__sec_${key}`, b64);
        }
      }
    } catch (e) {
      console.warn('WebSecureStorage encryption failed:', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    this.inMemoryStore.delete(key);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(`__sec_${key}`);
      }
    } catch {
      // Ignore
    }
  }
}

const webSecureStorage = new WebSecureStorage();

/**
 * Unified Secure Storage Utility.
 * - iOS: Keychain Services API via expo-secure-store.
 * - Android: Android Keystore + EncryptedSharedPreferences via expo-secure-store.
 * - Web: In-Memory + Web Cryptography API (SubtleCrypto AES-GCM) sessionStorage fallback.
 */
export const secureStorage = {
  /**
   * Check if Native SecureStore is available on current runtime platform
   */
  isNativeAvailable: async (): Promise<boolean> => {
    if (Platform.OS === 'web') return false;
    try {
      return await SecureStore.isAvailableAsync();
    } catch {
      return false;
    }
  },

  /**
   * Retrieve a secure key value
   */
  getItem: async (key: string): Promise<string | null> => {
    // 1. Try Native SecureStore (iOS Keychain / Android Keystore)
    if (Platform.OS !== 'web') {
      try {
        const available = await SecureStore.isAvailableAsync();
        if (available) {
          const val = await SecureStore.getItemAsync(key);
          if (val !== null) return val;
        }
      } catch (e) {
        console.warn('Native SecureStore getItem failed, checking fallback:', e);
      }
    } else {
      // 2. Try Web Secure Storage
      const webVal = await webSecureStorage.getItem(key);
      if (webVal !== null) return webVal;
    }

    // 3. Fallback & Migration from legacy unencrypted AsyncStorage / localStorage
    return await secureStorage.migrateLegacyKey(key);
  },

  /**
   * Store a secure key value
   */
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS !== 'web') {
      try {
        const available = await SecureStore.isAvailableAsync();
        if (available) {
          await SecureStore.setItemAsync(key, value, {
            keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK
          });
          // Remove from legacy unencrypted store if exists
          await secureStorage.clearLegacyKey(key);
          return;
        }
      } catch (e) {
        console.warn('Native SecureStore setItem failed:', e);
      }
    }

    // Web or fallback
    await webSecureStorage.setItem(key, value);
    await secureStorage.clearLegacyKey(key);
  },

  /**
   * Remove a secure key value
   */
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS !== 'web') {
      try {
        const available = await SecureStore.isAvailableAsync();
        if (available) {
          await SecureStore.deleteItemAsync(key);
        }
      } catch (e) {
        console.warn('Native SecureStore deleteItem failed:', e);
      }
    }

    await webSecureStorage.removeItem(key);
    await secureStorage.clearLegacyKey(key);
  },

  /**
   * Auto-migrate key from legacy unencrypted AsyncStorage / localStorage if present
   */
  migrateLegacyKey: async (key: string): Promise<string | null> => {
    try {
      let legacyValue: string | null = null;

      // Check AsyncStorage
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        legacyValue = await AsyncStorage.getItem(key);
      }

      // Check window.localStorage
      if (!legacyValue && typeof window !== 'undefined' && window.localStorage) {
        legacyValue = window.localStorage.getItem(key);
      }

      if (legacyValue !== null) {
        // Save into Secure Storage
        await secureStorage.setItem(key, legacyValue);
        // Clear from legacy unencrypted storage
        await secureStorage.clearLegacyKey(key);
        return legacyValue;
      }
    } catch (e) {
      console.warn(`Migration for key "${key}" failed:`, e);
    }
    return null;
  },

  /**
   * Delete key from legacy unencrypted AsyncStorage & localStorage
   */
  clearLegacyKey: async (key: string): Promise<void> => {
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignore
    }
  }
};
