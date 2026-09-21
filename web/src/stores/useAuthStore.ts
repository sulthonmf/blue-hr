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
  loginAsDemo: (role: 'admin' | 'employee' | 'manager') => void;
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

  loginAsDemo: (role: 'admin' | 'employee' | 'manager' = 'admin') => {
    const demoUsers: Record<string, AuthUser> = {
      admin: {
        id: 1,
        name: "Budi Santoso (Demo HR Admin)",
        email: "admin@bluehr.com",
        role_name: "Super Admin / HR Lead",
        position: "HR Operations Director",
        department: "Human Resource & Corporate",
        division: "Corporate Strategy",
        directorate: "Executive Office",
        phone: "+62 812-3456-7890",
        address: "Jl. Jend. Sudirman No. 45, Jakarta Pusat",
        leave_quota: 15,
        permissions: ["all"]
      },
      manager: {
        id: 2,
        name: "Dewi Lestari (Demo Manager)",
        email: "manager@bluehr.com",
        role_name: "Manager Departemen",
        position: "Engineering Manager",
        department: "Technology & Product",
        division: "Product Engineering",
        directorate: "Technology Directorate",
        phone: "+62 813-8899-0011",
        address: "Gedung Cyber 2, Kuningan, Jakarta",
        leave_quota: 14,
        permissions: ["employees.view", "leave.approve_l1", "overtime.approve", "attendance.view"]
      },
      employee: {
        id: 3,
        name: "Siti Rahma (Demo Karyawan)",
        email: "siti@bluehr.com",
        role_name: "Karyawan Tetap",
        position: "Senior UI/UX Designer",
        department: "Technology & Product",
        division: "Product Engineering",
        directorate: "Technology Directorate",
        phone: "+62 857-1122-3344",
        address: "Jl. Margonda Raya No. 12, Depok",
        leave_quota: 12,
        permissions: ["attendance.create", "leave.request", "payroll.view_own", "reimbursements.create"]
      }
    };

    const user = demoUsers[role] || demoUsers.admin;
    const mockToken = `demo_jwt_token_${role}_${Date.now()}`;
    get().setAuth(mockToken, user);
  },

  refreshAuth: async () => {
    if (get().token?.startsWith('demo_jwt_token_')) {
      return true;
    }
    try {
      const res = await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
      if (res.data.token && res.data.user) {
        get().setAuth(res.data.token, res.data.user);
        return true;
      }
      return false;
    } catch (err) {
      if (get().token?.startsWith('demo_jwt_token_')) return true;
      get().logout();
      return false;
    }
  },

  logout: async () => {
    try {
      if (!get().token?.startsWith('demo_jwt_token_')) {
        await axios.post(`${API_BASE}/auth/logout`, {}, { withCredentials: true });
      }
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

