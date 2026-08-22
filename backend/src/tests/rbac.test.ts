import { describe, it, expect } from 'vitest';
import { hasPermission } from '../domain/math';

describe('Dynamic RBAC Permission Verification (TypeScript)', () => {
  it('should grant access to admin with "all" permission wildcard', () => {
    const adminPermissions = ['all'];
    expect(hasPermission(adminPermissions, 'manage_users')).toBe(true);
    expect(hasPermission(adminPermissions, 'custom_future_permission')).toBe(true);
  });

  it('should grant access if required permission is explicitly present', () => {
    const hrPermissions = ['manage_users', 'approve_leave', 'manage_kpi'];
    expect(hasPermission(hrPermissions, 'approve_leave')).toBe(true);
    expect(hasPermission(hrPermissions, 'manage_kpi')).toBe(true);
  });

  it('should deny access if required permission is missing', () => {
    const employeePermissions = ['view_own_attendance', 'clock_in_out'];
    expect(hasPermission(employeePermissions, 'manage_roles')).toBe(false);
    expect(hasPermission(employeePermissions, 'manage_settings')).toBe(false);
  });
});
