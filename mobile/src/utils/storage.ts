import AsyncStorage from '@react-native-async-storage/async-storage';
import { secureStorage } from './secureStorage';

export { secureStorage };

const SENSITIVE_KEYS = ['bluehr_mobile_token', 'bluehr_mobile_refresh_token', 'bluehr_mobile_user'];

export const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (SENSITIVE_KEYS.includes(key)) {
      return secureStorage.getItem(key);
    }
    try {
      if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        const val = await AsyncStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Ignore AsyncStorage error and attempt window.localStorage fallback
    }
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch {
      // Ignore
    }
    return null;
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (SENSITIVE_KEYS.includes(key)) {
      return secureStorage.setItem(key, value);
    }
    let saved = false;
    try {
      if (AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
        saved = true;
      }
    } catch (e) {
      console.warn('AsyncStorage setItem failed:', e);
    }

    if (!saved) {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch (e) {
        console.warn('Window localStorage setItem failed:', e);
      }
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (SENSITIVE_KEYS.includes(key)) {
      return secureStorage.removeItem(key);
    }
    try {
      if (AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (e) {
      console.warn('AsyncStorage removeItem failed:', e);
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


