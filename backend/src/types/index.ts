export interface User {
  id: number;
  name: string;
  email: string;
  password_hash?: string;
  role_id: number;
  role_name?: string;
  permissions?: string[];
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
  status: string;
  created_at?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  is_system?: number;
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  user_name?: string;
  position?: string;
  department?: string;
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

export interface KPIRecord {
  id: number;
  user_id: number;
  user_name?: string;
  position?: string;
  period: string;
  title: string;
  target_score: number;
  actual_score: number;
  feedback?: string;
  evaluator_id: number;
  created_at?: string;
}

export interface DocumentRecord {
  id: number;
  user_id: number;
  doc_type: 'KTP' | 'NPWP' | 'CONTRACT' | 'CERTIFICATE';
  title: string;
  file_url: string;
  uploaded_at?: string;
}

export interface AssetRecord {
  id: number;
  asset_code: string;
  asset_name: string;
  category: string;
  serial_number?: string;
  status: 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE';
  assigned_to?: number;
  assigned_to_name?: string;
  assigned_date?: string;
  return_date?: string;
  notes?: string;
}

export interface AnnouncementRecord {
  id: number;
  title: string;
  content: string;
  category: 'IMPORTANT' | 'GENERAL' | 'EVENT';
  author_id: number;
  author_name?: string;
  is_pinned: number;
  created_at?: string;
}

export interface NotificationRecord {
  id: number;
  user_id: number;
  type: string;
  title: string;
  desc: string;
  read: number;
  created_at?: string;
}
