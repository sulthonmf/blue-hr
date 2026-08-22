import React, { useState } from 'react';
import { useHRStore } from '../../stores/useHRStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { ShieldCheck, X } from 'lucide-react';

export const RoleBuilderModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { createRole } = useHRStore();
  const { t } = useLanguageStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(['view_own_attendance', 'request_leave']);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const availablePermissions = [
    { code: 'manage_users', label: 'Kelola Karyawan (Register & Reset Pass)' },
    { code: 'manage_roles', label: 'Kelola Dynamic Role & Permission' },
    { code: 'manage_attendance', label: 'Lihat & Kelola Log Absensi Seluruh Tim' },
    { code: 'approve_leave', label: 'Persetujuan (Approve/Reject) Cuti' },
    { code: 'manage_leave_quota', label: 'Kelola & Top-Up Kuota Cuti' },
    { code: 'manage_kpi', label: 'Penilaian KPI & Scorecard Karyawan' },
    { code: 'manage_documents', label: 'Kelola Dokumen Karyawan' },
    { code: 'manage_assets', label: 'Kelola & Pinjamkan Aset Perusahaan' },
    { code: 'manage_announcements', label: 'Buat & Sematkan Pengumuman' },
    { code: 'manage_settings', label: 'Pengaturan Geofencing & Kantor' }
  ];

  const togglePermission = (code: string) => {
    if (selectedPermissions.includes(code)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== code));
    } else {
      setSelectedPermissions([...selectedPermissions, code]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return alert('Nama role wajib diisi');
    setLoading(true);
    try {
      await createRole({ name, description, permissions: selectedPermissions });
      setName('');
      setDescription('');
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-lg rounded-[28px] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2 font-display">
          <ShieldCheck className="text-[#2563eb]" size={20} />
          {t.roleBuilderTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Buat posisi/peran baru untuk tim di perusahaan</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Role / Posisi Baru</label>
            <input
              type="text"
              required
              placeholder="Contoh: Engineering Manager, Finance Specialist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Deskripsi Peran</label>
            <input
              type="text"
              placeholder="Contoh: Bertanggung jawab atas tim teknikal & pengajuan cuti tim"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">Pilih Hak Akses (Permissions)</label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {availablePermissions.map((perm) => (
                <label
                  key={perm.code}
                  className="flex items-center gap-2.5 p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:border-[#2563eb] text-xs transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(perm.code)}
                    onChange={() => togglePermission(perm.code)}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[#2563eb] focus:ring-0"
                  />
                  <span className="text-slate-700 dark:text-slate-200 font-medium">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-full text-xs shadow-md transition-all"
          >
            {loading ? t.processing : t.save}
          </button>
        </form>
      </div>
    </div>
  );
};
