import { create } from 'zustand';
import { apiClient } from '../api/client';
import { AttendanceRecord, LeaveRequest, NotificationItem, Settings, AnnouncementItem, User } from '../types';

interface HRState {
  attendanceLogs: AttendanceRecord[];
  todayAttendance: AttendanceRecord | null;
  leaves: LeaveRequest[];
  announcements: AnnouncementItem[];
  teamMembers: User[];
  notifications: NotificationItem[];
  settings: Settings;
  isLoading: boolean;
  loadingMessage: string;
  errorMessage: string | null;

  // Simulator
  simulatedDistanceKm: number;
  setSimulatedDistance: (dist: number) => void;

  // Actions
  setLoading: (loading: boolean, msg?: string) => void;
  setError: (msg: string | null) => void;
  fetchData: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationsRead: () => Promise<void>;
  clockIn: (photoUrl?: string, notes?: string) => Promise<any>;
  clockOut: () => Promise<void>;
  requestLeave: (payload: { leave_type: string; start_date: string; end_date: string; duration_days: number; reason: string }) => Promise<void>;
  approveLeaveL1: (id: number) => Promise<void>;
  approveLeave: (id: number) => Promise<void>;
  rejectLeave: (id: number) => Promise<void>;
}

export const useHRStore = create<HRState>((set, get) => ({
  attendanceLogs: [],
  todayAttendance: null,
  leaves: [],
  announcements: [],
  teamMembers: [],
  notifications: [],
  settings: { office_lat: '-6.2088', office_lng: '106.8456', max_distance_km: '5.0', company_name: 'BlueHR Corp' },
  isLoading: false,
  loadingMessage: '',
  errorMessage: null,

  simulatedDistanceKm: 1.2,
  setSimulatedDistance: (dist) => set({ simulatedDistanceKm: dist }),

  setLoading: (isLoading, loadingMessage = '') => set({ isLoading, loadingMessage }),
  setError: (errorMessage) => set({ errorMessage }),

  fetchNotifications: async () => {
    try {
      const res = await apiClient.get('/notifications');
      set({ notifications: res.data || [] });
    } catch (err: any) {
      console.log('Mobile fetch notifications error:', err.message);
    }
  },

  markNotificationsRead: async () => {
    try {
      await apiClient.post('/notifications/mark-read');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: 1 }))
      }));
    } catch (err: any) {
      console.log('Mobile mark notifications read error:', err.message);
    }
  },

  fetchData: async () => {
    set({ isLoading: true, loadingMessage: 'Memuat Data HR...' });
    try {
      const [logsRes, todayRes, leaveRes, annRes, teamRes, notifRes, setRes] = await Promise.allSettled([
        apiClient.get('/attendance/logs'),
        apiClient.get('/attendance/today'),
        apiClient.get('/leaves'),
        apiClient.get('/announcements'),
        apiClient.get('/team'),
        apiClient.get('/notifications'),
        apiClient.get('/settings')
      ]);

      set({
        attendanceLogs: logsRes.status === 'fulfilled' ? logsRes.value.data : [],
        todayAttendance: todayRes.status === 'fulfilled' ? todayRes.value.data : null,
        leaves: leaveRes.status === 'fulfilled' ? leaveRes.value.data : [],
        announcements: annRes.status === 'fulfilled' ? annRes.value.data : [],
        teamMembers: teamRes.status === 'fulfilled' ? teamRes.value.data : [],
        notifications: notifRes.status === 'fulfilled' ? notifRes.value.data : [],
        settings: setRes.status === 'fulfilled' ? setRes.value.data : { office_lat: '-6.2088', office_lng: '106.8456', max_distance_km: '5.0', company_name: 'BlueHR Corp' }
      });
    } catch (err: any) {
      set({ errorMessage: err.response?.data?.error || err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  clockIn: async (photoUrl = '', notes = '') => {
    const { simulatedDistanceKm } = get();
    const latOffset = simulatedDistanceKm / 111.0;
    const userLat = -6.2088 - latOffset;
    const userLng = 106.8456 + (simulatedDistanceKm / 111.0) * 0.5;

    set({ isLoading: true, loadingMessage: 'Verifikasi GPS & Clock In...' });
    try {
      const res = await apiClient.post('/attendance/clock-in', {
        latitude: userLat,
        longitude: userLng,
        photo_url: photoUrl,
        notes
      });
      await get().fetchData();
      return res.data;
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      set({ errorMessage: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  clockOut: async () => {
    set({ isLoading: true, loadingMessage: 'Clock Out...' });
    try {
      await apiClient.post('/attendance/clock-out');
      await get().fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      set({ errorMessage: msg });
    } finally {
      set({ isLoading: false });
    }
  },

  requestLeave: async (payload) => {
    set({ isLoading: true, loadingMessage: 'Mengirim Pengajuan Cuti...' });
    try {
      await apiClient.post('/leaves', payload);
      await get().fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message;
      set({ errorMessage: msg });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  approveLeaveL1: async (id) => {
    set({ isLoading: true, loadingMessage: 'Menyetujui Cuti (Manager L1)...' });
    try {
      await apiClient.post(`/leaves/${id}/approve-l1`);
      await get().fetchData();
    } catch (err: any) {
      set({ errorMessage: err.response?.data?.error || err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  approveLeave: async (id) => {
    set({ isLoading: true, loadingMessage: 'Menyetujui Cuti (Final HR)...' });
    try {
      await apiClient.post(`/leaves/${id}/approve`);
      await get().fetchData();
    } catch (err: any) {
      set({ errorMessage: err.response?.data?.error || err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  rejectLeave: async (id) => {
    set({ isLoading: true, loadingMessage: 'Menolak Cuti...' });
    try {
      await apiClient.post(`/leaves/${id}/reject`);
      await get().fetchData();
    } catch (err: any) {
      set({ errorMessage: err.response?.data?.error || err.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
