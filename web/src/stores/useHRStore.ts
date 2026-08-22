import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const API_BASE = 'http://localhost:5000/api/v1';

function getAuthHeaders() {
  const token = useAuthStore.getState().token;
  return { headers: { Authorization: `Bearer ${token}` } };
}

export interface Employee {
  id: number;
  name: string;
  email: string;
  role_id: number;
  role_name: string;
  position: string;
  department: string;
  division?: string;
  directorate?: string;
  phone: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relation?: string;
  avatar?: string;
  leave_quota: number;
  status: string;
}

export interface RoleItem {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  is_system?: number;
}

export interface AttendanceItem {
  id: number;
  user_id: number;
  user_name?: string;
  department?: string;
  position?: string;
  check_in: string;
  check_out?: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  status: string;
  notes?: string;
}

export interface LeaveItem {
  id: number;
  user_id: number;
  user_name?: string;
  department?: string;
  division?: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  reason: string;
  status: string;
}

export interface KPIItem {
  id: number;
  user_id: number;
  user_name?: string;
  position?: string;
  period: string;
  title: string;
  target_score: number;
  actual_score: number;
  feedback: string;
}

export interface AssetItem {
  id: number;
  asset_code: string;
  asset_name: string;
  category: string;
  serial_number: string;
  status: string;
  assigned_to_name?: string;
  return_date?: string;
  notes?: string;
}

export interface AnnouncementItem {
  id: number;
  title: string;
  content: string;
  category: string;
  author_name?: string;
  is_pinned: number;
  created_at: string;
}

export interface PayrollItem {
  id: number;
  user_id: number;
  user_name?: string;
  position?: string;
  department?: string;
  period: string;
  base_salary: number;
  allowance: number;
  overtime_pay: number;
  sick_deduction: number;
  absent_deduction: number;
  late_deduction: number;
  tax_bpjs_deduction: number;
  net_salary: number;
  status: string;
  created_at: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  type: string;
  title: string;
  desc: string;
  read: number;
  created_at?: string;
}

interface HRState {
  employees: Employee[];
  roles: RoleItem[];
  attendanceLogs: AttendanceItem[];
  todayAttendance: AttendanceItem | null;
  leaves: LeaveItem[];
  kpis: KPIItem[];
  assets: AssetItem[];
  announcements: AnnouncementItem[];
  payrolls: PayrollItem[];
  notifications: NotificationItem[];
  settings: Record<string, string>;
  isLoading: boolean;
  loadingMessage: string;
  
  // Geofencing Simulator state
  simulatedLat: number;
  simulatedLng: number;
  simulatedDistanceKm: number;
  setSimulatedLocation: (lat: number, lng: number, distKm: number) => void;
  setLoading: (loading: boolean, message?: string) => void;

  // Actions
  fetchData: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  clockIn: (photoUrl?: string, notes?: string) => Promise<any>;
  clockOut: () => Promise<void>;
  requestLeave: (payload: any) => Promise<void>;
  approveLeaveL1: (id: number) => Promise<void>;
  approveLeave: (id: number) => Promise<void>;
  rejectLeave: (id: number) => Promise<void>;
  topUpQuota: (userId: number, additionalDays: number) => Promise<void>;
  createRole: (role: any) => Promise<void>;
  registerEmployee: (emp: any) => Promise<void>;
  updateEmployee: (id: number, data: any) => Promise<void>;
  setEmployeeStatus: (id: number, status: 'ACTIVE' | 'INACTIVE' | 'RESIGNED') => Promise<void>;
  resetPassword: (userId: number, pass: string) => Promise<void>;
  createKPI: (kpi: any) => Promise<void>;
  createAsset: (asset: any) => Promise<void>;
  assignAsset: (assetId: number, userId: number, returnDate: string) => Promise<void>;
  createAnnouncement: (ann: any) => Promise<void>;
  createPayroll: (pay: any) => Promise<void>;
  updateSettings: (config: any) => Promise<void>;
}

