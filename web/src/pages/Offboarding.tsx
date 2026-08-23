import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { LogOut, AlertOctagon, Plus, FileText, CheckCircle2, XCircle, Clock, ShieldAlert, UserCheck } from 'lucide-react';

export const OffboardingPage: React.FC = () => {
  const { resignations, warnings, employees, requestResignation, updateResignationStatus, issueWarning } = useHRStore();
  const { user, hasPermission } = useAuthStore();
  const canManage = hasPermission('manage_users');

  const [activeTab, setActiveTab] = useState<'resign' | 'sp'>('resign');
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [isSpModalOpen, setIsSpModalOpen] = useState(false);

  const [resignData, setResignData] = useState({
    reason: '',
    notice_date: new Date().toISOString().split('T')[0],
    effective_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    exit_clearance_notes: 'Pengembalian Laptop, ID Card, & Akses Email'
  });

  const [spData, setSpData] = useState({
    user_id: employees[0]?.id || 1,
    level: 'SP1',
    reason: 'Keterlambatan berturut-turut dalam 1 bulan',
    issued_date: new Date().toISOString().split('T')[0]
  });

  const handleResignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestResignation(resignData);
      setIsResignModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal mengirim pengajuan resign');
    }
  };

  const handleSpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await issueWarning(spData);
      setIsSpModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal menerbitkan Surat Peringatan');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <LogOut className="text-rose-600" size={26} />
            <span>Offboarding & Surat Peringatan (SP)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manajemen pengajuan resign, Exit Clearance sheet, dan pencatatan Surat Peringatan karyawan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManage && (
            <button
              onClick={() => setIsSpModalOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-3.5 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all"
            >
              <AlertOctagon size={16} />
              <span>Terbitkan SP Baru</span>
            </button>
          )}

          <button
            onClick={() => setIsResignModalOpen(true)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            <span>Ajukan Resign Karyawan</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('resign')}
          className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all ${
            activeTab === 'resign'
              ? 'bg-[#2563eb] text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Pengajuan Resign & Exit Clearance ({resignations.length})
        </button>
        <button
          onClick={() => setActiveTab('sp')}
          className={`px-4 py-2 rounded-2xl font-extrabold text-xs transition-all ${
            activeTab === 'sp'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          Penerbitan SP (SP1 / SP2 / SP3) ({warnings.length})
        </button>
      </div>

      {/* Tab 1: Resignation List */}
      {activeTab === 'resign' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Daftar Offboarding & Resign</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">KARYAWAN</th>
                  <th className="p-3">ALASAN RESIGN</th>
                  <th className="p-3">TANGGAL NOTIF & EFEKTIF</th>
                  <th className="p-3">EXIT CLEARANCE NOTES</th>
                  <th className="p-3">STATUS</th>
                  {canManage && <th className="p-3 text-right">AKSI VERIFIKASI</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {resignations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      Belum ada pengajuan resign karyawan.
                    </td>
                  </tr>
                ) : (
                  resignations.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{r.user_name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs">{r.reason}</td>
                      <td className="p-3 font-mono text-slate-500">
                        <span className="font-bold">{r.notice_date}</span> ➔ {r.effective_date}
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">{r.exit_clearance_notes || '-'}</td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                            r.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-700'
                              : r.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="p-3 text-right">
                          {r.status === 'PENDING' && (
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => updateResignationStatus(r.id, 'APPROVED', 'Exit Clearance Disetujui')}
                                className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => updateResignationStatus(r.id, 'REJECTED', 'Ditolak Manajemen')}
                                className="px-2.5 py-1 bg-rose-600 text-white font-bold rounded-lg text-[10px]"
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
      )}

      {/* Tab 2: Warning Letters */}
      {activeTab === 'sp' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Pencatatan Surat Peringatan (SP)</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">LEVEL SP</th>
                  <th className="p-3">KARYAWAN</th>
                  <th className="p-3">ALASAN PENERBITAN SP</th>
                  <th className="p-3">DITERBITKAN OLEH</th>
                  <th className="p-3">TANGGAL SP</th>
                  <th className="p-3">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {warnings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-400">
                      Belum ada pencatatan Surat Peringatan (SP).
                    </td>
                  </tr>
                ) : (
                  warnings.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 font-black text-[11px] rounded-lg ${
                            w.level === 'SP3'
                              ? 'bg-rose-600 text-white'
                              : w.level === 'SP2'
                              ? 'bg-amber-500 text-white'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {w.level}
                        </span>
                      </td>
                      <td className="p-3 font-extrabold text-slate-900 dark:text-white">{w.user_name}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-300 max-w-xs">{w.reason}</td>
                      <td className="p-3 font-bold text-slate-500">{w.issued_by}</td>
                      <td className="p-3 font-mono text-slate-500">{w.issued_date}</td>
                      <td className="p-3 font-bold text-emerald-600">{w.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Resign Form */}
      {isResignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">Pengajuan Resign Karyawan</h3>
            <form onSubmit={handleResignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Alasan Resign</label>
                <textarea
                  required
                  rows={2}
                  value={resignData.reason}
                  onChange={(e) => setResignData({ ...resignData, reason: e.target.value })}
                  placeholder="Melanjutkan karir profesional..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tanggal Pemberitahuan (Notice Date)</label>
                <input
                  type="date"
                  required
                  value={resignData.notice_date}
                  onChange={(e) => setResignData({ ...resignData, notice_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tanggal Efektif Resign</label>
                <input
                  type="date"
                  required
                  value={resignData.effective_date}
                  onChange={(e) => setResignData({ ...resignData, effective_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Catatan Exit Clearance</label>
                <input
                  type="text"
                  value={resignData.exit_clearance_notes}
                  onChange={(e) => setResignData({ ...resignData, exit_clearance_notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsResignModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold shadow-md hover:bg-rose-700">
                  Kirim Pengajuan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal SP Form */}
      {isSpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">Penerbitan Surat Peringatan (SP)</h3>
            <form onSubmit={handleSpSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Pilih Karyawan</label>
                <select
                  value={spData.user_id}
                  onChange={(e) => setSpData({ ...spData, user_id: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.position} - {emp.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Tingkat Surat Peringatan</label>
                <select
                  value={spData.level}
                  onChange={(e) => setSpData({ ...spData, level: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-bold"
                >
                  <option value="SP1">SP 1 (Peringatan Pertama)</option>
                  <option value="SP2">SP 2 (Peringatan Kedua)</option>
                  <option value="SP3">SP 3 (Peringatan Terakhir)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Alasan Penerbitan SP</label>
                <textarea
                  required
                  rows={2}
                  value={spData.reason}
                  onChange={(e) => setSpData({ ...spData, reason: e.target.value })}
                  placeholder="Pelanggaran disiplin operasional..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsSpModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold shadow-md hover:bg-amber-700">
                  Terbitkan SP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
