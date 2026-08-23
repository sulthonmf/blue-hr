import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import {
  AuthService,
  AttendanceService,
  LeaveService,
  UserRepository,
  BranchRepository,
  RoleRepository,
  AttendanceRepository,
  LeaveRepository,
  KPIRepository,
  DocumentRepository,
  AssetRepository,
  AnnouncementRepository,
  PayrollRepository,
  SettingsRepository,
  NotificationRepository,
  ShiftRepository,
  OvertimeRepository,
  ReimbursementRepository,
  RecruitmentRepository,
  AuditLogRepository,
  MeetingRoomRepository,
  MeetingScheduleRepository,
  OffboardingRepository,
  WarningRepository,
  TrainingRepository,
  OrgChartRepository,
  JWT_SECRET
} from '../services';
import { hasPermission, checkPasswordRules } from '../domain/math';

console.log('[Routes] Module loading... PayrollRepository:', typeof PayrollRepository);

const router = express.Router();

// Rate limiter for login endpoint to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'test' ? 1000 : 10, // Limit each IP to 10 requests per windowMs in dev/prod
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.' }
});

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role_id: number;
    role_name: string;
    department?: string;
    division?: string;
    permissions: string[];
  };
}

// Authentication Middleware
function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user as AuthenticatedRequest['user'];
    next();
  });
}

// RBAC Middleware Generator
function requirePermission(permissionCode: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !hasPermission(req.user.permissions, permissionCode)) {
      return res.status(403).json({ error: `Permission denied: ${permissionCode} required` });
    }
    next();
  };
}

