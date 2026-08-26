import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../stores/useLanguageStore';
import { ArrowLeftRight, Check, X, Calendar, User } from 'lucide-react';
import { client } from '../api/client';

interface ShiftSwap {
  id: number;
  requester_name: string;
  target_name: string;
  original_date: string;
  target_date: string;
  status: string;
}

export const ShiftSwapPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [swaps, setSwaps] = useState<ShiftSwap[]>([]);

  const fetchSwaps = async () => {
    try {
      const res = await client.get('/api/v1/shifts/swap');
      setSwaps(res.data);
    } catch {
      setSwaps([
        { id: 1, requester_name: 'Budi Santoso', target_name: 'Siti Aminah', original_date: '2026-09-01', target_date: '2026-09-02', status: 'PENDING' }
      ]);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await client.post(`/api/v1/shifts/swap/${id}/approve`);
      fetchSwaps();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <ArrowLeftRight size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.shiftSwapTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.shiftSwapSub}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {swaps.map((item) => (
          <div key={item.id} className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-400">Permohonan ID #{item.id}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                item.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="flex items-center justify-around gap-2 text-center">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400">{t.requester}</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.requester_name}</p>
                <p className="text-[10px] text-slate-500">{item.original_date}</p>
              </div>
              <ArrowLeftRight size={18} className="text-teal-600 dark:text-teal-400 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400">{t.targetColleague}</p>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{item.target_name}</p>
                <p className="text-[10px] text-slate-500">{item.target_date}</p>
              </div>
            </div>
            {item.status === 'PENDING' && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleApprove(item.id)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all"
                >
                  <Check size={14} />
                  <span>{t.approve}</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