export const useHRStore = create<HRState>((set, get) => ({
  employees: [],
  roles: [],
  attendanceLogs: [],
  todayAttendance: null,
  leaves: [],
  kpis: [],
  assets: [],
  announcements: [],
  payrolls: [],
  notifications: [],
  settings: { office_lat: '-6.2088', office_lng: '106.8456', max_distance_km: '5.0' },
  isLoading: false,
  loadingMessage: '',

  simulatedLat: -6.2088,
  simulatedLng: 106.8456,
  simulatedDistanceKm: 0.0,

  setSimulatedLocation: (lat, lng, distKm) => set({
    simulatedLat: lat,
    simulatedLng: lng,
    simulatedDistanceKm: distKm
  }),

  setLoading: (loading, message = '') => set({ isLoading: loading, loadingMessage: message }),

  fetchNotifications: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/notifications`, headers);
      set({ notifications: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  },

  markNotificationsRead: async () => {
    try {
      const headers = getAuthHeaders();
      await axios.post(`${API_BASE}/notifications/mark-read`, {}, headers);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: 1 }))
      }));
    } catch (e) {
      console.error('Failed to mark notifications read', e);
    }
  },

  fetchData: async () => {
    try {
      const headers = getAuthHeaders();
      const [empRes, rolesRes, logsRes, todayRes, leaveRes, kpiRes, assetRes, annRes, payRes, setRes, notifRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/employees`, headers),
        axios.get(`${API_BASE}/roles`, headers),
        axios.get(`${API_BASE}/attendance/logs`, headers),
        axios.get(`${API_BASE}/attendance/today`, headers),
        axios.get(`${API_BASE}/leaves`, headers),
        axios.get(`${API_BASE}/kpi`, headers),
        axios.get(`${API_BASE}/assets`, headers),
        axios.get(`${API_BASE}/announcements`, headers),
        axios.get(`${API_BASE}/payroll`, headers),
        axios.get(`${API_BASE}/settings`, headers),
        axios.get(`${API_BASE}/notifications`, headers)
      ]);

      set({
        employees: empRes.status === 'fulfilled' ? empRes.value.data : [],
        roles: rolesRes.status === 'fulfilled' ? rolesRes.value.data : [],
        attendanceLogs: logsRes.status === 'fulfilled' ? logsRes.value.data : [],
        todayAttendance: todayRes.status === 'fulfilled' ? todayRes.value.data : null,
        leaves: leaveRes.status === 'fulfilled' ? leaveRes.value.data : [],
        kpis: kpiRes.status === 'fulfilled' ? kpiRes.value.data : [],
        assets: assetRes.status === 'fulfilled' ? assetRes.value.data : [],
        announcements: annRes.status === 'fulfilled' ? annRes.value.data : [],
        payrolls: payRes.status === 'fulfilled' ? payRes.value.data : [],
        settings: setRes.status === 'fulfilled' ? setRes.value.data : { office_lat: '-6.2088', office_lng: '106.8456', max_distance_km: '5.0' },
        notifications: notifRes.status === 'fulfilled' ? notifRes.value.data : []
      });
    } catch (e) {
      console.error('Fetch data error:', e);
    }
  },

  clockIn: async (photoUrl, notes) => {
    const { simulatedLat, simulatedLng } = get();
    const headers = getAuthHeaders();
    const res = await axios.post(`${API_BASE}/attendance/clock-in`, {
      latitude: simulatedLat,
      longitude: simulatedLng,
      photo_url: photoUrl,
      notes
    }, headers);
    await get().fetchData();
    return res.data;
  },

  clockOut: async () => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/attendance/clock-out`, {}, headers);
    await get().fetchData();
  },

  requestLeave: async (payload) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/leaves`, payload, headers);
    await get().fetchData();
  },

  approveLeaveL1: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/leaves/${id}/approve-l1`, {}, headers);
    await get().fetchData();
  },

  approveLeave: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/leaves/${id}/approve`, {}, headers);
    await get().fetchData();
  },

  rejectLeave: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/leaves/${id}/reject`, {}, headers);
    await get().fetchData();
  },

  topUpQuota: async (userId, additionalDays) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/leaves/top-up-quota`, { userId, additionalDays }, headers);
    await get().fetchData();
  },

  createRole: async (role) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/roles`, role, headers);
    await get().fetchData();
  },

  registerEmployee: async (emp) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/auth/register`, emp, headers);
    await get().fetchData();
  },

  updateEmployee: async (id, data) => {
    const headers = getAuthHeaders();
    await axios.patch(`${API_BASE}/employees/${id}`, data, headers);
    await get().fetchData();
  },

  setEmployeeStatus: async (id, status) => {
    const headers = getAuthHeaders();
    await axios.patch(`${API_BASE}/employees/${id}/status`, { status }, headers);
    await get().fetchData();
  },

  resetPassword: async (userId, newPassword) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/auth/reset-password`, { userId, newPassword }, headers);
  },

  createKPI: async (kpi) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/kpi`, kpi, headers);
    await get().fetchData();
  },

  createAsset: async (asset) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/assets`, asset, headers);
    await get().fetchData();
  },

  assignAsset: async (assetId, userId, returnDate) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/assets/${assetId}/assign`, { user_id: userId, return_date: returnDate }, headers);
    await get().fetchData();
  },

  createAnnouncement: async (ann) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/announcements`, ann, headers);
    await get().fetchData();
  },

  createPayroll: async (pay) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/payroll`, pay, headers);
    await get().fetchData();
  },

  updateSettings: async (config) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/settings`, config, headers);
    await get().fetchData();
  }
}));
