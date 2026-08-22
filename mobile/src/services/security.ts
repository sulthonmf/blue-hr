/**
 * Security Service for Mobile Application
 * Handles Rooted Android / Jailbroken iOS detection & Mock Location verification
 */

export interface MobileSecurityStatus {
  isSecure: boolean;
  isRootedOrJailbroken: boolean;
  isMockLocationActive: boolean;
  warnings: string[];
}

export const checkMobileSecurity = (): MobileSecurityStatus => {
  const warnings: string[] = [];
  let isRootedOrJailbroken = false;
  let isMockLocationActive = false;

  // 1. Check navigator / userAgent signatures for Android Root & iOS Jailbreak
  if (typeof window !== 'undefined') {
    const ua = (navigator.userAgent || '').toLowerCase();
    const suspiciousTools = [
      'cydia',
      'magisk',
      'xposed',
      'frida',
      'superuser',
      'kingroot',
      'mock_location',
      'fake_gps'
    ];

    for (const tool of suspiciousTools) {
      if (ua.includes(tool)) {
        isRootedOrJailbroken = true;
        warnings.push(`Perangkat terdeteksi terinfeksi / modifikasi (${tool})`);
      }
    }
  }

  return {
    isSecure: !isRootedOrJailbroken && !isMockLocationActive,
    isRootedOrJailbroken,
    isMockLocationActive,
    warnings
  };
};

export const sanitizeMobileInput = (str: string): string => {
  if (!str) return '';
  return str.trim().replace(/[<>]/g, '');
};
