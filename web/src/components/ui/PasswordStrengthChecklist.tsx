import React from 'react';
import { Check, X, ShieldAlert } from 'lucide-react';

export interface PasswordRulesStatus {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export function checkPasswordRules(password: string): PasswordRulesStatus {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
  };
}

export const PasswordStrengthChecklist: React.FC<{ password: string }> = ({ password }) => {
  const rules = checkPasswordRules(password);

  const ruleItems = [
    { label: 'Minimal 8 karakter', met: rules.minLength },
    { label: 'Minimal 1 huruf besar (A-Z)', met: rules.hasUpper },
    { label: 'Minimal 1 huruf kecil (a-z)', met: rules.hasLower },
    { label: 'Minimal 1 angka (0-9)', met: rules.hasNumber },
    { label: 'Minimal 1 karakter khusus / simbol (!@#$%)', met: rules.hasSpecial }
  ];

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 text-xs">
      <div className="flex items-center justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
        <span className="flex items-center gap-1.5">
          <ShieldAlert size={14} className={rules.isValid ? 'text-emerald-500' : 'text-amber-500'} />
          <span>Kriteria Keamanan Sandi</span>
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${rules.isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {rules.isValid ? 'STANDAR TERPENUHI' : 'BELUM SESUAI'}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-1">
        {ruleItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-[11px]">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${item.met ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
              {item.met ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
            </div>
            <span className={item.met ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
