/**
 * Security Service for Web Application
 * Handles Rooted/Jailbroken environment detection, XSS sanitization, and Token Security
 */

export interface SecurityStatus {
  isSecure: boolean;
  isRootedOrJailbroken: boolean;
  isMockLocationActive: boolean;
  warnings: string[];
}

export const checkDeviceSecurity = (): SecurityStatus => {
  const warnings: string[] = [];
  let isRootedOrJailbroken = false;
  let isMockLocationActive = false;

  if (typeof window !== 'undefined') {
    // 1. Check User Agent for Known Rooting / Jailbreak signatures or Mocking Tools
    const ua = navigator.userAgent.toLowerCase();
    const suspiciousSignatures = [
      'cydia',
      'xposed',
      'substrate',
      'frida',
      'magisk',
      'superuser',
      'kingroot',
      'fakelocation',
      'gpsspoofer'
    ];

    for (const sig of suspiciousSignatures) {
      if (ua.includes(sig)) {
        isRootedOrJailbroken = true;
        warnings.push(`Signatur keamanan mencurigakan terdeteksi (${sig})`);
      }
    }

    // 2. Check for Geolocation Mocking / High Accuracy Latency Anomaly
    if ('geolocation' in navigator) {
      // Checked dynamically during attendance clock-in
    }
  }

  return {
    isSecure: !isRootedOrJailbroken && !isMockLocationActive,
    isRootedOrJailbroken,
    isMockLocationActive,
    warnings
  };
};

export const sanitizeInput = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const validateTokenIntegrity = (token: string | null): boolean => {
  if (!token) return false;
  const parts = token.split('.');
  return parts.length === 3;
};
