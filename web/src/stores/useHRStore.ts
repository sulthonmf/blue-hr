import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const API_BASE = 'http://localhost:5000/api/v1';

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
    await axios.post(`${API_BASE}/offboarding/resignations`, payload, headers);
    await get().fetchData();
  },

  updateResignationStatus: async (id, status, notes) => {
    const headers = getAuthHeaders();
    await axios.patch(`${API_BASE}/offboarding/resignations/${id}/status`, { status, notes }, headers);
    await get().fetchData();
  },

  issueWarning: async (payload) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/offboarding/warnings`, payload, headers);
    await get().fetchData();
  },

  addTraining: async (payload) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/trainings`, payload, headers);
    await get().fetchData();
  },

  deleteTraining: async (id) => {
    const headers = getAuthHeaders();
    await axios.delete(`${API_BASE}/trainings/${id}`, headers);
    await get().fetchData();
  },

  fetchOrgTree: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/org-chart`, headers);
      set({ orgTree: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch org tree', e);
    }
  },

  fetchMeetingRooms: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/meeting-rooms`, headers);
      set({ meetingRooms: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch meeting rooms', e);
    }
  },

  fetchSchedules: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/schedules`, headers);
      set({ schedules: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch schedules', e);
    }
  },

  reserveRoom: async (payload) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/schedules`, payload, headers);
    await get().fetchData();
  },

  createMeetingRoom: async (roomData) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/meeting-rooms`, roomData, headers);
    await get().fetchData();
  },

  cancelSchedule: async (id) => {
    const headers = getAuthHeaders();
    await axios.delete(`${API_BASE}/schedules/${id}`, headers);
    await get().fetchData();
  },

  fetchBranches: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/branches`, headers);
      set({ branches: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch branches', e);
    }
  },

  createBranch: async (branchData) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/branches`, branchData, headers);
    await get().fetchBranches();
  },

  updateBranch: async (id, branchData) => {
    const headers = getAuthHeaders();
    await axios.put(`${API_BASE}/branches/${id}`, branchData, headers);
    await get().fetchBranches();
  },

  deleteBranch: async (id) => {
    const headers = getAuthHeaders();
    await axios.delete(`${API_BASE}/branches/${id}`, headers);
    await get().fetchBranches();
  },

  createShift: async (shiftData) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/shifts`, shiftData, headers);
    await get().fetchData();
  },

  updateShift: async (id, shiftData) => {
    const headers = getAuthHeaders();
    await axios.put(`${API_BASE}/shifts/${id}`, shiftData, headers);
    await get().fetchData();
  },

  deleteShift: async (id) => {
    const headers = getAuthHeaders();
    await axios.delete(`${API_BASE}/shifts/${id}`, headers);
    await get().fetchData();
  },

  requestOvertime: async (payload) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/overtime`, payload, headers);
    await get().fetchData();
  },

  approveOvertime: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/overtime/${id}/approve`, {}, headers);
    await get().fetchData();
  },

  rejectOvertime: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/overtime/${id}/reject`, {}, headers);
    await get().fetchData();
  },

  requestReimbursement: async (payload) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/reimbursements`, payload, headers);
    await get().fetchData();
  },

  approveReimbursement: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/reimbursements/${id}/approve`, {}, headers);
    await get().fetchData();
  },

  rejectReimbursement: async (id) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/reimbursements/${id}/reject`, {}, headers);
    await get().fetchData();
  },

  createJobPosting: async (jobData) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/recruitment/jobs`, jobData, headers);
    await get().fetchData();
  },

  applyJob: async (applicantData) => {
    await axios.post(`${API_BASE}/recruitment/applicants`, applicantData);
    await get().fetchData();
  },

  updateApplicantStatus: async (id, status) => {
    const headers = getAuthHeaders();
    await axios.patch(`${API_BASE}/recruitment/applicants/${id}/status`, { status }, headers);
    await get().fetchData();
  },

  fetchAuditLogs: async () => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/audit-logs`, headers);
      set({ auditLogs: res.data || [] });
    } catch (e) {
      console.error('Failed to fetch audit logs', e);
    }
  },

  fetchUserDocuments: async (userId) => {
    try {
      const headers = getAuthHeaders();
      const res = await axios.get(`${API_BASE}/documents/${userId}`, headers);
      return res.data || [];
    } catch (e) {
      console.error('Failed to fetch user documents', e);
      return [];
    }
  },

  uploadDocument: async (docData) => {
    const headers = getAuthHeaders();
    await axios.post(`${API_BASE}/documents`, docData, headers);
  },

  deleteDocument: async (id, userId) => {
    const headers = getAuthHeaders();
    await axios.delete(`${API_BASE}/documents/${id}`, headers);
  },

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
      const [empRes, branchRes, shiftRes, otRes, reimbRes, jobRes, appRes, auditRes, roomRes, schedRes, resRes, warnRes, trainRes, treeRes, rolesRes, logsRes, todayRes, leaveRes, kpiRes, assetRes, annRes, payRes, setRes, notifRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/employees`, headers),
        axios.get(`${API_BASE}/branches`, headers),
        axios.get(`${API_BASE}/shifts`, headers),
        axios.get(`${API_BASE}/overtime`, headers),
        axios.get(`${API_BASE}/reimbursements`, headers),
        axios.get(`${API_BASE}/recruitment/jobs`, headers),
        axios.get(`${API_BASE}/recruitment/applicants`, headers),
        axios.get(`${API_BASE}/audit-logs`, headers),
        axios.get(`${API_BASE}/meeting-rooms`, headers),
        axios.get(`${API_BASE}/schedules`, headers),
        axios.get(`${API_BASE}/offboarding/resignations`, headers),
        axios.get(`${API_BASE}/offboarding/warnings`, headers),
        axios.get(`${API_BASE}/trainings`, headers),
        axios.get(`${API_BASE}/org-chart`, headers),
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
        branches: branchRes.status === 'fulfilled' ? branchRes.value.data : [],
        shifts: shiftRes.status === 'fulfilled' ? shiftRes.value.data : [],
        overtimes: otRes.status === 'fulfilled' ? otRes.value.data : [],
        reimbursements: reimbRes.status === 'fulfilled' ? reimbRes.value.data : [],
        jobs: jobRes.status === 'fulfilled' ? jobRes.value.data : [],
        applicants: appRes.status === 'fulfilled' ? appRes.value.data : [],
        auditLogs: auditRes.status === 'fulfilled' ? auditRes.value.data : [],
        meetingRooms: roomRes.status === 'fulfilled' ? roomRes.value.data : [],
        schedules: schedRes.status === 'fulfilled' ? schedRes.value.data : [],
        resignations: resRes.status === 'fulfilled' ? resRes.value.data : [],
        warnings: warnRes.status === 'fulfilled' ? warnRes.value.data : [],
        trainings: trainRes.status === 'fulfilled' ? trainRes.value.data : [],
        orgTree: treeRes.status === 'fulfilled' ? treeRes.value.data : [],
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
