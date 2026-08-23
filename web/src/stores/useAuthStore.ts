import { create } from 'zustand';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role_name: string;
  position: string;
  department: string;
  division?: string;
  directorate?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  avatar?: string;
  leave_quota: number;
  permissions: string[];
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  hasPermission: (permissionCode: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('bluehr_token'),
  user: JSON.parse(localStorage.getItem('bluehr_user') || 'null'),

  setAuth: (token: string, user: AuthUser) => {
    localStorage.setItem('bluehr_token', token);
    localStorage.setItem('bluehr_user', JSON.stringify(user));
    set({ token, user });
  },

  refreshAuth: async () => {
    try {
      const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
      if (res.data.token && res.data.user) {
        get().setAuth(res.data.token, res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      get().logout();
      return false;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
    } catch (e) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('bluehr_token');
      localStorage.removeItem('bluehr_user');
      set({ token: null, user: null });
    }
  },

  hasPermission: (permissionCode: string) => {
    const { user } = get();
    if (!user || !user.permissions) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permissionCode);
  }
}));
