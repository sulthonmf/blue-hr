import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { LeaveTopUpModal } from '../components/modules/LeaveTopUpModal';
import { CalendarDays, PlusCircle, CheckCircle2, XCircle } from 'lucide-react';

export const LeavePage: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const { leaves, requestLeave, approveLeaveL1, approveLeave, rejectLeave } = useHRStore();
  const { t } = useLanguageStore();
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const [leaveType, setLeaveType] = useState('ANNUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const canApprove = hasPermission('approve_leave');
  const canTopUp = hasPermission('manage_leave_quota');

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert('Pilih tanggal mulai dan selesai');
    setLoading(true);
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      await requestLeave({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        duration_days: durationDays,
        reason
      });
      alert('Pengajuan cuti berhasil dikirim!');
      setReason('');
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <CalendarDays className="text-[#2563eb]" size={24} />
              {t.leave}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.leaveSub}
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase font-display">{t.leaveBalance}</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display">{user?.leave_quota ?? 12} {t.days}</h3>
            </div>

            {canTopUp && (
              <button
                onClick={() => setIsTopUpOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
              >
                <PlusCircle size={16} />
                {t.topUpHR}
              </button>
            )}
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 font-display">{t.requestLeaveForm}</h3>
          <form onSubmit={handleRequestSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.leaveType}</label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
              >
                <option value="ANNUAL">{t.annualLeave}</option>
                <option value="SICK">{t.sickLeave}</option>
                <option value="UNPAID">{t.unpaidLeave}</option>
                <option value="MATERNITY">{t.maternityLeave}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.startDate}</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.endDate}</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.leaveReason}</label>
              <input
                type="text"
                required
                placeholder="Keperluan keluarga, dll."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-full transition-all shadow-md"
            >
              {loading ? t.processing : t.submit}
            </button>
          </form>
        </div>
      </div>

      {/* Leave Queue & History */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">Daftar Pengajuan & Persetujuan Cuti</h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Pemohon</th>
                <th className="p-3.5">Divisi</th>
                <th className="p-3.5">{t.leaveType}</th>
                <th className="p-3.5">Durasi</th>
                <th className="p-3.5">{t.leaveReason}</th>
                <th className="p-3.5">Status</th>
                {canApprove && <th className="p-3.5 text-right">Aksi HR</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {leaves.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">{item.user_name || user?.name}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">{item.department || 'Engineering'}</td>
                  <td className="p-3.5 font-bold text-[#2563eb]">{item.leave_type}</td>
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                    {item.duration_days} {t.days} ({item.start_date} - {item.end_date})
                  </td>
                  <td className="p-3.5 text-slate-500">{item.reason}</td>
                  <td className="p-3.5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                        : item.status === 'APPROVED_L1'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                        : item.status === 'REJECTED'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                    }`}>
                      {item.status === 'APPROVED'
                        ? '✔ Disetujui Final (HR)'
                        : item.status === 'APPROVED_L1'
                        ? '🔹 Disetujui L1 (Manager)'
                        : item.status === 'REJECTED'
                        ? '✖ Ditolak'
                        : '⏳ Menunggu Persetujuan L1'}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="p-3.5 text-right">
                      {item.status !== 'APPROVED' && item.status !== 'REJECTED' && (
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === 'PENDING' && (
                            <button
                              onClick={() => approveLeaveL1(item.id)}
                              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                              title="Setujui Tahap 1 (Manager)"
                            >
                              <CheckCircle2 size={12} />
                              Setujui L1 (Manager)
                            </button>
                          )}
                          <button
                            onClick={() => approveLeave(item.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                            title="Setujui Final (HR & Direksi)"
                          >
                            <CheckCircle2 size={12} />
                            Setujui Final (HR)
                          </button>
                          <button
                            onClick={() => rejectLeave(item.id)}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all"
                            title={t.reject}
                          >
                            <XCircle size={12} />
                            {t.reject}
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <LeaveTopUpModal isOpen={isTopUpOpen} onClose={() => setIsTopUpOpen(false)} />
    </div>
  );
};
