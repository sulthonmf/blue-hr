import { create } from 'zustand';
import { apiClient } from '../api/client';
import { useAuthStore } from './useAuthStore';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

function getAuthHeaders() {
  const token = useAuthStore.getState().token;
  return {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  };
}

export interface BranchItem {
  id: number;
  code: string;
  name: string;
  address: string;
  city: string;
  phone?: string;
  latitude: number;
  longitude: number;
  radius_km: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface DocumentItem {
  id: number;
  user_id: number;
  doc_type: 'KTP' | 'NPWP' | 'CONTRACT' | 'BPJS' | 'CERTIFICATE' | 'OTHER';
  title: string;
  file_url: string;
  uploaded_at?: string;
}

export interface ShiftItem {
  id: number;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
  branch_id?: number;
  branch_name?: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface OvertimeItem {
  id: number;
  user_id: number;
  user_name?: string;
  date: string;
  hours: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: number;
  rate_per_hour: number;
  total_pay: number;
  created_at?: string;
}

export interface ReimbursementItem {
  id: number;
  user_id: number;
  user_name?: string;
  title: string;
  category: 'MEDICAL' | 'TRAVEL' | 'MEAL' | 'EQUIPMENT' | 'OTHER';
  amount: number;
  receipt_url?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approved_by?: number;
  created_at?: string;
}

export interface JobPostingItem {
  id: number;
  title: string;
  department: string;
  branch_id?: number;
  description: string;
  requirements?: string;
  status: 'OPEN' | 'CLOSED';
  created_at?: string;
}

export interface JobApplicantItem {
  id: number;
  job_id: number;
  job_title?: string;
  name: string;
  email: string;
  phone: string;
  resume_url?: string;
  status: 'APPLIED' | 'SCREENING' | 'INTERVIEW' | 'OFFERED' | 'HIRED' | 'REJECTED';
  created_at?: string;
}

export interface AuditLogItem {
  id: number;
  user_id?: number;
  user_name?: string;
  action: string;
  entity: string;
  details?: string;
  ip_address?: string;
  created_at?: string;
}

export interface MeetingRoomItem {
  id: number;
  name: string;
  capacity: number;
  location: string;
  facilities?: string;
  branch_id?: number;
  status: 'AVAILABLE' | 'MAINTENANCE';
}

export interface MeetingScheduleItem {
  id: number;
  title: string;
  room_id?: number;
  room_name?: string;
  user_id: number;
  user_name?: string;
  date: string;
  start_time: string;
  end_time: string;
  meeting_link?: string;
  description?: string;
  status: 'CONFIRMED' | 'CANCELLED';
  created_at?: string;
}

export interface ResignationItem {
  id: number;
  user_id: number;
  user_name?: string;
  reason: string;
  notice_date: string;
  effective_date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  exit_clearance_notes?: string;
  created_at?: string;
}

export interface WarningLetterItem {
  id: number;
  user_id: number;
  user_name?: string;
  level: 'SP1' | 'SP2' | 'SP3';
  reason: string;
  issued_by?: string;
  issued_date: string;
  status: 'ACTIVE' | 'EXPIRED';
  created_at?: string;
}

export interface TrainingItem {
  id: number;
  user_id: number;
  user_name?: string;
  title: string;
  provider: string;
  category: 'TECHNICAL' | 'MANAGEMENT' | 'SAFETY' | 'COMPLIANCE';
  start_date: string;
  end_date: string;
  certification_url?: string;
  expiry_date?: string;
  status: 'REGISTERED' | 'COMPLETED' | 'EXPIRED';
  created_at?: string;
}

export interface OrgTreeNode {
  id: number;
  name: string;
  position: string;
  department: string;
  branch_name?: string;
  avatar?: string;
  manager_id?: number;
  subordinates?: OrgTreeNode[];
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
  branch_id?: number;
  branch_name?: string;
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
  branches: BranchItem[];
  shifts: ShiftItem[];
  overtimes: OvertimeItem[];
  reimbursements: ReimbursementItem[];
  jobs: JobPostingItem[];
  applicants: JobApplicantItem[];
  auditLogs: AuditLogItem[];
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
  fetchBranches: () => Promise<void>;
  createBranch: (branchData: Partial<BranchItem>) => Promise<void>;
  updateBranch: (id: number, branchData: Partial<BranchItem>) => Promise<void>;
  deleteBranch: (id: number) => Promise<void>;
  createShift: (shiftData: Partial<ShiftItem>) => Promise<void>;
  updateShift: (id: number, shiftData: Partial<ShiftItem>) => Promise<void>;
  deleteShift: (id: number) => Promise<void>;
  requestOvertime: (payload: { date: string; hours: number; reason: string }) => Promise<void>;
  approveOvertime: (id: number) => Promise<void>;
  rejectOvertime: (id: number) => Promise<void>;
  requestReimbursement: (payload: { title: string; category: string; amount: number; receipt_url?: string }) => Promise<void>;
  approveReimbursement: (id: number) => Promise<void>;
  rejectReimbursement: (id: number) => Promise<void>;
  createJobPosting: (jobData: Partial<JobPostingItem>) => Promise<void>;
  applyJob: (applicantData: Partial<JobApplicantItem>) => Promise<void>;
  updateApplicantStatus: (id: number, status: string) => Promise<void>;
  meetingRooms: MeetingRoomItem[];
  schedules: MeetingScheduleItem[];
  fetchMeetingRooms: () => Promise<void>;
  fetchSchedules: () => Promise<void>;
  reserveRoom: (payload: { title: string; room_id?: number; date: string; start_time: string; end_time: string; meeting_link?: string; description?: string }) => Promise<void>;
  createMeetingRoom: (roomData: { name: string; capacity: number; location: string; facilities?: string; branch_id?: number }) => Promise<void>;
  cancelSchedule: (id: number) => Promise<void>;
  resignations: ResignationItem[];
  warnings: WarningLetterItem[];
  trainings: TrainingItem[];
  orgTree: OrgTreeNode[];
  requestResignation: (payload: { reason: string; notice_date: string; effective_date: string; exit_clearance_notes?: string }) => Promise<void>;
  updateResignationStatus: (id: number, status: string, notes?: string) => Promise<void>;
  issueWarning: (payload: { user_id: number; level: string; reason: string; issued_date: string }) => Promise<void>;
  addTraining: (payload: { title: string; provider: string; category?: string; start_date: string; end_date: string; certification_url?: string; expiry_date?: string }) => Promise<void>;
  deleteTraining: (id: number) => Promise<void>;
  fetchOrgTree: () => Promise<void>;
  fetchAuditLogs: () => Promise<void>;
  fetchUserDocuments: (userId: number) => Promise<DocumentItem[]>;
  uploadDocument: (docData: { user_id: number; doc_type: string; title: string; file_url: string }) => Promise<void>;
  deleteDocument: (id: number, userId: number) => Promise<void>;
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
  branches: [],
  shifts: [],
  overtimes: [],
  reimbursements: [],
  jobs: [],
  applicants: [],
  auditLogs: [],
  meetingRooms: [],
  schedules: [],
  resignations: [],
  warnings: [],
  trainings: [],
  orgTree: [],
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

