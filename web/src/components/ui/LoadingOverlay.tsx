import React from 'react';
import { Loader2 } from 'lucide-react';
import { useHRStore } from '../../stores/useHRStore';

export const LoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useHRStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-3">
        <Loader2 size={32} className="text-[#2563eb] animate-spin" />
        <p className="text-sm font-bold text-slate-900 dark:text-white">
          {loadingMessage || 'Memproses...'}
        </p>
        <p className="text-xs text-slate-400">Mohon tunggu sebentar</p>
      </div>
    </div>
  );
};
