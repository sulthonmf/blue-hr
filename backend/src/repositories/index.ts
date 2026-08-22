import { db } from '../config/database';
import { User, Role, AttendanceRecord, LeaveRequest, KPIRecord, DocumentRecord, AssetRecord, AnnouncementRecord } from '../types';

export const UserRepository = {
  findByEmail: (email: string): Promise<User | undefined> => new Promise((res, rej) => {
    db.get(`SELECT u.*, r.name as role_name, r.permissions FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?`, [email], (err, row) => {
      if (err) rej(err); else res(row as User);
    });
  }),
  findById: (id: number): Promise<User | undefined> => new Promise((res, rej) => {
    db.get(`SELECT u.id, u.name, u.email, u.role_id, r.name as role_name, r.permissions, u.position, u.department, u.division, u.directorate, u.phone, u.address, u.emergency_contact_name, u.emergency_contact_phone, u.emergency_contact_relation, u.avatar, u.leave_quota, u.status FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ?`, [id], (err, row) => {
      if (err) rej(err); else res(row as User);
    });
  }),
  findAll: (): Promise<User[]> => new Promise((res, rej) => {
    db.all(`SELECT u.id, u.name, u.email, u.role_id, r.name as role_name, u.position, u.department, u.division, u.directorate, u.phone, u.address, u.emergency_contact_name, u.emergency_contact_phone, u.emergency_contact_relation, u.avatar, u.leave_quota, u.status FROM users u JOIN roles r ON u.role_id = r.id ORDER BY u.id DESC`, [], (err, rows) => {
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
  })
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
