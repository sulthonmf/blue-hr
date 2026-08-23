import { create } from 'zustand';
import { User } from '../types';
import { setAuthToken } from '../api/client';
import { storage } from '../utils/storage';

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
      const savedToken = await storage.getItem('bluehr_mobile_token');
      const savedRefreshToken = await storage.getItem('bluehr_mobile_refresh_token');
      const savedUserRaw = await storage.getItem('bluehr_mobile_user');
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
  setAuth: (token, user, refreshToken) => {
    setAuthToken(token);
    storage.setItem('bluehr_mobile_token', token);
    if (refreshToken) {
      storage.setItem('bluehr_mobile_refresh_token', refreshToken);
    }
    storage.setItem('bluehr_mobile_user', JSON.stringify(user));
    set((state) => ({ token, user, refreshToken: refreshToken || state.refreshToken }));
  },
  logout: () => {
    setAuthToken(null);
    storage.removeItem('bluehr_mobile_token');
    storage.removeItem('bluehr_mobile_refresh_token');
    storage.removeItem('bluehr_mobile_user');
    set({ token: null, refreshToken: null, user: null });
  },
}));

