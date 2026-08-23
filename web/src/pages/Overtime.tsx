import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { Clock, Plus, CheckCircle, XCircle, AlertCircle, X, DollarSign, Calendar } from 'lucide-react';

export const OvertimePage: React.FC = () => {
  const { overtimes, requestOvertime, approveOvertime, rejectOvertime } = useHRStore();
  const { user, hasPermission } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    hours: 2,
    reason: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason) return;
    await requestOvertime(formData);
    setIsModalOpen(false);
    setFormData({ date: new Date().toISOString().split('T')[0], hours: 2, reason: '' });
  };

  const isHR = hasPermission('approve_leave') || user?.role_name === 'Admin' || user?.role_name === 'HR Manager';

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Clock className="text-purple-600" size={26} />
            <span>Pengajuan & Upah Lembur (SPL)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola pengajuan lembur karyawan, jam lembur, dan pencairan upah lembur ke payroll.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Ajukan Lembur (SPL)</span>
        </button>
      </div>

      {/* List Overtime Requests */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Daftar Pengajuan Lembur</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">KARYAWAN</th>
                <th className="p-3">TANGGAL</th>
                <th className="p-3">DURASI</th>
                <th className="p-3">ALASAN LEMBUR</th>
                <th className="p-3">ESTIMASI UPAH</th>
                <th className="p-3">STATUS</th>
                {isHR && <th className="p-3 text-right">AKSI</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {overtimes.length === 0 ? (
                <tr>
                  <td colSpan={isHR ? 7 : 6} className="p-6 text-center text-slate-400">
                    Belum ada pengajuan lembur tercatat.
                  </td>
                </tr>
              ) : (
                overtimes.map((ot) => (
                  <tr key={ot.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{ot.user_name || user?.name}</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{ot.date}</td>
                    <td className="p-3 font-extrabold text-purple-600">{ot.hours} Jam</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{ot.reason}</td>
                    <td className="p-3 font-mono font-bold text-emerald-600">Rp {(ot.total_pay || ot.hours * 50000).toLocaleString('id-ID')}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        ot.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        ot.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {ot.status}
                      </span>
                    </td>
                    {isHR && (
                      <td className="p-3 text-right">
                        {ot.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveOvertime(ot.id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={() => rejectOvertime(ot.id)}
                              className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold text-[11px] hover:bg-rose-700"
                            >
                              Tolak
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                Form Pengajuan Lembur (SPL)
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tanggal Lembur</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jumlah Jam Lembur</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="12"
                  required
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                />
                <p className="text-[10px] text-slate-400 mt-1">Tarif lembur standar: Rp 50.000 / jam (Estimasi: Rp {(formData.hours * 50000).toLocaleString('id-ID')})</p>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Alasan Lembur</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Menyelesaikan rilis fitur API backend enterprise..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold shadow-md hover:bg-purple-700">
                  Kirim SPL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
