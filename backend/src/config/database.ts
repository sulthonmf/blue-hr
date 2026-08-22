import sqlite3 from 'sqlite3';
import path from 'path';

const sqlite = sqlite3.verbose();
const dbPath = path.resolve(__dirname, '../../blue_hr.db');
export const db = new sqlite.Database(dbPath);

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
        `ALTER TABLE users ADD COLUMN emergency_contact_relation TEXT`
      ];
      userMigrations.forEach(sql => db.run(sql, () => {}));

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
