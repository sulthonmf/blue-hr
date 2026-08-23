import { describe, it, expect } from 'vitest';
import { checkPasswordRules } from '../domain/math';

describe('Password Security Rules Validation', () => {
  it('should reject weak passwords missing rules', () => {
    expect(checkPasswordRules('123456').isValid).toBe(false);
    expect(checkPasswordRules('password').isValid).toBe(false);
    expect(checkPasswordRules('Password123').isValid).toBe(false); // missing special char
  });

  it('should accept passwords satisfying all 5 security rules', () => {
    const result = checkPasswordRules('Password123!');
    expect(result.minLength).toBe(true);
    expect(result.hasUpper).toBe(true);
    expect(result.hasLower).toBe(true);
    expect(result.hasNumber).toBe(true);
    expect(result.hasSpecial).toBe(true);
    expect(result.isValid).toBe(true);
  });
});