  requestResignation: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/offboarding/resignations`, payload, headers);
    await get().fetchData();
  },

  updateResignationStatus: async (id, status, notes) => {
    const headers = getAuthHeaders();
    await apiClient.patch(`${API_BASE}/offboarding/resignations/${id}/status`, { status, notes }, headers);
    await get().fetchData();
  },

  issueWarning: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/offboarding/warnings`, payload, headers);
    await get().fetchData();
  },

  addTraining: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/trainings`, payload, headers);
    await get().fetchData();
  },

  deleteTraining: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.delete(`${API_BASE}/trainings/${id}`, headers);
    await get().fetchData();
  },

  fetchOrgTree: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/org-chart`, headers);
      set({ orgTree: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch org tree', e);
    }
  },

  fetchMeetingRooms: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/meeting-rooms`, headers);
      set({ meetingRooms: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch meeting rooms', e);
    }
  },

  fetchSchedules: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/schedules`, headers);
      set({ schedules: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch schedules', e);
    }
  },

  reserveRoom: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/schedules`, payload, headers);
    await get().fetchData();
  },

  createMeetingRoom: async (roomData) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/meeting-rooms`, roomData, headers);
    await get().fetchData();
  },

  cancelSchedule: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.delete(`${API_BASE}/schedules/${id}`, headers);
    await get().fetchData();
  },

  fetchBranches: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/branches`, headers);
      set({ branches: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch branches', e);
    }
  },

  createBranch: async (branchData) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/branches`, branchData, headers);
    await get().fetchBranches();
  },

  updateBranch: async (id, branchData) => {
    const headers = getAuthHeaders();
    await apiClient.put(`${API_BASE}/branches/${id}`, branchData, headers);
    await get().fetchBranches();
  },

  deleteBranch: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.delete(`${API_BASE}/branches/${id}`, headers);
    await get().fetchBranches();
  },

  createShift: async (shiftData) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/shifts`, shiftData, headers);
    await get().fetchData();
  },

  updateShift: async (id, shiftData) => {
    const headers = getAuthHeaders();
    await apiClient.put(`${API_BASE}/shifts/${id}`, shiftData, headers);
    await get().fetchData();
  },

  deleteShift: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.delete(`${API_BASE}/shifts/${id}`, headers);
    await get().fetchData();
  },

  requestOvertime: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/overtime`, payload, headers);
    await get().fetchData();
  },

  approveOvertime: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/overtime/${id}/approve`, {}, headers);
    await get().fetchData();
  },

  rejectOvertime: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/overtime/${id}/reject`, {}, headers);
    await get().fetchData();
  },

  requestReimbursement: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/reimbursements`, payload, headers);
    await get().fetchData();
  },

  approveReimbursement: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/reimbursements/${id}/approve`, {}, headers);
    await get().fetchData();
  },

  rejectReimbursement: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/reimbursements/${id}/reject`, {}, headers);
    await get().fetchData();
  },

  createJobPosting: async (jobData) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/recruitment/jobs`, jobData, headers);
    await get().fetchData();
  },

  applyJob: async (applicantData) => {
    await apiClient.post(`${API_BASE}/recruitment/applicants`, applicantData);
    await get().fetchData();
  },

  updateApplicantStatus: async (id, status) => {
    const headers = getAuthHeaders();
    await apiClient.patch(`${API_BASE}/recruitment/applicants/${id}/status`, { status }, headers);
    await get().fetchData();
  },

  fetchAuditLogs: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/audit-logs`, headers);
      set({ auditLogs: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch audit logs', e);
    }
  },

  fetchUserDocuments: async (userId) => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/documents/${userId}`, headers);
      return res.data || [];
    } catch (e) {
      console.error('Failed to fetch user documents', e);
      return [];
    }
  },

  uploadDocument: async (docData) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/documents`, docData, headers);
  },

  deleteDocument: async (id, userId) => {
    const headers = getAuthHeaders();
    await apiClient.delete(`${API_BASE}/documents/${id}`, headers);
  },

  fetchNotifications: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await apiClient.get(`${API_BASE}/notifications`, headers);
      set({ notifications: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch notifications', e);
    }
  },

  markNotificationsRead: async () => {
    try {
      const headers = getAuthHeaders();
      await apiClient.post(`${API_BASE}/notifications/mark-read`, {}, headers);
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
      const [empRes, branchRes, shiftRes, otRes, reimbRes, jobRes, appRes, auditRes, roomRes, schedRes, resRes, warnRes, trainRes, treeRes, rolesRes, logsRes, todayRes, leaveRes, kpiRes, assetRes, annRes, payRes, setRes, notifRes] = await Promise.allSettled([
        apiClient.get(`${API_BASE}/employees`, headers),
        apiClient.get(`${API_BASE}/branches`, headers),
        apiClient.get(`${API_BASE}/shifts`, headers),
        apiClient.get(`${API_BASE}/overtime`, headers),
        apiClient.get(`${API_BASE}/reimbursements`, headers),
        apiClient.get(`${API_BASE}/recruitment/jobs`, headers),
        apiClient.get(`${API_BASE}/recruitment/applicants`, headers),
        apiClient.get(`${API_BASE}/audit-logs`, headers),
        apiClient.get(`${API_BASE}/meeting-rooms`, headers),
        apiClient.get(`${API_BASE}/schedules`, headers),
        apiClient.get(`${API_BASE}/offboarding/resignations`, headers),
        apiClient.get(`${API_BASE}/offboarding/warnings`, headers),
        apiClient.get(`${API_BASE}/trainings`, headers),
        apiClient.get(`${API_BASE}/org-chart`, headers),
        apiClient.get(`${API_BASE}/roles`, headers),
        apiClient.get(`${API_BASE}/attendance/logs`, headers),
        apiClient.get(`${API_BASE}/attendance/today`, headers),
        apiClient.get(`${API_BASE}/leaves`, headers),
        apiClient.get(`${API_BASE}/kpi`, headers),
        apiClient.get(`${API_BASE}/assets`, headers),
        apiClient.get(`${API_BASE}/announcements`, headers),
        apiClient.get(`${API_BASE}/payroll`, headers),
        apiClient.get(`${API_BASE}/settings`, headers),
        apiClient.get(`${API_BASE}/notifications`, headers)
      ]);

      const fetchedEmployees = empRes.status === 'fulfilled' && Array.isArray(empRes.value.data) && empRes.value.data.length > 0 ? empRes.value.data : [
        { id: 1, name: "Budi Santoso", email: "admin@bluehr.com", role_id: 1, role_name: "Super Admin", position: "HR Operations Director", department: "Human Resource", phone: "+62 812-3456-7890", leave_quota: 15, status: "ACTIVE", branch_name: "Sudirman HQ" },
        { id: 2, name: "Dewi Lestari", email: "dewi@bluehr.com", role_id: 2, role_name: "Manager", position: "Engineering Manager", department: "Technology & Product", phone: "+62 813-8899-0011", leave_quota: 14, status: "ACTIVE", branch_name: "Sudirman HQ" },
        { id: 3, name: "Siti Rahma", email: "siti@bluehr.com", role_id: 3, role_name: "Karyawan", position: "Senior UI/UX Designer", department: "Technology & Product", phone: "+62 857-1122-3344", leave_quota: 12, status: "ACTIVE", branch_name: "Sudirman HQ" },
        { id: 4, name: "Rizky Pratama", email: "rizky@bluehr.com", role_id: 3, role_name: "Karyawan", position: "Fullstack Developer", department: "Technology & Product", phone: "+62 819-2233-4455", leave_quota: 10, status: "ACTIVE", branch_name: "Bandung Hub" }
      ];

      const fetchedBranches = branchRes.status === 'fulfilled' && Array.isArray(branchRes.value.data) && branchRes.value.data.length > 0 ? branchRes.value.data : [
        { id: 1, code: "HQ-JKT", name: "Sudirman Tower HQ", address: "Jl. Jend Sudirman No. 45, Jakarta Pusat", city: "Jakarta", latitude: -6.2088, longitude: 106.8456, radius_km: 1.0, status: "ACTIVE" },
        { id: 2, code: "HUB-BDG", name: "Bandung Tech Hub", address: "Jl. Dago No. 102, Bandung", city: "Bandung", latitude: -6.9175, longitude: 107.6191, radius_km: 1.5, status: "ACTIVE" },
        { id: 3, code: "BRANCH-SUB", name: "Surabaya Commercial Office", address: "Jl. Pemuda No. 18, Surabaya", city: "Surabaya", latitude: -7.2575, longitude: 112.7521, radius_km: 2.0, status: "ACTIVE" }
      ];

      const fetchedLogs = logsRes.status === 'fulfilled' && Array.isArray(logsRes.value.data) && logsRes.value.data.length > 0 ? logsRes.value.data : [
        { id: 1, user_id: 1, user_name: "Budi Santoso", department: "Human Resource", position: "HR Director", check_in: "2026-09-21T07:55:00", check_out: "2026-09-21T17:05:00", latitude: -6.2088, longitude: 106.8456, distance_km: 0.12, status: "ON_TIME" },
        { id: 2, user_id: 2, user_name: "Dewi Lestari", department: "Technology", position: "Engineering Manager", check_in: "2026-09-21T08:02:00", check_out: "2026-09-21T17:15:00", latitude: -6.2089, longitude: 106.8457, distance_km: 0.15, status: "ON_TIME" },
        { id: 3, user_id: 3, user_name: "Siti Rahma", department: "Technology", position: "Senior Designer", check_in: "2026-09-21T08:14:00", latitude: -6.2087, longitude: 106.8455, distance_km: 0.10, status: "LATE" }
      ];

      const fetchedLeaves = leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value.data) && leaveRes.value.data.length > 0 ? leaveRes.value.data : [
        { id: 1, user_id: 3, user_name: "Siti Rahma", department: "Technology", leave_type: "Cuti Tahunan", start_date: "2026-10-01", end_date: "2026-10-03", duration_days: 3, reason: "Liburan Keluarga", status: "APPROVED" },
        { id: 2, user_id: 4, user_name: "Rizky Pratama", department: "Technology", leave_type: "Cuti Sakit", start_date: "2026-09-18", end_date: "2026-09-19", duration_days: 2, reason: "Demam Tinggi (Surat Dokter)", status: "APPROVED" }
      ];

      const fetchedAnnouncements = annRes.status === 'fulfilled' && Array.isArray(annRes.value.data) && annRes.value.data.length > 0 ? annRes.value.data : [
        { id: 1, title: "📢 Kebijakan Kerja Hybrid & Presensi Geofencing GPS V2", content: "Mulai Oktober 2026, seluruh karyawan wajib menggunakan verifikasi Biometrik FaceID dan Geofencing GPS saat melakukan Presensi Masuk/Pulang.", category: "General", author_name: "HR Operations", is_pinned: 1, created_at: "2026-09-20" },
        { id: 2, title: "🎉 Pencairan Bonus Kinerja Kuartal III & Slip Gaji Digital", content: "Slip gaji bulan September 2026 dan rincian BPJS & PPh21 dapat diunduh di menu Payroll.", category: "Finance", author_name: "Finance Lead", is_pinned: 0, created_at: "2026-09-19" }
      ];

      const fetchedPayrolls = payRes.status === 'fulfilled' && Array.isArray(payRes.value.data) && payRes.value.data.length > 0 ? payRes.value.data : [
        { id: 1, user_id: 1, user_name: "Budi Santoso", position: "HR Director", department: "Human Resource", period: "September 2026", base_salary: 25000000, allowance: 5000000, overtime_pay: 0, sick_deduction: 0, absent_deduction: 0, late_deduction: 0, tax_bpjs_deduction: 3500000, net_salary: 26500000, status: "PAID", created_at: "2026-09-20" },
        { id: 2, user_id: 2, user_name: "Dewi Lestari", position: "Engineering Manager", department: "Technology", period: "September 2026", base_salary: 22000000, allowance: 4000000, overtime_pay: 1500000, sick_deduction: 0, absent_deduction: 0, late_deduction: 0, tax_bpjs_deduction: 3100000, net_salary: 24400000, status: "PAID", created_at: "2026-09-20" },
        { id: 3, user_id: 3, user_name: "Siti Rahma", position: "Senior Designer", department: "Technology", period: "September 2026", base_salary: 15000000, allowance: 2500000, overtime_pay: 800000, sick_deduction: 0, absent_deduction: 0, late_deduction: 50000, tax_bpjs_deduction: 1800000, net_salary: 16450000, status: "PAID", created_at: "2026-09-20" }
      ];

      set({
        employees: fetchedEmployees,
        branches: fetchedBranches,
        shifts: shiftRes.status === 'fulfilled' && Array.isArray(shiftRes.value.data) ? shiftRes.value.data : [
          { id: 1, code: "SHIFT-REG", name: "Shift Reguler Pagi", start_time: "08:00", end_time: "17:00", branch_name: "Sudirman HQ", status: "ACTIVE" },
          { id: 2, code: "SHIFT-MID", name: "Shift Middle Siang", start_time: "13:00", end_time: "21:00", branch_name: "Sudirman HQ", status: "ACTIVE" }
        ],
        overtimes: otRes.status === 'fulfilled' && Array.isArray(otRes.value.data) ? otRes.value.data : [],
        reimbursements: reimbRes.status === 'fulfilled' && Array.isArray(reimbRes.value.data) ? reimbRes.value.data : [],
        jobs: jobRes.status === 'fulfilled' && Array.isArray(jobRes.value.data) ? jobRes.value.data : [],
        applicants: appRes.status === 'fulfilled' && Array.isArray(appRes.value.data) ? appRes.value.data : [],
        auditLogs: auditRes.status === 'fulfilled' && Array.isArray(auditRes.value.data) ? auditRes.value.data : [],
        meetingRooms: roomRes.status === 'fulfilled' && Array.isArray(roomRes.value.data) ? roomRes.value.data : [],
        schedules: schedRes.status === 'fulfilled' && Array.isArray(schedRes.value.data) ? schedRes.value.data : [],
        resignations: resRes.status === 'fulfilled' && Array.isArray(resRes.value.data) ? resRes.value.data : [],
        warnings: warnRes.status === 'fulfilled' && Array.isArray(warnRes.value.data) ? warnRes.value.data : [],
        trainings: trainRes.status === 'fulfilled' && Array.isArray(trainRes.value.data) ? trainRes.value.data : [],
        orgTree: treeRes.status === 'fulfilled' && Array.isArray(treeRes.value.data) ? treeRes.value.data : [],
        roles: rolesRes.status === 'fulfilled' && Array.isArray(rolesRes.value.data) ? rolesRes.value.data : [],
        attendanceLogs: fetchedLogs,
        todayAttendance: todayRes.status === 'fulfilled' ? todayRes.value.data : null,
        leaves: fetchedLeaves,
        kpis: kpiRes.status === 'fulfilled' && Array.isArray(kpiRes.value.data) ? kpiRes.value.data : [],
        assets: assetRes.status === 'fulfilled' && Array.isArray(assetRes.value.data) ? assetRes.value.data : [],
        announcements: fetchedAnnouncements,
        payrolls: fetchedPayrolls,
        settings: setRes.status === 'fulfilled' ? setRes.value.data : { office_lat: '-6.2088', office_lng: '106.8456', max_distance_km: '5.0' },
        notifications: notifRes.status === 'fulfilled' && Array.isArray(notifRes.value.data) ? notifRes.value.data : []
      });
    } catch (e) {
      console.error('Fetch data error:', e);
    }
  },

  clockIn: async (photoUrl, notes) => {
    const { simulatedLat, simulatedLng } = get();
    const headers = getAuthHeaders();
    const res = await apiClient.post(`${API_BASE}/attendance/clock-in`, {
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
    await apiClient.post(`${API_BASE}/attendance/clock-out`, {}, headers);
    await get().fetchData();
  },

  requestLeave: async (payload) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/leaves`, payload, headers);
    await get().fetchData();
  },

  approveLeaveL1: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/leaves/${id}/approve-l1`, {}, headers);
    await get().fetchData();
  },

  approveLeave: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/leaves/${id}/approve`, {}, headers);
    await get().fetchData();
  },

  rejectLeave: async (id) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/leaves/${id}/reject`, {}, headers);
    await get().fetchData();
  },

  topUpQuota: async (userId, additionalDays) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/leaves/top-up-quota`, { userId, additionalDays }, headers);
    await get().fetchData();
  },

  createRole: async (role) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/roles`, role, headers);
    await get().fetchData();
  },

  registerEmployee: async (emp) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/auth/register`, emp, headers);
    await get().fetchData();
  },

  updateEmployee: async (id, data) => {
    const headers = getAuthHeaders();
    await apiClient.patch(`${API_BASE}/employees/${id}`, data, headers);
    await get().fetchData();
  },

  setEmployeeStatus: async (id, status) => {
    const headers = getAuthHeaders();
    await apiClient.patch(`${API_BASE}/employees/${id}/status`, { status }, headers);
    await get().fetchData();
  },

  resetPassword: async (userId, newPassword) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/auth/reset-password`, { userId, newPassword }, headers);
  },

  createKPI: async (kpi) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/kpi`, kpi, headers);
    await get().fetchData();
  },

  createAsset: async (asset) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/assets`, asset, headers);
    await get().fetchData();
  },

  assignAsset: async (assetId, userId, returnDate) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/assets/${assetId}/assign`, { user_id: userId, return_date: returnDate }, headers);
    await get().fetchData();
  },

  createAnnouncement: async (ann) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/announcements`, ann, headers);
    await get().fetchData();
  },

  createPayroll: async (pay) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/payroll`, pay, headers);
    await get().fetchData();
  },

  updateSettings: async (config) => {
    const headers = getAuthHeaders();
    await apiClient.post(`${API_BASE}/settings`, config, headers);
    await get().fetchData();
  }
}));