// AUTH ROUTES
router.post('/auth/login', loginLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);

    // Set HttpOnly Refresh Token Cookie for Web Clients
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/auth/refresh', async (req: Request, res: Response) => {
  try {
    // Accept refresh token from Cookie (Web) or Request Body (Mobile)
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token missing' });
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    // Update HttpOnly Cookie for Web
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

router.post('/auth/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await UserRepository.findById(req.user.id);
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/auth/avatar', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { avatar } = req.body;
    await UserRepository.updateAvatar(req.user.id, avatar);
    res.json({ message: 'Avatar updated successfully', avatar });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/auth/register', authenticateToken, requirePermission('manage_users'), async (req: Request, res: Response) => {
  try {
    const newUser = await AuthService.registerEmployee(req.body);
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/auth/reset-password', authenticateToken, requirePermission('manage_users'), async (req: Request, res: Response) => {
  try {
    const { userId, newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'Password baru harus diisi' });
    }

    const rules = checkPasswordRules(newPassword);
    if (!rules.isValid) {
      return res.status(400).json({
        error: 'Password tidak memenuhi standar keamanan! Harus minimal 8 karakter, ada huruf besar, huruf kecil, angka, dan simbol khusus.'
      });
    }

    await AuthService.resetPassword(userId, newPassword);
    res.json({ message: 'Password reset successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/auth/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ error: 'Password baru harus diisi' });
    }

    const rules = checkPasswordRules(newPassword);
    if (!rules.isValid) {
      return res.status(400).json({
        error: 'Password tidak memenuhi standar keamanan! Harus minimal 8 karakter, ada huruf besar, huruf kecil, angka, dan simbol khusus.'
      });
    }

    await AuthService.resetPassword(req.user.id, newPassword);
    res.json({ message: 'Password berhasil diperbarui' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// EMPLOYEES & ROLES ROUTES
router.get('/employees', authenticateToken, async (req: Request, res: Response) => {
  try {
    const users = await UserRepository.findAll();
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GET /team (Team members of logged in user's department)
router.get('/team', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const users = await UserRepository.findAll();
    const teamMembers = users.filter(u => u.department === req.user?.department || u.division === req.user?.division);
    res.json(teamMembers.length > 0 ? teamMembers : users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee profile (HR/Admin only)
router.patch('/employees/:id', authenticateToken, requirePermission('manage_users'), async (req: Request, res: Response) => {
  try {
    await UserRepository.update(parseInt(req.params.id, 10), req.body);
    res.json({ message: 'Employee updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Freeze / Deactivate / Reactivate employee (NO delete - GDPR compliance)
router.patch('/employees/:id/status', authenticateToken, requirePermission('manage_users'), async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // 'ACTIVE' | 'INACTIVE' | 'RESIGNED'
    if (!['ACTIVE', 'INACTIVE', 'RESIGNED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use ACTIVE, INACTIVE, or RESIGNED.' });
    }
    await UserRepository.updateStatus(parseInt(req.params.id, 10), status);
    res.json({ message: `Employee status changed to ${status}` });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/roles', authenticateToken, async (req: Request, res: Response) => {
  try {
    const roles = await RoleRepository.findAll();
    res.json(roles);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/roles', authenticateToken, requirePermission('manage_roles'), async (req: Request, res: Response) => {
  try {
    const roleId = await RoleRepository.create(req.body);
    res.status(201).json({ id: roleId, message: 'Dynamic role created successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ATTENDANCE & GEOFENCING ROUTES
router.post('/attendance/clock-in', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { latitude, longitude, photo_url, notes } = req.body;
    const result = await AttendanceService.clockIn(req.user.id, latitude, longitude, photo_url, notes);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/attendance/clock-out', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await AttendanceService.clockOut(req.user.id);
    res.json({ message: 'Clocked out successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/attendance/logs', authenticateToken, async (req: Request, res: Response) => {
  try {
    const logs = await AttendanceRepository.findAllLogs();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/attendance/today', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const record = await AttendanceRepository.findByUserIdToday(req.user.id);
    res.json(record || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// LEAVE ROUTES
router.get('/leaves', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    let leaves;
    if (hasPermission(req.user.permissions, 'approve_leave')) {
      leaves = await LeaveRepository.findAll();
    } else {
      leaves = await LeaveRepository.findByUserId(req.user.id);
    }
    res.json(leaves);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/leaves', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { leave_type, start_date, end_date, duration_days, reason } = req.body;
    const leaveId = await LeaveService.requestLeave(req.user.id, leave_type, start_date, end_date, duration_days, reason);
    res.status(201).json({ id: leaveId, message: 'Leave request submitted' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/leaves/:id/approve-l1', authenticateToken, requirePermission('approve_leave'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await LeaveService.approveLeaveL1(parseInt(req.params.id, 10), req.user.id);
    res.json({ message: 'Leave request approved at Level 1 (Manager)' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/leaves/:id/approve', authenticateToken, requirePermission('approve_leave'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await LeaveService.approveLeave(parseInt(req.params.id, 10), req.user.id);
    res.json({ message: 'Leave request approved (Final HR & Direksi)' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/leaves/:id/reject', authenticateToken, requirePermission('approve_leave'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await LeaveService.rejectLeave(parseInt(req.params.id, 10), req.user.id);
    res.json({ message: 'Leave request rejected' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/leaves/top-up-quota', authenticateToken, requirePermission('manage_leave_quota'), async (req: Request, res: Response) => {
  try {
    const { userId, additionalDays } = req.body;
    const newQuota = await LeaveService.topUpQuota(userId, additionalDays);
    res.json({ message: 'Leave quota updated', newQuota });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// PAYROLL ROUTES
console.log('[Routes] Registering payroll routes...');
router.get('/payroll', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  console.log('[Routes] GET /payroll called, user:', req.user?.id);
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    let records;
    if (hasPermission(req.user.permissions, 'manage_payroll')) {
      records = await PayrollRepository.findAll();
    } else {
      records = await PayrollRepository.findByUserId(req.user.id);
    }
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/payroll', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = await PayrollRepository.create(req.body);
    res.status(201).json({ id, message: 'Payroll record created successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/payroll/generate-all', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const period = req.body.period || '2026-08';
    const users = await UserRepository.findAll();

    for (const u of users) {
      const pos = (u.position || '').toLowerCase();
      let base = 8500000;
      let allow = 1500000;
      if (pos.includes('director') || pos.includes('vp') || pos.includes('head')) { base = 25000000; allow = 5000000; }
      else if (pos.includes('manager') || pos.includes('lead')) { base = 16000000; allow = 3000000; }
      else if (pos.includes('senior') || pos.includes('architect')) { base = 12000000; allow = 2000000; }
      else if (pos.includes('specialist') || pos.includes('developer') || pos.includes('engineer')) { base = 9500000; allow = 1500000; }

      const bpjs = Math.round(base * 0.05);
      const net = (base + allow + 500000) - (bpjs + 50000);

      await PayrollRepository.create({
        user_id: u.id,
        period,
        base_salary: base,
        allowance: allow,
        overtime_pay: 500000,
        sick_deduction: 0,
        absent_deduction: 0,
        late_deduction: 50000,
        tax_bpjs_deduction: bpjs,
        net_salary: net
      });
    }

    res.status(201).json({ message: `Slip gaji periode ${period} berhasil diterbitkan untuk ${users.length} karyawan.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// KPI ROUTES
router.get('/kpi', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    let kpis;
    if (hasPermission(req.user.permissions, 'manage_kpi')) {
      kpis = await KPIRepository.findAll();
    } else {
      kpis = await KPIRepository.findByUserId(req.user.id);
    }
    res.json(kpis);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/kpi', authenticateToken, requirePermission('manage_kpi'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const kpiId = await KPIRepository.create({ ...req.body, evaluator_id: req.user.id });
    res.status(201).json({ id: kpiId, message: 'KPI record created' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// BRANCHES ROUTES
router.get('/branches', authenticateToken, async (req: Request, res: Response) => {
  try {
    const branches = await BranchRepository.findAll();
    res.json(branches);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/branches', authenticateToken, requirePermission('manage_settings'), async (req: Request, res: Response) => {
  try {
    const branchId = await BranchRepository.create(req.body);
    const newBranch = await BranchRepository.findById(branchId);
    res.status(201).json(newBranch);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/branches/:id', authenticateToken, requirePermission('manage_settings'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await BranchRepository.update(id, req.body);
    const updated = await BranchRepository.findById(id);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/branches/:id', authenticateToken, requirePermission('manage_settings'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await BranchRepository.delete(id);
    res.json({ message: 'Branch deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// DOCUMENTS ROUTES
router.get('/documents/:userId', authenticateToken, async (req: Request, res: Response) => {
  try {
    const docs = await DocumentRepository.findByUserId(parseInt(req.params.userId, 10));
    res.json(docs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/documents', authenticateToken, async (req: Request, res: Response) => {
  try {
    const docId = await DocumentRepository.create(req.body);
    res.status(201).json({ id: docId, message: 'Document saved successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/documents/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await DocumentRepository.delete(id);
    res.json({ message: 'Document deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ASSETS ROUTES
router.get('/assets', authenticateToken, async (req: Request, res: Response) => {
  try {
    const assets = await AssetRepository.findAll();
    res.json(assets);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/assets', authenticateToken, requirePermission('manage_assets'), async (req: Request, res: Response) => {
  try {
    const assetId = await AssetRepository.create(req.body);
    res.status(201).json({ id: assetId, message: 'Asset added' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/assets/:id/assign', authenticateToken, requirePermission('manage_assets'), async (req: Request, res: Response) => {
  try {
    const { user_id, return_date } = req.body;
    await AssetRepository.assign(parseInt(req.params.id, 10), user_id, return_date);
    res.json({ message: 'Asset assigned' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ANNOUNCEMENTS ROUTES
router.get('/announcements', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await AnnouncementRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/announcements', authenticateToken, requirePermission('manage_announcements'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = await AnnouncementRepository.create({ ...req.body, author_id: req.user.id });
    res.status(201).json({ id, message: 'Announcement published' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// SETTINGS ROUTES
router.get('/settings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const settings = await SettingsRepository.getAll();
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/settings', authenticateToken, requirePermission('manage_settings'), async (req: Request, res: Response) => {
  try {
    const { office_lat, office_lng, max_distance_km, company_name } = req.body;
    if (office_lat) await SettingsRepository.set('office_lat', office_lat);
    if (office_lng) await SettingsRepository.set('office_lng', office_lng);
    if (max_distance_km) await SettingsRepository.set('max_distance_km', max_distance_km);
    if (company_name) await SettingsRepository.set('company_name', company_name);
    res.json({ message: 'Settings saved' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// NOTIFICATION ROUTES
router.get('/notifications', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const list = await NotificationRepository.findByUserId(req.user.id);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/notifications/mark-read', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    await NotificationRepository.markAllRead(req.user.id);
    res.json({ message: 'Notifications marked as read' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// SHIFTS ROUTES
router.get('/shifts', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await ShiftRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/shifts', authenticateToken, requirePermission('manage_settings'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = await ShiftRepository.create(req.body);
    await AuditLogRepository.create({
      user_id: req.user?.id,
      user_name: req.user?.email,
      action: 'CREATE_SHIFT',
      entity: 'Shifts',
      details: `Shift created: ${req.body.name} (${req.body.start_time}-${req.body.end_time})`
    });
    res.status(201).json({ id, message: 'Shift created successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/shifts/:id', authenticateToken, requirePermission('manage_settings'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await ShiftRepository.update(id, req.body);
    res.json({ message: 'Shift updated successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/shifts/:id', authenticateToken, requirePermission('manage_settings'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await ShiftRepository.delete(id);
    res.json({ message: 'Shift deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// OVERTIME ROUTES
router.get('/overtime', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await OvertimeRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/overtime/my', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const list = await OvertimeRepository.findByUserId(req.user.id);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/overtime', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = await OvertimeRepository.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ id, message: 'Overtime request submitted' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/overtime/:id/approve', authenticateToken, requirePermission('approve_leave'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = parseInt(req.params.id, 10);
    await OvertimeRepository.updateStatus(id, 'APPROVED', req.user.id);
    res.json({ message: 'Overtime request approved' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/overtime/:id/reject', authenticateToken, requirePermission('approve_leave'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = parseInt(req.params.id, 10);
    await OvertimeRepository.updateStatus(id, 'REJECTED', req.user.id);
    res.json({ message: 'Overtime request rejected' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// REIMBURSEMENT ROUTES
router.get('/reimbursements', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await ReimbursementRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/reimbursements/my', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const list = await ReimbursementRepository.findByUserId(req.user.id);
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/reimbursements', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = await ReimbursementRepository.create({ ...req.body, user_id: req.user.id });
    res.status(201).json({ id, message: 'Reimbursement claim submitted' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/reimbursements/:id/approve', authenticateToken, requirePermission('manage_payroll'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = parseInt(req.params.id, 10);
    await ReimbursementRepository.updateStatus(id, 'APPROVED', req.user.id);
    res.json({ message: 'Reimbursement approved' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/reimbursements/:id/reject', authenticateToken, requirePermission('manage_payroll'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const id = parseInt(req.params.id, 10);
    await ReimbursementRepository.updateStatus(id, 'REJECTED', req.user.id);
    res.json({ message: 'Reimbursement rejected' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// RECRUITMENT ROUTES
router.get('/recruitment/jobs', authenticateToken, async (req: Request, res: Response) => {
  try {
    const jobs = await RecruitmentRepository.findAllJobs();
    res.json(jobs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recruitment/jobs', authenticateToken, requirePermission('manage_users'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = await RecruitmentRepository.createJob(req.body);
    res.status(201).json({ id, message: 'Job posting created' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/recruitment/applicants', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await RecruitmentRepository.findAllApplicants();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/recruitment/applicants', async (req: Request, res: Response) => {
  try {
    const id = await RecruitmentRepository.createApplicant(req.body);
    res.status(201).json({ id, message: 'Application submitted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/recruitment/applicants/:id/status', authenticateToken, requirePermission('manage_users'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status } = req.body;
    await RecruitmentRepository.updateApplicantStatus(id, status);
    res.json({ message: 'Applicant status updated' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// AUDIT LOGS ROUTES
router.get('/audit-logs', authenticateToken, requirePermission('manage_settings'), async (req: Request, res: Response) => {
  try {
    const logs = await AuditLogRepository.findAll();
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// REPORT EXPORT ROUTE
router.get('/reports/summary', authenticateToken, async (req: Request, res: Response) => {
  try {
    const [employees, attendance, leaves, payroll] = await Promise.all([
      UserRepository.findAll(),
      AttendanceRepository.findAll(),
      LeaveRepository.findAll(),
      PayrollRepository.findAll()
    ]);
    res.json({
      generated_at: new Date().toISOString(),
      summary: {
        total_employees: employees.length,
        total_attendance_records: attendance.length,
        total_leave_requests: leaves.length,
        total_payroll_runs: payroll.length
      },
      employees,
      attendance,
      leaves,
      payroll
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// MEETING ROOMS & SCHEDULES ROUTES
router.get('/meeting-rooms', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await MeetingRoomRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/meeting-rooms', authenticateToken, requirePermission('manage_settings'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = await MeetingRoomRepository.create(req.body);
    res.status(201).json({ id, message: 'Meeting room created' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/schedules', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await MeetingScheduleRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/schedules', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { title, room_id, date, start_time, end_time, meeting_link, description } = req.body;

    if (!title || !date || !start_time || !end_time) {
      return res.status(400).json({ error: 'Title, date, start time, and end time are required' });
    }

    // Conflict Check if room_id is specified
    if (room_id) {
      const hasConflict = await MeetingScheduleRepository.checkConflict(room_id, date, start_time, end_time);
      if (hasConflict) {
        return res.status(409).json({
          error: 'Jadwal Bentrok! Ruang rapat ini sudah dipesan oleh tim lain pada jam tersebut.'
        });
      }
    }

    const id = await MeetingScheduleRepository.create({
      title,
      room_id,
      user_id: req.user.id,
      date,
      start_time,
      end_time,
      meeting_link,
      description
    });

    await AuditLogRepository.create({
      user_id: req.user.id,
      user_name: req.user.email,
      action: 'BOOK_MEETING_ROOM',
      entity: 'Schedules',
      details: `Booked meeting: "${title}" on ${date} (${start_time}-${end_time})`
    });

    res.status(201).json({ id, message: 'Jadwal rapat & reservasi ruangan berhasil dibuat' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/schedules/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await MeetingScheduleRepository.cancel(id);
    res.json({ message: 'Jadwal rapat dibatalkan' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// OFFBOARDING & WARNING LETTERS ROUTES
router.get('/offboarding/resignations', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await OffboardingRepository.findAllResignations();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/offboarding/resignations', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { reason, notice_date, effective_date, exit_clearance_notes } = req.body;
    const id = await OffboardingRepository.createResignation({
      user_id: req.user.id,
      reason,
      notice_date,
      effective_date,
      exit_clearance_notes
    });
    res.status(201).json({ id, message: 'Pengajuan resign berhasil dikirim' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.patch('/offboarding/resignations/:id/status', authenticateToken, requirePermission('manage_users'), async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { status, notes } = req.body;
    await OffboardingRepository.updateResignationStatus(id, status, notes);
    res.json({ message: 'Status offboarding berhasil diperbarui' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/offboarding/warnings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await WarningRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/offboarding/warnings', authenticateToken, requirePermission('manage_users'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { user_id, level, reason, issued_date } = req.body;
    const id = await WarningRepository.create({
      user_id,
      level,
      reason,
      issued_by: req.user.email,
      issued_date
    });
    res.status(201).json({ id, message: 'Surat peringatan (SP) berhasil diterbitkan' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// TRAININGS & CERTIFICATIONS ROUTES
router.get('/trainings', authenticateToken, async (req: Request, res: Response) => {
  try {
    const list = await TrainingRepository.findAll();
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/trainings', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { title, provider, category, start_date, end_date, certification_url, expiry_date } = req.body;
    const id = await TrainingRepository.create({
      user_id: req.user.id,
      title,
      provider,
      category,
      start_date,
      end_date,
      certification_url,
      expiry_date
    });
    res.status(201).json({ id, message: 'Data pelatihan & sertifikasi berhasil disimpan' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.delete('/trainings/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    await TrainingRepository.delete(id);
    res.json({ message: 'Data pelatihan berhasil dihapus' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ORG CHART HIERARCHY TREE ROUTE
router.get('/org-chart', authenticateToken, async (req: Request, res: Response) => {
  try {
    const tree = await OrgChartRepository.getTree();
    res.json(tree);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
