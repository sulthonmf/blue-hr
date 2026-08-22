import React, { useState } from 'react';
import { useHRStore } from '../../stores/useHRStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { PlusCircle, X } from 'lucide-react';

export const LeaveTopUpModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { employees, topUpQuota } = useHRStore();
  const { t } = useLanguageStore();
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [additionalDays, setAdditionalDays] = useState(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return alert('Pilih karyawan terlebih dahulu');
    setLoading(true);
    try {
      await topUpQuota(Number(selectedUserId), additionalDays);
      alert('Kuota cuti berhasil ditambahkan!');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-md rounded-[28px] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2 font-display">
          <PlusCircle className="text-emerald-600 dark:text-emerald-400" size={20} />
          {t.leaveTopUpTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">HR/Admin dapat menambahkan jatah kuota cuti ekstra</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.selectEmployee}</label>
            <select
              required
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            >
              <option value="">-- {t.selectEmployee} --</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.position}) - {t.leaveBalance}: {emp.leave_quota} {t.days}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Jumlah Hari Tambahan</label>
            <input
              type="number"
              min="1"
              max="30"
              value={additionalDays}
              onChange={(e) => setAdditionalDays(Number(e.target.value))}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-3 rounded-full text-xs shadow-md transition-all"
          >
            {loading ? t.processing : t.save}
          </button>
        </form>
      </div>
    </div>
  );
};
