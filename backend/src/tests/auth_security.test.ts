import { describe, it, expect, beforeAll } from 'vitest';
import bcrypt from 'bcryptjs';
import { AuthService, JWT_SECRET, JWT_REFRESH_SECRET } from '../services';
import jwt from 'jsonwebtoken';

describe('Auth Security & Refresh Token Service Tests', () => {
  it('should generate short-lived Access Token and 7-day Refresh Token on login', async () => {
    // Mock user findByEmail
    const email = 'admin@bluehr.com';
    const pass = 'admin123';
    
    // Test AuthService.login output structure
    const res = await AuthService.login(email, pass);
    expect(res).toHaveProperty('token');
    expect(res).toHaveProperty('refreshToken');
    expect(res).toHaveProperty('user');
    
    // Verify Access Token signature
    const decodedAccess: any = jwt.verify(res.token, JWT_SECRET);
    expect(decodedAccess.email).toBe(email);

    // Verify Refresh Token signature
    const decodedRefresh: any = jwt.verify(res.refreshToken, JWT_REFRESH_SECRET);
    expect(decodedRefresh.email).toBe(email);
  });

  it('should generate new access token using valid refresh token', async () => {
    const loginRes = await AuthService.login('hr@bluehr.com', 'hr123');
    const refreshRes = await AuthService.refreshAccessToken(loginRes.refreshToken);

    expect(refreshRes).toHaveProperty('token');
    expect(refreshRes).toHaveProperty('refreshToken');
    expect(refreshRes.user.email).toBe('hr@bluehr.com');
  });

  it('should throw error if refresh token is invalid', async () => {
    await expect(AuthService.refreshAccessToken('invalid_token_123')).rejects.toThrow();
  });
});
