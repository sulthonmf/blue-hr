export interface User {
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
  leave_quota: number;
  avatar?: string;
  permissions: string[];
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  user_name?: string;
  check_in: string;
  check_out?: string;
  latitude: number;
  longitude: number;
  distance_km: number;
  status: 'ON_TIME' | 'LATE' | 'OUT_OF_BOUNDS';
  photo_url?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: number;
  user_id: number;
  user_name?: string;
  department?: string;
  division?: string;
  leave_type: 'ANNUAL' | 'SICK' | 'UNPAID' | 'MATERNITY';
  start_date: string;
  end_date: string;
  duration_days: number;
  reason: string;
  status: 'PENDING' | 'APPROVED_L1' | 'APPROVED' | 'REJECTED';
  approved_l1_by?: number;
  approved_by?: number;
  created_at?: string;
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

export interface NotificationItem {
  id: number;
  user_id: number;
  type: string;
  title: string;
  desc: string;
  read: number;
  created_at?: string;
}

export interface Settings {
  office_lat: string;
  office_lng: string;
  max_distance_km: string;
  company_name: string;
}
