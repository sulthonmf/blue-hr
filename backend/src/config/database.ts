import sqlite3 from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, '../../blue_hr.db');
export const db = new sqlite.Database(dbPath);
db.configure('busyTimeout', 10000);
db.run('PRAGMA journal_mode = WAL;');

export function initDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          role_id INTEGER NOT NULL,
          position TEXT DEFAULT 'Employee',
          department TEXT DEFAULT 'General',
          division TEXT DEFAULT 'Divisi Teknologi & Informasi',
          directorate TEXT DEFAULT 'Direktorat Utama',
          phone TEXT,
          address TEXT,
          emergency_contact_name TEXT,
          emergency_contact_phone TEXT,
          emergency_contact_relation TEXT,
          avatar TEXT,
          leave_quota INTEGER DEFAULT 12,
          status TEXT DEFAULT 'ACTIVE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Migration for users columns
      const userMigrations = [
        `ALTER TABLE users ADD COLUMN division TEXT DEFAULT 'Divisi Teknologi & Informasi'`,
        `ALTER TABLE users ADD COLUMN directorate TEXT DEFAULT 'Direktorat Utama'`,
        `ALTER TABLE users ADD COLUMN address TEXT`,
        `ALTER TABLE users ADD COLUMN emergency_contact_name TEXT`,
        `ALTER TABLE users ADD COLUMN emergency_contact_phone TEXT`,
        `ALTER TABLE users ADD COLUMN emergency_contact_relation TEXT`,
        `ALTER TABLE users ADD COLUMN branch_id INTEGER DEFAULT 1`,
        `ALTER TABLE users ADD COLUMN branch_name TEXT DEFAULT 'Kantor Pusat Jakarta'`
      ];
      userMigrations.forEach(sql => db.run(sql, () => {}));

      // Branches table
      db.run(`
        CREATE TABLE IF NOT EXISTS branches (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          address TEXT NOT NULL,
          city TEXT NOT NULL,
          phone TEXT,
          latitude REAL DEFAULT -6.2088,
          longitude REAL DEFAULT 106.8456,
          radius_km REAL DEFAULT 5.0,
          status TEXT DEFAULT 'ACTIVE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Roles table
      db.run(`
        CREATE TABLE IF NOT EXISTS roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          description TEXT,
          permissions TEXT NOT NULL,
          is_system INTEGER DEFAULT 0
        )
      `);

      // Attendance table
      db.run(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          check_in DATETIME DEFAULT CURRENT_TIMESTAMP,
          check_out DATETIME,
          latitude REAL,
          longitude REAL,
          distance_km REAL,
          status TEXT DEFAULT 'ON_TIME',
          photo_url TEXT,
          notes TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Leave Requests table
      db.run(`
        CREATE TABLE IF NOT EXISTS leave_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          leave_type TEXT NOT NULL,
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          duration_days INTEGER NOT NULL,
          reason TEXT,
          status TEXT DEFAULT 'PENDING',
          approved_l1_by INTEGER,
          approved_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);
      db.run(`ALTER TABLE leave_requests ADD COLUMN approved_l1_by INTEGER`, () => {});

      // KPI table
      db.run(`
        CREATE TABLE IF NOT EXISTS kpis (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          period TEXT NOT NULL,
          title TEXT NOT NULL,
          target_score REAL DEFAULT 100,
          actual_score REAL DEFAULT 0,
          feedback TEXT,
          evaluator_id INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Documents table
      db.run(`
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          doc_type TEXT NOT NULL,
          title TEXT NOT NULL,
          file_url TEXT NOT NULL,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Assets table
      db.run(`
        CREATE TABLE IF NOT EXISTS assets (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          asset_code TEXT UNIQUE NOT NULL,
          asset_name TEXT NOT NULL,
          category TEXT DEFAULT 'ELECTRONICS',
          serial_number TEXT,
          status TEXT DEFAULT 'AVAILABLE',
          assigned_to INTEGER,
          assigned_date DATE,
          return_date DATE,
          notes TEXT,
          FOREIGN KEY (assigned_to) REFERENCES users(id)
        )
      `);

      // Announcements table
      db.run(`
        CREATE TABLE IF NOT EXISTS announcements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          category TEXT DEFAULT 'GENERAL',
          author_id INTEGER NOT NULL,
          is_pinned INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES users(id)
        )
      `);

      // Payroll table
      db.run(`
        CREATE TABLE IF NOT EXISTS payroll (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          period TEXT NOT NULL,
          base_salary REAL NOT NULL DEFAULT 0,
          allowance REAL NOT NULL DEFAULT 0,
          overtime_pay REAL NOT NULL DEFAULT 0,
          sick_deduction REAL NOT NULL DEFAULT 0,
          absent_deduction REAL NOT NULL DEFAULT 0,
          late_deduction REAL NOT NULL DEFAULT 0,
          tax_bpjs_deduction REAL NOT NULL DEFAULT 0,
          net_salary REAL NOT NULL DEFAULT 0,
          status TEXT DEFAULT 'PAID',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Settings table
      db.run(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);

      // Notifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS notifications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          desc TEXT NOT NULL,
          read INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Shifts table
      db.run(`
        CREATE TABLE IF NOT EXISTS shifts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          branch_id INTEGER DEFAULT 1,
          status TEXT DEFAULT 'ACTIVE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Overtime requests table
      db.run(`
        CREATE TABLE IF NOT EXISTS overtime_requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          date DATE NOT NULL,
          hours REAL NOT NULL,
          reason TEXT NOT NULL,
          status TEXT DEFAULT 'PENDING',
          approved_by INTEGER,
          rate_per_hour REAL DEFAULT 50000,
          total_pay REAL DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Reimbursements table
      db.run(`
        CREATE TABLE IF NOT EXISTS reimbursements (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          category TEXT DEFAULT 'MEDICAL',
          amount REAL NOT NULL,
          receipt_url TEXT,
          status TEXT DEFAULT 'PENDING',
          approved_by INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Recruitment jobs table
      db.run(`
        CREATE TABLE IF NOT EXISTS recruitment_jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          department TEXT NOT NULL,
          branch_id INTEGER DEFAULT 1,
          description TEXT NOT NULL,
          requirements TEXT,
          status TEXT DEFAULT 'OPEN',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Job applicants table
      db.run(`
        CREATE TABLE IF NOT EXISTS job_applicants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          job_id INTEGER NOT NULL,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          resume_url TEXT,
          status TEXT DEFAULT 'APPLIED',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (job_id) REFERENCES recruitment_jobs(id)
        )
      `);

      // Audit logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          user_name TEXT,
          action TEXT NOT NULL,
          entity TEXT NOT NULL,
          details TEXT,
          ip_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Meeting rooms table
      db.run(`
        CREATE TABLE IF NOT EXISTS meeting_rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          capacity INTEGER NOT NULL DEFAULT 10,
          location TEXT NOT NULL,
          facilities TEXT,
          branch_id INTEGER DEFAULT 1,
          status TEXT DEFAULT 'AVAILABLE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Meeting schedules table
      db.run(`
        CREATE TABLE IF NOT EXISTS meeting_schedules (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          room_id INTEGER,
          room_name TEXT,
          user_id INTEGER NOT NULL,
          user_name TEXT,
          date DATE NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          meeting_link TEXT,
          description TEXT,
          status TEXT DEFAULT 'CONFIRMED',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Resignations table
      db.run(`
        CREATE TABLE IF NOT EXISTS resignations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          user_name TEXT,
          reason TEXT NOT NULL,
          notice_date DATE NOT NULL,
          effective_date DATE NOT NULL,
          status TEXT DEFAULT 'PENDING',
          exit_clearance_notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Warning Letters table (SP1, SP2, SP3)
      db.run(`
        CREATE TABLE IF NOT EXISTS warning_letters (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          user_name TEXT,
          level TEXT DEFAULT 'SP1',
          reason TEXT NOT NULL,
          issued_by TEXT,
          issued_date DATE NOT NULL,
          status TEXT DEFAULT 'ACTIVE',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Employee Trainings & Certifications table
      db.run(`
        CREATE TABLE IF NOT EXISTS employee_trainings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          user_name TEXT,
          title TEXT NOT NULL,
          provider TEXT NOT NULL,
          category TEXT DEFAULT 'TECHNICAL',
          start_date DATE NOT NULL,
          end_date DATE NOT NULL,
          certification_url TEXT,
          expiry_date DATE,
          status TEXT DEFAULT 'COMPLETED',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Seed Initial Roles if empty
      db.get(`SELECT COUNT(*) as count FROM roles`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          const adminPermissions = JSON.stringify([
            'all', 'manage_users', 'manage_roles', 'manage_attendance',
            'approve_leave', 'manage_leave_quota', 'manage_kpi',
            'manage_documents', 'manage_assets', 'manage_announcements', 'manage_settings', 'manage_payroll'
          ]);
          const hrPermissions = JSON.stringify([
            'manage_users', 'manage_attendance', 'approve_leave',
            'manage_leave_quota', 'manage_kpi', 'manage_documents',
            'manage_assets', 'manage_announcements', 'manage_payroll'
          ]);
          const employeePermissions = JSON.stringify([
            'view_own_attendance', 'clock_in_out', 'request_leave',
            'view_own_kpi', 'view_own_documents', 'view_announcements', 'view_own_payroll'
          ]);

          db.run(`INSERT INTO roles (name, description, permissions, is_system) VALUES 
            ('Admin', 'System Administrator with full permissions', ?, 1),
            ('HR Manager', 'Human Resource Manager', ?, 1),
            ('Employee', 'General Employee', ?, 1)
          `, [adminPermissions, hrPermissions, employeePermissions]);
        }
      });

      // Seed default branches if empty
      db.get(`SELECT COUNT(*) as count FROM branches`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          db.run(`INSERT INTO branches (code, name, address, city, phone, latitude, longitude, radius_km, status) VALUES
            ('BR-JKT-01', 'Kantor Pusat Jakarta', 'Jl. Jend. Sudirman No. 10, Jakarta Selatan', 'Jakarta', '021-5550100', -6.2088, 106.8456, 5.0, 'ACTIVE'),
            ('BR-BDG-02', 'Cabang Bandung', 'Jl. Asia Afrika No. 45, Bandung', 'Bandung', '022-4200123', -6.9175, 107.6191, 5.0, 'ACTIVE'),
            ('BR-SBY-03', 'Cabang Surabaya', 'Jl. Pemuda No. 88, Surabaya', 'Surabaya', '031-5312000', -7.2575, 112.7521, 5.0, 'ACTIVE')
          `);
        }
      });

      // Seed default shifts if empty
      db.get(`SELECT COUNT(*) as count FROM shifts`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          db.run(`INSERT INTO shifts (code, name, start_time, end_time, branch_id, status) VALUES
            ('SH-REG-01', 'Shift Reguler Pagi', '08:00', '17:00', 1, 'ACTIVE'),
            ('SH-MID-02', 'Shift Siang Operasional', '13:00', '22:00', 1, 'ACTIVE'),
            ('SH-NIG-03', 'Shift Malam IT Support', '22:00', '07:00', 1, 'ACTIVE')
          `);
        }
      });

      // Seed default recruitment jobs if empty
      db.get(`SELECT COUNT(*) as count FROM recruitment_jobs`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          db.run(`INSERT INTO recruitment_jobs (title, department, branch_id, description, requirements, status) VALUES
            ('Senior Frontend Developer (React/TS)', 'Engineering', 1, 'Mengembangkan UI web enterprise berkinerja tinggi.', 'Pengalaman 3+ tahun React & TypeScript.', 'OPEN'),
            ('HR Generalist Lead', 'Human Capital', 1, 'Mengelola operasional HR, payroll, dan hubungan karyawan.', 'Pengalaman 4+ tahun di bidang HR.', 'OPEN')
          `);
        }
      });

      // Seed default meeting rooms if empty
      db.get(`SELECT COUNT(*) as count FROM meeting_rooms`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          db.run(`INSERT INTO meeting_rooms (name, capacity, location, facilities, branch_id, status) VALUES
            ('Ruang Rapat Utama (Executive)', 16, 'Lantai 3 - Gedung A', 'Smart TV 75 inch, Projector 4K, Whiteboard, Video Conf System', 1, 'AVAILABLE'),
            ('Ruang Diskusi Alpha', 8, 'Lantai 2 - Gedung A', 'TV Display 55 inch, Glass Board', 1, 'AVAILABLE'),
            ('Innovation Lab Room', 12, 'Lantai 2 - Gedung B', 'Projector, Whiteboard, Podcasting Mic', 1, 'AVAILABLE')
          `);
        }
      });

      // Seed initial meeting schedule if empty
      db.get(`SELECT COUNT(*) as count FROM meeting_schedules`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          const todayStr = new Date().toISOString().split('T')[0];
          db.run(`INSERT INTO meeting_schedules (title, room_id, room_name, user_id, user_name, date, start_time, end_time, meeting_link, description, status) VALUES
            ('Sprint Planning & Sync UI/UX', 1, 'Ruang Rapat Utama (Executive)', 1, 'Admin HR', ?, '09:00', '10:30', 'https://meet.google.com/abc-defg-hij', 'Pembahasan sprint 24 rilis fitur enterprise HRIS', 'CONFIRMED'),
            ('Townhall All Hands Q3', 1, 'Ruang Rapat Utama (Executive)', 1, 'Admin HR', ?, '14:00', '15:30', 'https://meet.google.com/xyz-uvwx-rst', 'Pengumuman strategi kuartal 3 perusahaan', 'CONFIRMED')
          `, [todayStr, todayStr]);
        }
      });

      // Seed 100 Employee test data if count < 100
      db.get(`SELECT COUNT(*) as count FROM users`, [], (err, row: any) => {
        if (!err && row && row.count < 100) {
          const defaultPasswordHash = bcrypt.hashSync('password123', 10);

          const firstNames = ['Budi', 'Siti', 'Rizky', 'Dewi', 'Aditya', 'Ayu', 'Rahmat', 'Indah', 'Fajar', 'Bagas', 'Niken', 'Hendri', 'Putri', 'Taufik', 'Laras', 'Agus', 'Mega', 'Eko', 'Rina', 'Dian'];
          const lastNames = ['Pratama', 'Wijaya', 'Rahmawati', 'Anggraini', 'Firmansyah', 'Santoso', 'Kusuma', 'Saputra', 'Utami', 'Wibowo', 'Hidayat', 'Nugroho', 'Suryani', 'Lestari', 'Setiawan'];
          const positions = ['Senior Software Engineer', 'Frontend Specialist', 'Backend Developer', 'QA Lead', 'Product Manager', 'UX Researcher', 'HR Generalist', 'Financial Analyst', 'DevOps Specialist', 'Marketing Strategist', 'System Administrator', 'Customer Success Lead'];
          const departments = ['Engineering', 'Human Capital', 'Finance & Accounting', 'Product', 'Operations', 'Marketing', 'Sales'];
          const branchesList = [
            { id: 1, name: 'Kantor Pusat Jakarta' },
            { id: 2, name: 'Cabang Bandung' },
            { id: 3, name: 'Cabang Surabaya' }
          ];

          const currentCount = row.count || 0;
          const needed = 100 - currentCount;

          const stmt = db.prepare(`
            INSERT INTO users (name, email, password_hash, role_id, position, department, division, directorate, phone, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relation, leave_quota, status, branch_id, branch_name)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);

          for (let i = 1; i <= needed; i++) {
            const index = currentCount + i;
            const firstName = firstNames[index % firstNames.length];
            const lastName = lastNames[(index * 3) % lastNames.length];
            const name = `${firstName} ${lastName}`;
            const email = `karyawan${index}@bluehr.com`;
            const position = positions[index % positions.length];
            const department = departments[index % departments.length];
            const branch = branchesList[index % branchesList.length];
            const phone = `+62812${String(10000000 + index).substring(1)}`;
            const address = `Jl. Karyawan Perumahan No. ${index}, ${branch.name.includes('Bandung') ? 'Bandung' : branch.name.includes('Surabaya') ? 'Surabaya' : 'Jakarta Selatan'}`;
            const roleId = index === 1 ? 1 : index === 2 ? 2 : 3;

            stmt.run([
              name,
              email,
              defaultPasswordHash,
              roleId,
              position,
              department,
              'Divisi Teknologi & Informasi',
              'Direktorat Utama',
              phone,
              address,
              `Keluarga ${firstName}`,
              '+628199988877',
              'Keluarga Kandung',
              12,
              'ACTIVE',
              branch.id,
              branch.name
            ]);
          }
          stmt.finalize();
          console.log(`[DB Seed] Successfully seeded ${needed} employee test data (Total 100 users).`);
        }

        // Seed default payroll records for all 100 users if payroll count < 10
        db.get(`SELECT COUNT(*) as count FROM payroll`, [], (err, pRow: any) => {
          if (!err && pRow && pRow.count < 10) {
            db.all(`SELECT id, position, department FROM users`, [], (err, users: any[]) => {
              if (!err && users && users.length > 0) {
                const pStmt = db.prepare(`
                  INSERT INTO payroll (user_id, period, base_salary, allowance, overtime_pay, sick_deduction, absent_deduction, late_deduction, tax_bpjs_deduction, net_salary)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                const currentPeriod = '2026-08';

                users.forEach((u) => {
                  const pos = (u.position || '').toLowerCase();
                  let base = 8500000;
                  let allow = 1500000;
                  if (pos.includes('director') || pos.includes('vp') || pos.includes('head')) { base = 25000000; allow = 5000000; }
                  else if (pos.includes('manager') || pos.includes('lead')) { base = 16000000; allow = 3000000; }
                  else if (pos.includes('senior') || pos.includes('architect')) { base = 12000000; allow = 2000000; }
                  else if (pos.includes('specialist') || pos.includes('developer') || pos.includes('engineer')) { base = 9500000; allow = 1500000; }

                  const bpjs = Math.round(base * 0.05);
                  const net = (base + allow + 500000) - (bpjs + 50000);
                  pStmt.run([u.id, currentPeriod, base, allow, 500000, 0, 0, 50000, bpjs, net]);
                });
                pStmt.finalize();
                console.log(`[DB Seed] Successfully auto-generated monthly payslips for ${users.length} employees.`);
              }
            });
          }
        });
      });

      // Seed default settings if empty
      db.get(`SELECT COUNT(*) as count FROM settings`, [], (err, row: any) => {
        if (!err && row && row.count === 0) {
          db.run(`INSERT INTO settings (key, value) VALUES 
            ('office_lat', '-6.2088'),
            ('office_lng', '106.8456'),
            ('max_distance_km', '5.0'),
            ('company_name', 'BlueHR Corp')
          `, (err) => {
            if (err) reject(err); else resolve();
          });
        } else {
          resolve();
        }
      });
    });
  });
}
