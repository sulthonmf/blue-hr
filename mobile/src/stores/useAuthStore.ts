import { create } from 'zustand';
import { User } from '../types';
import { setAuthToken } from '../api/client';
import { secureStorage } from '../utils/secureStorage';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isInitializing: boolean;
  initAuth: () => Promise<void>;
  setAuth: (token: string, user: User, refreshToken?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  refreshToken: null,
  user: null,
  isInitializing: true,
  initAuth: async () => {
    try {
      const savedToken = await secureStorage.getItem('bluehr_mobile_token');
      const savedRefreshToken = await secureStorage.getItem('bluehr_mobile_refresh_token');
      const savedUserRaw = await secureStorage.getItem('bluehr_mobile_user');
      const savedUser = savedUserRaw ? JSON.parse(savedUserRaw) : null;

      if (savedToken) {
        setAuthToken(savedToken);
        set({
          token: savedToken,
          refreshToken: savedRefreshToken,
          user: savedUser,
          isInitializing: false
        });
      } else {
        set({ isInitializing: false });
      }
    } catch {
      set({ isInitializing: false });
    }
  },
  setAuth: async (token, user, refreshToken) => {
    setAuthToken(token);
    set((state) => ({ token, user, refreshToken: refreshToken || state.refreshToken }));
    await secureStorage.setItem('bluehr_mobile_token', token);
    if (refreshToken) {
      await secureStorage.setItem('bluehr_mobile_refresh_token', refreshToken);
    }
    await secureStorage.setItem('bluehr_mobile_user', JSON.stringify(user));
  },
  logout: async () => {
    setAuthToken(null);
    set({ token: null, refreshToken: null, user: null });
    await secureStorage.removeItem('bluehr_mobile_token');
    await secureStorage.removeItem('bluehr_mobile_refresh_token');
    await secureStorage.removeItem('bluehr_mobile_user');
  },
}));

