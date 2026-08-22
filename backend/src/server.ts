import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { initDatabase, db } from './config/database';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Base Route
app.use('/api/v1', routes);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', app: 'BlueHR Enterprise TypeScript API', timestamp: new Date().toISOString() });
});

async function seedAdmin() {
  db.get(`SELECT COUNT(*) as count FROM users`, [], async (err, row: any) => {
    if (!err && row && row.count === 0) {
      const salt = await bcrypt.genSalt(10);
      const adminPass = await bcrypt.hash('admin123', salt);
      const hrPass = await bcrypt.hash('hr123', salt);
      const empPass = await bcrypt.hash('emp123', salt);

      // Seed Super Admin, HR, and Employee
      db.run(`INSERT INTO users (name, email, password_hash, role_id, position, department, leave_quota) VALUES 
        ('Admin Chief', 'admin@bluehr.com', ?, 1, 'Chief HR Officer', 'Executive', 25),
        ('Siti Rahma (HR)', 'hr@bluehr.com', ?, 2, 'HR Operations Lead', 'Human Capital', 18),
        ('Budi Santoso (Employee)', 'budi@bluehr.com', ?, 3, 'Senior Software Engineer', 'Engineering', 12)
      `, [adminPass, hrPass, empPass], (err) => {
        if (!err) {
          console.log('[Seed] TypeScript Default users seeded successfully:');
          console.log(' - Admin: admin@bluehr.com / admin123');
          console.log(' - HR: hr@bluehr.com / hr123');
          console.log(' - Employee: budi@bluehr.com / emp123');
        }
      });

      // Seed announcements
      db.run(`INSERT INTO announcements (title, content, category, author_id, is_pinned) VALUES 
        ('Kebijakan Jam Kerja & Absensi Hibrid 2026', 'Seluruh karyawan diwajibkan melakukan absen geofencing radius 5 km dari lokasi kantor Jakarta Central.', 'IMPORTANT', 1, 1),
        ('Townhall Perusahaan Q3 & Performance Review', 'Jadwal penilaian KPI dan pengajuan cuti triwulan akan dibuka hingga tanggal 30 bulan ini.', 'GENERAL', 2, 0)
      `);

      // Seed assets
      db.run(`INSERT INTO assets (asset_code, asset_name, category, serial_number, status, notes) VALUES 
        ('AST-MBP-001', 'MacBook Pro M3 Max 16 inch', 'LAPTOP', 'SN-AAPL-2026-X1', 'AVAILABLE', 'Unit baru siap pakai'),
        ('AST-DEL-002', 'Monitor Dell UltraSharp 27 4K', 'MONITOR', 'SN-DELL-9921', 'AVAILABLE', 'Termasuk cable hub')
      `);

      // Seed KPI
      db.run(`INSERT INTO kpis (user_id, period, title, target_score, actual_score, feedback, evaluator_id) VALUES 
        (3, '2026-Q1', 'Backend API Architecture & Unit Testing', 100, 95, 'Performa sangat memuaskan dan test coverage bagus.', 1)
      `);
    }
  });
}

initDatabase().then(() => {
  seedAdmin();
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`🚀 BlueHR TypeScript Backend Server running on http://localhost:${PORT}`);
    });
  }
}).catch((err) => {
  console.error('Failed to initialize database:', err);
});

export default app;
