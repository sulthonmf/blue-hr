import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
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
  OrgChartRepository
} from '../repositories';
import { isWithinGeofence } from '../domain/math';
import { User, LeaveRequest } from '../types';

export const JWT_SECRET = process.env.JWT_SECRET || 'bluehr_super_secret_jwt_key_2026';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'bluehr_super_secret_refresh_jwt_key_2026';

export const AuthService = {
  login: async (email: string, password: string) => {
    const user = await UserRepository.findByEmail(email);
    if (!user || !user.password_hash) throw new Error('Invalid email or password');
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error('Invalid email or password');

    const permissions = JSON.parse((user.permissions as unknown as string) || '[]');
    
    // Short-lived Access Token (15m)
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id, role_name: user.role_name, permissions },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Refresh Token (7d)
    const refreshToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_name: user.role_name,
        position: user.position,
        department: user.department,
        leave_quota: user.leave_quota,
        permissions
      }
    };
  },

  refreshAccessToken: async (refreshToken: string) => {
    if (!refreshToken) throw new Error('Refresh token is required');
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { id: number; email: string };
    const user = await UserRepository.findById(decoded.id);
    if (!user) throw new Error('User not found');

    const permissions = JSON.parse((user.permissions as unknown as string) || '[]');
    
    const newToken = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id, role_name: user.role_name, permissions },
      JWT_SECRET,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    return { token: newToken, refreshToken: newRefreshToken, user };
  },

  registerEmployee: async (data: Partial<User> & { password?: string }) => {
    if (!data.email) throw new Error('Email is required');
    const existing = await UserRepository.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(data.password || 'password123', salt);

    const userId = await UserRepository.create({
      ...data,
      password_hash
    });
    return UserRepository.findById(userId);
  },

  resetPassword: async (userId: number, newPassword: string) => {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);
    await UserRepository.updatePassword(userId, password_hash);
    return true;
  }
};

export const AttendanceService = {
  clockIn: async (userId: number, userLat: number, userLng: number, photoUrl?: string, notes?: string) => {
    const settings = await SettingsRepository.getAll();
    const officeLat = parseFloat(settings.office_lat || '-6.2088');
    const officeLng = parseFloat(settings.office_lng || '106.8456');
    const maxDistance = parseFloat(settings.max_distance_km || '5.0');

    const geoResult = isWithinGeofence(userLat, userLng, officeLat, officeLng, maxDistance);
    const status = geoResult.isAllowed ? 'ON_TIME' : 'OUT_OF_BOUNDS';

    const attendanceId = await AttendanceRepository.create({
      user_id: userId,
      latitude: userLat,
      longitude: userLng,
      distance_km: geoResult.distanceKm,
      status,
      photo_url: photoUrl,
      notes: notes || (geoResult.isAllowed ? 'Location validated' : `Out of bounds (${geoResult.distanceKm} km away)`)
    });

    // Auto notification
    try {
      await NotificationRepository.create({
        user_id: userId,
        type: 'ATTENDANCE',
        title: status === 'ON_TIME' ? 'Clock In Berhasil' : 'Clock In (Di Luar Radius)',
        desc: `Presensi masuk terverifikasi pada jarak ${geoResult.distanceKm} km dari kantor.`
      });
    } catch (e) {}

    return {
      id: attendanceId,
      status,
      distanceKm: geoResult.distanceKm,
      isAllowed: geoResult.isAllowed,
      maxDistanceKm: maxDistance
    };
  },

  clockOut: async (userId: number) => {
    const todayRecord = await AttendanceRepository.findByUserIdToday(userId);
    if (!todayRecord) throw new Error('No active clock-in found for today');
    await AttendanceRepository.updateCheckOut(todayRecord.id);
    return true;
  }
};

export const LeaveService = {
  requestLeave: async (
    userId: number,
    leave_type: LeaveRequest['leave_type'],
    start_date: string,
    end_date: string,
    duration_days: number,
    reason: string
  ) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.leave_quota < duration_days) {
      throw new Error(`Insufficient leave quota. Requested: ${duration_days} days, Available: ${user.leave_quota} days`);
    }

    const leaveId = await LeaveRepository.create({
      user_id: userId,
      leave_type,
      start_date,
      end_date,
      duration_days,
      reason
    });

    try {
      await NotificationRepository.create({
        user_id: userId,
        type: 'LEAVE',
        title: 'Pengajuan Cuti Terkirim',
        desc: `Pengajuan cuti ${leave_type} (${duration_days} hari) menunggu persetujuan HR Lead.`
      });
    } catch (e) {}

    return leaveId;
  },

  approveLeaveL1: async (leaveId: number, approverId: number) => {
    const leave = await LeaveRepository.findById(leaveId);
    if (!leave) throw new Error('Leave request not found');
    if (leave.status !== 'PENDING') throw new Error('Leave request is not in PENDING state');

    await LeaveRepository.updateStatusL1(leaveId, approverId);

    try {
      await NotificationRepository.create({
        user_id: leave.user_id,
        type: 'LEAVE',
        title: 'Persetujuan Cuti Tahap 1 (Manager)',
        desc: `Pengajuan cuti ${leave.leave_type} telah disetujui Manager. Menunggu persetujuan HR/Direksi.`
      });
    } catch (e) {}

    return true;
  },

  approveLeave: async (leaveId: number, approverId: number) => {
    const leave = await LeaveRepository.findById(leaveId);
    if (!leave) throw new Error('Leave request not found');
    if (leave.status === 'APPROVED' || leave.status === 'REJECTED') throw new Error('Leave request already finalized');

    const user = await UserRepository.findById(leave.user_id);
    if (!user) throw new Error('User not found');
    const newQuota = Math.max(0, user.leave_quota - leave.duration_days);

    await UserRepository.updateLeaveQuota(leave.user_id, newQuota);
    await LeaveRepository.updateStatus(leaveId, 'APPROVED', approverId);

    try {
      await NotificationRepository.create({
        user_id: leave.user_id,
        type: 'LEAVE',
        title: 'Pengajuan Cuti Disetujui (Final)',
        desc: `Pengajuan Cuti ${leave.leave_type} (${leave.duration_days} hari) telah disetujui HR & Direksi.`
      });
    } catch (e) {}

    return true;
  },

  rejectLeave: async (leaveId: number, approverId: number) => {
    const leave = await LeaveRepository.findById(leaveId);
    await LeaveRepository.updateStatus(leaveId, 'REJECTED', approverId);

    if (leave) {
      try {
        await NotificationRepository.create({
          user_id: leave.user_id,
          type: 'LEAVE',
          title: 'Pengajuan Cuti Ditolak',
          desc: `Pengajuan Cuti ${leave.leave_type} ditolak oleh HR Lead.`
        });
      } catch (e) {}
    }

    return true;
  },

  topUpQuota: async (userId: number, additionalDays: number) => {
    const user = await UserRepository.findById(userId);
    if (!user) throw new Error('User not found');
    const newQuota = user.leave_quota + parseInt(String(additionalDays), 10);
    await UserRepository.updateLeaveQuota(userId, newQuota);
    return newQuota;
  }
};

import { EmailService } from './EmailService';
import { MidtransService } from './MidtransService';
import { OrderRepository } from '../repositories';

// Re-export repositories & services for direct use in routes
export {
  EmailService,
  MidtransService,
  OrderRepository,
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
  OrgChartRepository
};
