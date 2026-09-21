import { db } from '../config/database';
import { User, Branch, Role, AttendanceRecord, LeaveRequest, KPIRecord, DocumentRecord, AssetRecord, AnnouncementRecord, ShiftRecord, OvertimeRequest, ReimbursementRecord, JobPosting, JobApplicant, AuditLogRecord, MeetingRoomRecord, MeetingScheduleRecord, ResignationRecord, WarningLetterRecord, TrainingRecord, OrgTreeNode } from '../types';

export const UserRepository = {
  findByEmail: (email: string): Promise<User | undefined> => new Promise((res, rej) => {
    db.get(`SELECT u.*, r.name as role_name, r.permissions FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?`, [email], (err, row) => {
      if (err) rej(err); else res(row as User);
    });
  }),
  findById: (id: number): Promise<User | undefined> => new Promise((res, rej) => {
    db.get(`SELECT u.id, u.name, u.email, u.role_id, r.name as role_name, r.permissions, u.position, u.department, u.division, u.directorate, u.phone, u.address, u.emergency_contact_name, u.emergency_contact_phone, u.emergency_contact_relation, u.branch_id, u.branch_name, u.avatar, u.leave_quota, u.status FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`, [id], (err, row) => {
      if (err) rej(err); else res(row as User);
    });
  }),
  findAll: (): Promise<User[]> => new Promise((res, rej) => {
    db.all(`SELECT u.id, u.name, u.email, u.role_id, r.name as role_name, u.position, u.department, u.division, u.directorate, u.phone, u.address, u.emergency_contact_name, u.emergency_contact_phone, u.emergency_contact_relation, u.branch_id, u.branch_name, u.avatar, u.leave_quota, u.status FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as User[]);
    });
  }),
  create: (user: Partial<User>): Promise<number> => new Promise((res, rej) => {
    const { name, email, password_hash, role_id, position, department, division, directorate, phone, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, avatar, leave_quota } = user;
    db.run(`INSERT INTO users (name, email, password_hash, role_id, position, department, division, directorate, phone, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, avatar, leave_quota) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, email, password_hash, role_id || 3, position || 'Employee', department || 'General', division || 'Divisi Teknologi & Informasi', directorate || 'Direktorat Utama', phone || '', address || '', emergency_contact_name || '', emergency_contact_phone || '', emergency_contact_relation || '', avatar || '', leave_quota || 12],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  updatePassword: (id: number, password_hash: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [password_hash, id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  updateLeaveQuota: (id: number, newQuota: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE users SET leave_quota = ? WHERE id = ?`, [newQuota, id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  updateStatus: (id: number, status: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE users SET status = ? WHERE id = ?`, [status, id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  updateAvatar: (id: number, avatar: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE users SET avatar = ? WHERE id = ?`, [avatar, id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  update: (id: number, data: Partial<User>): Promise<boolean> => new Promise((res, rej) => {
    const { name, position, department, division, directorate, phone, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, role_id, leave_quota, avatar } = data;
    db.run(
      `UPDATE users SET name = COALESCE(?, name), position = COALESCE(?, position), department = COALESCE(?, department), division = COALESCE(?, division), directorate = COALESCE(?, directorate), phone = COALESCE(?, phone), address = COALESCE(?, address), emergency_contact_name = COALESCE(?, emergency_contact_name), emergency_contact_phone = COALESCE(?, emergency_contact_phone), emergency_contact_relation = COALESCE(?, emergency_contact_relation), role_id = COALESCE(?, role_id), leave_quota = COALESCE(?, leave_quota), avatar = COALESCE(?, avatar) WHERE id = ?`,
      [name || null, position || null, department || null, division || null, directorate || null, phone || null, address || null, emergency_contact_name || null, emergency_contact_phone || null, emergency_contact_relation || null, role_id || null, leave_quota ?? null, avatar || null, id],
      (err) => { if (err) rej(err); else res(true); }
    );
  })
};

export const RoleRepository = {
  findAll: (): Promise<Role[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM roles ORDER BY id ASC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as Role[]);
    });
  }),
  create: (role: { name: string; description: string; permissions: string[] }): Promise<number> => new Promise((res, rej) => {
    const { name, description, permissions } = role;
    db.run(`INSERT INTO roles (name, description, permissions) VALUES (?, ?, ?)`,
      [name, description, JSON.stringify(permissions)],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const AttendanceRepository = {
  create: (data: Partial<AttendanceRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, latitude, longitude, distance_km, status, photo_url, notes } = data;
    db.run(`INSERT INTO attendance (user_id, latitude, longitude, distance_km, status, photo_url, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, latitude, longitude, distance_km, status, photo_url || '', notes || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  updateCheckOut: (id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE attendance SET check_out = CURRENT_TIMESTAMP WHERE id = ?`, [id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  findByUserIdToday: (user_id: number): Promise<AttendanceRecord | undefined> => new Promise((res, rej) => {
    db.get(`SELECT * FROM attendance WHERE user_id = ? AND date(check_in) = date('now') ORDER BY id DESC LIMIT 1`, [user_id], (err, row) => {
      if (err) rej(err); else res(row as AttendanceRecord);
    });
  }),
  findAllLogs: (): Promise<AttendanceRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT a.*, u.name as user_name, u.position, u.department FROM attendance a JOIN users u ON a.user_id = u.id ORDER BY a.check_in DESC LIMIT 100`, [], (err, rows) => {
      if (err) rej(err); else res(rows as AttendanceRecord[]);
    });
  }),
  findAll: (): Promise<AttendanceRecord[]> => AttendanceRepository.findAllLogs()
};

export const LeaveRepository = {
  create: (data: Partial<LeaveRequest>): Promise<number> => new Promise((res, rej) => {
    const { user_id, leave_type, start_date, end_date, duration_days, reason } = data;
    db.run(`INSERT INTO leave_requests (user_id, leave_type, start_date, end_date, duration_days, reason) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, leave_type, start_date, end_date, duration_days, reason],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  findAll: (): Promise<LeaveRequest[]> => new Promise((res, rej) => {
    db.all(`SELECT l.*, u.name as user_name, u.department FROM leave_requests l JOIN users u ON l.user_id = u.id ORDER BY l.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as LeaveRequest[]);
    });
  }),
  findByUserId: (user_id: number): Promise<LeaveRequest[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM leave_requests WHERE user_id = ? ORDER BY id DESC`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows as LeaveRequest[]);
    });
  }),
  updateStatusL1: (id: number, approved_l1_by: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE leave_requests SET status = 'APPROVED_L1', approved_l1_by = ? WHERE id = ?`, [approved_l1_by, id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  updateStatus: (id: number, status: string, approved_by: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE leave_requests SET status = ?, approved_by = ? WHERE id = ?`, [status, approved_by, id], (err) => {
      if (err) rej(err); else res(true);
    });
  }),
  findById: (id: number): Promise<LeaveRequest | undefined> => new Promise((res, rej) => {
    db.get(`SELECT * FROM leave_requests WHERE id = ?`, [id], (err, row) => {
      if (err) rej(err); else res(row as LeaveRequest);
    });
  })
};

export const KPIRepository = {
  findAll: (): Promise<KPIRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT k.*, u.name as user_name, u.position FROM kpis k JOIN users u ON k.user_id = u.id ORDER BY k.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as KPIRecord[]);
    });
  }),
  findByUserId: (user_id: number): Promise<KPIRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM kpis WHERE user_id = ? ORDER BY id DESC`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows as KPIRecord[]);
    });
  }),
  create: (data: Partial<KPIRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, period, title, target_score, actual_score, feedback, evaluator_id } = data;
    db.run(`INSERT INTO kpis (user_id, period, title, target_score, actual_score, feedback, evaluator_id) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, period, title, target_score || 100, actual_score || 0, feedback || '', evaluator_id],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const BranchRepository = {
  findAll: (): Promise<Branch[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM branches ORDER BY id ASC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as Branch[]);
    });
  }),
  findById: (id: number): Promise<Branch | undefined> => new Promise((res, rej) => {
    db.get(`SELECT * FROM branches WHERE id = ?`, [id], (err, row) => {
      if (err) rej(err); else res(row as Branch);
    });
  }),
  create: (data: Partial<Branch>): Promise<number> => new Promise((res, rej) => {
    const { code, name, address, city, phone, latitude, longitude, radius_km, status } = data;
    db.run(
      `INSERT INTO branches (code, name, address, city, phone, latitude, longitude, radius_km, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [code, name, address, city, phone || '', latitude || -6.2088, longitude || 106.8456, radius_km || 5.0, status || 'ACTIVE'],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  update: (id: number, data: Partial<Branch>): Promise<boolean> => new Promise((res, rej) => {
    const { code, name, address, city, phone, latitude, longitude, radius_km, status } = data;
    db.run(
      `UPDATE branches SET code=?, name=?, address=?, city=?, phone=?, latitude=?, longitude=?, radius_km=?, status=? WHERE id=?`,
      [code, name, address, city, phone, latitude, longitude, radius_km, status, id],
      (err) => { if (err) rej(err); else res(true); }
    );
  }),
  delete: (id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`DELETE FROM branches WHERE id=?`, [id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const DocumentRepository = {
  findByUserId: (user_id: number): Promise<DocumentRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM documents WHERE user_id = ? ORDER BY uploaded_at DESC`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows as DocumentRecord[]);
    });
  }),
  create: (data: Partial<DocumentRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, doc_type, title, file_url } = data;
    db.run(`INSERT INTO documents (user_id, doc_type, title, file_url) VALUES (?, ?, ?, ?)`,
      [user_id, doc_type, title, file_url],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  delete: (id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`DELETE FROM documents WHERE id = ?`, [id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const AssetRepository = {
  findAll: (): Promise<AssetRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT a.*, u.name as assigned_to_name FROM assets a LEFT JOIN users u ON a.assigned_to = u.id ORDER BY a.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as AssetRecord[]);
    });
  }),
  create: (data: Partial<AssetRecord>): Promise<number> => new Promise((res, rej) => {
    const { asset_code, asset_name, category, serial_number, notes } = data;
    db.run(`INSERT INTO assets (asset_code, asset_name, category, serial_number, notes) VALUES (?, ?, ?, ?, ?)`,
      [asset_code, asset_name, category || 'ELECTRONICS', serial_number || '', notes || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  assign: (id: number, user_id: number, return_date?: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE assets SET assigned_to = ?, status = 'BORROWED', assigned_date = date('now'), return_date = ? WHERE id = ?`,
      [user_id, return_date || null, id],
      (err) => { if (err) rej(err); else res(true); }
    );
  })
};

export const AnnouncementRepository = {
  findAll: (): Promise<AnnouncementRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT a.*, u.name as author_name FROM announcements a JOIN users u ON a.author_id = u.id ORDER BY a.is_pinned DESC, a.created_at DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as AnnouncementRecord[]);
    });
  }),
  create: (data: Partial<AnnouncementRecord>): Promise<number> => new Promise((res, rej) => {
    const { title, content, category, author_id, is_pinned } = data;
    db.run(`INSERT INTO announcements (title, content, category, author_id, is_pinned) VALUES (?, ?, ?, ?, ?)`,
      [title, content, category || 'GENERAL', author_id, is_pinned ? 1 : 0],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const PayrollRepository = {
  findAll: (): Promise<any[]> => new Promise((res, rej) => {
    db.all(`SELECT p.*, u.name as user_name, u.position, u.department FROM payroll p JOIN users u ON p.user_id = u.id ORDER BY p.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows);
    });
  }),
  findByUserId: (user_id: number): Promise<any[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM payroll WHERE user_id = ? ORDER BY id DESC`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows);
    });
  }),
  create: (data: any): Promise<number> => new Promise((res, rej) => {
    const { user_id, period, base_salary, allowance, overtime_pay, sick_deduction, absent_deduction, late_deduction, tax_bpjs_deduction, net_salary } = data;
    db.run(
      `INSERT INTO payroll (user_id, period, base_salary, allowance, overtime_pay, sick_deduction, absent_deduction, late_deduction, tax_bpjs_deduction, net_salary) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, period, base_salary, allowance, overtime_pay, sick_deduction, absent_deduction, late_deduction, tax_bpjs_deduction, net_salary],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const SettingsRepository = {
  getAll: (): Promise<Record<string, string>> => new Promise((res, rej) => {
    db.all(`SELECT * FROM settings`, [], (err, rows: any[]) => {
      if (err) rej(err);
      else {
        const config: Record<string, string> = {};
        rows.forEach(r => config[r.key] = r.value);
        res(config);
      }
    });
  }),
  set: (key: string, value: string | number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)`, [key, String(value)], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const NotificationRepository = {
  findByUserId: (user_id: number): Promise<any[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM notifications WHERE user_id = ? OR user_id = 0 ORDER BY id DESC LIMIT 50`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows || []);
    });
  }),
  create: (data: { user_id: number; type: string; title: string; desc: string }): Promise<number> => new Promise((res, rej) => {
    const { user_id, type, title, desc } = data;
    db.run(`INSERT INTO notifications (user_id, type, title, desc) VALUES (?, ?, ?, ?)`,
      [user_id, type, title, desc],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  markAllRead: (user_id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE notifications SET read = 1 WHERE user_id = ? OR user_id = 0`, [user_id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const ShiftRepository = {
  findAll: (): Promise<ShiftRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT s.*, b.name as branch_name FROM shifts s LEFT JOIN branches b ON s.branch_id = b.id ORDER BY s.id ASC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as ShiftRecord[]);
    });
  }),
  create: (data: Partial<ShiftRecord>): Promise<number> => new Promise((res, rej) => {
    const { code, name, start_time, end_time, branch_id, status } = data;
    db.run(
      `INSERT INTO shifts (code, name, start_time, end_time, branch_id, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [code, name, start_time, end_time, branch_id || 1, status || 'ACTIVE'],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  update: (id: number, data: Partial<ShiftRecord>): Promise<boolean> => new Promise((res, rej) => {
    const { code, name, start_time, end_time, branch_id, status } = data;
    db.run(
      `UPDATE shifts SET code=?, name=?, start_time=?, end_time=?, branch_id=?, status=? WHERE id=?`,
      [code, name, start_time, end_time, branch_id, status, id],
      (err) => { if (err) rej(err); else res(true); }
    );
  }),
  delete: (id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`DELETE FROM shifts WHERE id=?`, [id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const OvertimeRepository = {
  findAll: (): Promise<OvertimeRequest[]> => new Promise((res, rej) => {
    db.all(`SELECT o.*, u.name as user_name FROM overtime_requests o JOIN users u ON o.user_id = u.id ORDER BY o.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as OvertimeRequest[]);
    });
  }),
  findByUserId: (user_id: number): Promise<OvertimeRequest[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM overtime_requests WHERE user_id = ? ORDER BY id DESC`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows as OvertimeRequest[]);
    });
  }),
  create: (data: Partial<OvertimeRequest>): Promise<number> => new Promise((res, rej) => {
    const { user_id, date, hours, reason, rate_per_hour } = data;
    const rate = rate_per_hour || 50000;
    const total_pay = (hours || 0) * rate;
    db.run(
      `INSERT INTO overtime_requests (user_id, date, hours, reason, rate_per_hour, total_pay) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id, date, hours, reason, rate, total_pay],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  updateStatus: (id: number, status: 'APPROVED' | 'REJECTED', approved_by: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE overtime_requests SET status = ?, approved_by = ? WHERE id = ?`, [status, approved_by, id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const ReimbursementRepository = {
  findAll: (): Promise<ReimbursementRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT r.*, u.name as user_name FROM reimbursements r JOIN users u ON r.user_id = u.id ORDER BY r.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as ReimbursementRecord[]);
    });
  }),
  findByUserId: (user_id: number): Promise<ReimbursementRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM reimbursements WHERE user_id = ? ORDER BY id DESC`, [user_id], (err, rows) => {
      if (err) rej(err); else res(rows as ReimbursementRecord[]);
    });
  }),
  create: (data: Partial<ReimbursementRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, title, category, amount, receipt_url } = data;
    db.run(
      `INSERT INTO reimbursements (user_id, title, category, amount, receipt_url) VALUES (?, ?, ?, ?, ?)`,
      [user_id, title, category || 'MEDICAL', amount, receipt_url || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  updateStatus: (id: number, status: 'APPROVED' | 'REJECTED', approved_by: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE reimbursements SET status = ?, approved_by = ? WHERE id = ?`, [status, approved_by, id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const RecruitmentRepository = {
  findAllJobs: (): Promise<JobPosting[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM recruitment_jobs ORDER BY id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as JobPosting[]);
    });
  }),
  createJob: (data: Partial<JobPosting>): Promise<number> => new Promise((res, rej) => {
    const { title, department, branch_id, description, requirements } = data;
    db.run(
      `INSERT INTO recruitment_jobs (title, department, branch_id, description, requirements) VALUES (?, ?, ?, ?, ?)`,
      [title, department, branch_id || 1, description, requirements || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  findAllApplicants: (): Promise<JobApplicant[]> => new Promise((res, rej) => {
    db.all(`SELECT a.*, j.title as job_title FROM job_applicants a JOIN recruitment_jobs j ON a.job_id = j.id ORDER BY a.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as JobApplicant[]);
    });
  }),
  createApplicant: (data: Partial<JobApplicant>): Promise<number> => new Promise((res, rej) => {
    const { job_id, name, email, phone, resume_url } = data;
    db.run(
      `INSERT INTO job_applicants (job_id, name, email, phone, resume_url) VALUES (?, ?, ?, ?, ?)`,
      [job_id, name, email, phone, resume_url || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  updateApplicantStatus: (id: number, status: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE job_applicants SET status = ? WHERE id = ?`, [status, id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const AuditLogRepository = {
  findAll: (): Promise<AuditLogRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM audit_logs ORDER BY id DESC LIMIT 200`, [], (err, rows) => {
      if (err) rej(err); else res(rows as AuditLogRecord[]);
    });
  }),
  create: (data: { user_id?: number; user_name?: string; action: string; entity: string; details?: string; ip_address?: string }): Promise<number> => new Promise((res, rej) => {
    const { user_id, user_name, action, entity, details, ip_address } = data;
    db.run(
      `INSERT INTO audit_logs (user_id, user_name, action, entity, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)`,
      [user_id || 0, user_name || 'System', action, entity, details || '', ip_address || '127.0.0.1'],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const MeetingRoomRepository = {
  findAll: (): Promise<MeetingRoomRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM meeting_rooms ORDER BY id ASC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as MeetingRoomRecord[]);
    });
  }),
  create: (data: Partial<MeetingRoomRecord>): Promise<number> => new Promise((res, rej) => {
    const { name, capacity, location, facilities, branch_id, status } = data;
    db.run(
      `INSERT INTO meeting_rooms (name, capacity, location, facilities, branch_id, status) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, capacity || 10, location, facilities || '', branch_id || 1, status || 'AVAILABLE'],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const MeetingScheduleRepository = {
  findAll: (): Promise<MeetingScheduleRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT s.*, r.name as room_name, u.name as user_name FROM meeting_schedules s LEFT JOIN meeting_rooms r ON s.room_id = r.id JOIN users u ON s.user_id = u.id WHERE s.status = 'CONFIRMED' ORDER BY s.date ASC, s.start_time ASC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as MeetingScheduleRecord[]);
    });
  }),
  checkConflict: (room_id: number, date: string, start_time: string, end_time: string): Promise<boolean> => new Promise((res, rej) => {
    // Check if any existing confirmed booking overlaps
    db.get(
      `SELECT COUNT(*) as count FROM meeting_schedules WHERE room_id = ? AND date = ? AND status = 'CONFIRMED' AND (start_time < ? AND end_time > ?)`,
      [room_id, date, end_time, start_time],
      (err, row: any) => {
        if (err) rej(err);
        else res(row && row.count > 0); // Returns true if conflict exists
      }
    );
  }),
  create: (data: Partial<MeetingScheduleRecord>): Promise<number> => new Promise((res, rej) => {
    const { title, room_id, user_id, date, start_time, end_time, meeting_link, description } = data;
    db.run(
      `INSERT INTO meeting_schedules (title, room_id, user_id, date, start_time, end_time, meeting_link, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, room_id || null, user_id, date, start_time, end_time, meeting_link || '', description || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  cancel: (id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE meeting_schedules SET status = 'CANCELLED' WHERE id = ?`, [id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const OffboardingRepository = {
  findAllResignations: (): Promise<ResignationRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT r.*, u.name as user_name FROM resignations r JOIN users u ON r.user_id = u.id ORDER BY r.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as ResignationRecord[]);
    });
  }),
  createResignation: (data: Partial<ResignationRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, reason, notice_date, effective_date, exit_clearance_notes } = data;
    db.run(
      `INSERT INTO resignations (user_id, reason, notice_date, effective_date, exit_clearance_notes) VALUES (?, ?, ?, ?, ?)`,
      [user_id, reason, notice_date, effective_date, exit_clearance_notes || ''],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  updateResignationStatus: (id: number, status: string, notes?: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(`UPDATE resignations SET status = ?, exit_clearance_notes = ? WHERE id = ?`, [status, notes || '', id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const WarningRepository = {
  findAll: (): Promise<WarningLetterRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT w.*, u.name as user_name FROM warning_letters w JOIN users u ON w.user_id = u.id ORDER BY w.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as WarningLetterRecord[]);
    });
  }),
  create: (data: Partial<WarningLetterRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, level, reason, issued_by, issued_date } = data;
    db.run(
      `INSERT INTO warning_letters (user_id, level, reason, issued_by, issued_date) VALUES (?, ?, ?, ?, ?)`,
      [user_id, level || 'SP1', reason, issued_by || 'HR Manager', issued_date],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  })
};

export const TrainingRepository = {
  findAll: (): Promise<TrainingRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT t.*, u.name as user_name FROM employee_trainings t JOIN users u ON t.user_id = u.id ORDER BY t.id DESC`, [], (err, rows) => {
      if (err) rej(err); else res(rows as TrainingRecord[]);
    });
  }),
  create: (data: Partial<TrainingRecord>): Promise<number> => new Promise((res, rej) => {
    const { user_id, title, provider, category, start_date, end_date, certification_url, expiry_date } = data;
    db.run(
      `INSERT INTO employee_trainings (user_id, title, provider, category, start_date, end_date, certification_url, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, title, provider, category || 'TECHNICAL', start_date, end_date, certification_url || '', expiry_date || null],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),
  delete: (id: number): Promise<boolean> => new Promise((res, rej) => {
    db.run(`DELETE FROM employee_trainings WHERE id = ?`, [id], (err) => {
      if (err) rej(err); else res(true);
    });
  })
};

export const OrgChartRepository = {
  getTree: (): Promise<OrgTreeNode[]> => new Promise((res, rej) => {
    db.all(`SELECT id, name, position, department, branch_name, avatar, manager_id FROM users WHERE status = 'ACTIVE' ORDER BY id ASC`, [], (err, rows: any[]) => {
      if (err) return rej(err);

      // Build Hierarchy Tree
      const userMap = new Map<number, OrgTreeNode>();
      rows.forEach(r => {
        userMap.set(r.id, { ...r, subordinates: [] });
      });

      const rootNodes: OrgTreeNode[] = [];
      userMap.forEach(node => {
        if (node.manager_id && userMap.has(node.manager_id)) {
          userMap.get(node.manager_id)!.subordinates!.push(node);
        } else {
          rootNodes.push(node);
        }
      });

      res(rootNodes);
    });
  })
};

export interface OrderRecord {
  id?: number;
  order_id: string;
  plan_id: string;
  plan_name: string;
  billing_cycle: string;
  amount: number;
  admin_fee?: number;
  tax?: number;
  total_amount: number;
  company_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  payment_method?: string;
  payment_status?: string;
  snap_token?: string;
  snap_redirect_url?: string;
  transaction_time?: string;
  settlement_time?: string;
  raw_response?: string;
  created_at?: string;
}

export const OrderRepository = {
  create: (data: OrderRecord): Promise<number> => new Promise((res, rej) => {
    const {
      order_id, plan_id, plan_name, billing_cycle, amount, admin_fee = 0, tax = 0,
      total_amount, company_name, customer_name, customer_email, customer_phone = '',
      payment_method = 'midtrans', payment_status = 'PENDING', snap_token = '', snap_redirect_url = ''
    } = data;
    db.run(
      `INSERT INTO orders (
        order_id, plan_id, plan_name, billing_cycle, amount, admin_fee, tax,
        total_amount, company_name, customer_name, customer_email, customer_phone,
        payment_method, payment_status, snap_token, snap_redirect_url
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id, plan_id, plan_name, billing_cycle, amount, admin_fee, tax,
        total_amount, company_name, customer_name, customer_email, customer_phone,
        payment_method, payment_status, snap_token, snap_redirect_url
      ],
      function(err) { if (err) rej(err); else res(this.lastID); }
    );
  }),

  findByOrderId: (orderId: string): Promise<OrderRecord | undefined> => new Promise((res, rej) => {
    db.get(`SELECT * FROM orders WHERE order_id = ?`, [orderId], (err, row) => {
      if (err) rej(err); else res(row as OrderRecord);
    });
  }),

  updateStatus: (orderId: string, status: string, paymentMethod?: string, settlementTime?: string, rawResponse?: string): Promise<boolean> => new Promise((res, rej) => {
    db.run(
      `UPDATE orders SET 
        payment_status = ?,
        payment_method = COALESCE(?, payment_method),
        settlement_time = COALESCE(?, settlement_time),
        raw_response = COALESCE(?, raw_response)
      WHERE order_id = ?`,
      [status, paymentMethod || null, settlementTime || null, rawResponse || null, orderId],
      (err) => { if (err) rej(err); else res(true); }
    );
  }),

  findAll: (): Promise<OrderRecord[]> => new Promise((res, rej) => {
    db.all(`SELECT * FROM orders ORDER BY created_at DESC LIMIT 50`, [], (err, rows) => {
      if (err) rej(err); else res(rows as OrderRecord[]);
    });
  })
};
