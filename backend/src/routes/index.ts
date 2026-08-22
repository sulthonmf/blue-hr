import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  AuthService,
  AttendanceService,
  LeaveService,
  UserRepository,
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
  JWT_SECRET
} from '../services';
import { hasPermission } from '../domain/math';

console.log('[Routes] Module loading... PayrollRepository:', typeof PayrollRepository);

const router = express.Router();

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
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
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
    await AuthService.resetPassword(userId, newPassword);
    res.json({ message: 'Password reset successfully' });
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

router.post('/payroll', authenticateToken, requirePermission('manage_payroll'), async (req: Request, res: Response) => {
  try {
    const id = await PayrollRepository.create(req.body);
    res.status(201).json({ id, message: 'Payroll record created successfully' });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
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
    res.status(201).json({ id: docId, message: 'Document saved' });
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

export default router;
