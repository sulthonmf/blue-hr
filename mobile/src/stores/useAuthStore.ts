import { create } from 'zustand';
import { User } from '../types';
import { setAuthToken } from '../api/client';

interface AuthState {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('bluehr_mobile_token');
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const raw = window.localStorage.getItem('bluehr_mobile_user');
    return raw ? JSON.parse(raw) : null;
  }
  return null;
};

const initialToken = getInitialToken();
const initialUser = getInitialUser();

if (initialToken) {
  setAuthToken(initialToken);
}

export const useAuthStore = create<AuthState>((set) => ({
  token: initialToken,
  user: initialUser,
  setAuth: (token, user) => {
    setAuthToken(token);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.getItem && window.localStorage.setItem('bluehr_mobile_token', token);
      window.localStorage.getItem && window.localStorage.setItem('bluehr_mobile_user', JSON.stringify(user));
    }
    set({ token, user });
  },
  logout: () => {
    setAuthToken(null);
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('bluehr_mobile_token');
      window.localStorage.removeItem('bluehr_mobile_user');
    }
    set({ token: null, user: null });
  },
}));
