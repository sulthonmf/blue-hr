import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { DollarSign, Plus, CheckCircle, XCircle, FileText, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

export const ReimbursementsPage: React.FC = () => {
  const { reimbursements, requestReimbursement, approveReimbursement, rejectReimbursement } = useHRStore();
  const { user, hasPermission } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'MEDICAL' as 'MEDICAL' | 'TRAVEL' | 'MEAL' | 'EQUIPMENT' | 'OTHER',
    amount: 150000,
    receipt_url: ''
  });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setFormData((prev) => ({ ...prev, receipt_url: evt.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || formData.amount <= 0) return;
    await requestReimbursement(formData);
    setIsModalOpen(false);
    setFormData({ title: '', category: 'MEDICAL', amount: 150000, receipt_url: '' });
    setFileName('');
  };

  const isPayrollAdmin = hasPermission('manage_payroll') || user?.role_name === 'Admin' || user?.role_name === 'HR Manager';

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <DollarSign className="text-emerald-600" size={26} />
            <span>Klaim Biaya & Reimbursement</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pengajuan penggantian biaya operasional, medis, transportasi dinas, dan perlengkapan karyawan.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Ajukan Reimbursement</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Daftar Klaim Reimbursement</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">KARYAWAN</th>
                <th className="p-3">JUDUL KLAIM</th>
                <th className="p-3">KATEGORI</th>
                <th className="p-3">NOMINAL (RP)</th>
                <th className="p-3">BUKTI NOTA</th>
                <th className="p-3">STATUS</th>
                {isPayrollAdmin && <th className="p-3 text-right">AKSI</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {reimbursements.length === 0 ? (
                <tr>
                  <td colSpan={isPayrollAdmin ? 7 : 6} className="p-6 text-center text-slate-400">
                    Belum ada pengajuan klaim biaya.
                  </td>
                </tr>
              ) : (
                reimbursements.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{r.user_name || user?.name}</td>
                    <td className="p-3 font-extrabold text-slate-800 dark:text-slate-200">{r.title}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 font-bold text-[10px] rounded-md">
                        {r.category}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-black text-emerald-600 text-sm">
                      Rp {r.amount.toLocaleString('id-ID')}
                    </td>
                    <td className="p-3">
                      {r.receipt_url ? (
                        <a href={r.receipt_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                          <ImageIcon size={14} />
                          <span>Bukti Struk</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 font-italic">Tidak Ada</span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        r.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                        r.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    {isPayrollAdmin && (
                      <td className="p-3 text-right">
                        {r.status === 'PENDING' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveReimbursement(r.id)}
                              className="px-3 py-1 bg-emerald-600 text-white rounded-lg font-bold text-[11px] hover:bg-emerald-700"
                            >
                              Setujui & Bayar
                            </button>
                            <button
                              onClick={() => rejectReimbursement(r.id)}
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
                Form Pengajuan Klaim Reimbursement
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Judul / Keperluan Klaim</label>
                <input
                  type="text"
                  required
                  placeholder="Klaim Pengobatan Dokter / Bensin Perjalanan Dinas"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  >
                    <option value="MEDICAL">Kesehatan (Medical)</option>
                    <option value="TRAVEL">Transportasi (Travel)</option>
                    <option value="MEAL">Konsumsi (Meal)</option>
                    <option value="EQUIPMENT">Perlengkapan (Equipment)</option>
                    <option value="OTHER">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nominal (Rp)</label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Upload Bukti Struk / Kuitansi</label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-600 hover:file:bg-emerald-100"
                />
                {fileName && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">Terpilih: {fileName}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold shadow-md hover:bg-emerald-700">
                  Kirim Klaim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
