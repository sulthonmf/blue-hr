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
  branch_id?: number;
  branch_name?: string;
  avatar?: string;
  leave_quota: number;
  status: string;
  created_at?: string;
}

export interface Branch {
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
  doc_type: 'KTP' | 'NPWP' | 'CONTRACT' | 'BPJS' | 'CERTIFICATE' | 'OTHER';
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

export interface ShiftRecord {
  id: number;
  code: string;
  name: string;
  start_time: string;
  end_time: string;
  branch_id?: number;
  branch_name?: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
}

export interface OvertimeRequest {
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

export interface ReimbursementRecord {
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

export interface JobPosting {
  id: number;
  title: string;
  department: string;
  branch_id?: number;
  description: string;
  requirements?: string;
  status: 'OPEN' | 'CLOSED';
  created_at?: string;
}

export interface JobApplicant {
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

export interface AuditLogRecord {
  id: number;
  user_id?: number;
  user_name?: string;
  action: string;
  entity: string;
  details?: string;
  ip_address?: string;
  created_at?: string;
}

export interface MeetingRoomRecord {
  id: number;
  name: string;
  capacity: number;
  location: string;
  facilities?: string;
  branch_id?: number;
  status: 'AVAILABLE' | 'MAINTENANCE';
  created_at?: string;
}

export interface MeetingScheduleRecord {
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

export interface ResignationRecord {
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

export interface WarningLetterRecord {
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

export interface TrainingRecord {
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
