import { describe, it, expect } from 'vitest';

function calculateNewQuota(currentQuota, daysRequested, action, topUpDays = 0) {
  if (action === 'DEDUCT') {
    if (currentQuota < daysRequested) {
      throw new Error('Insufficient leave quota balance');
    }
    return currentQuota - daysRequested;
  }
  if (action === 'TOP_UP') {
    return currentQuota + topUpDays;
  }
  return currentQuota;
}

describe('Leave Quota & HR Top-Up Logic', () => {
  it('should deduct quota correctly when balance is sufficient', () => {
    const updated = calculateNewQuota(12, 3, 'DEDUCT');
    expect(updated).toBe(9);
  });

  it('should throw error when requesting more leave than remaining quota', () => {
    expect(() => calculateNewQuota(2, 5, 'DEDUCT')).toThrow('Insufficient leave quota balance');
  });

  it('should allow HR/Admin to top up quota balance', () => {
    const toppedUp = calculateNewQuota(9, 0, 'TOP_UP', 5);
    expect(toppedUp).toBe(14);
  });
});
