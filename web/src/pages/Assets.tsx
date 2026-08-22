import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { Box, Plus } from 'lucide-react';

export const AssetsPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { assets, employees, createAsset, assignAsset } = useHRStore();
  const { t } = useLanguageStore();
  const [isAdding, setIsAdding] = useState(false);

  const [assetCode, setAssetCode] = useState('');
  const [assetName, setAssetName] = useState('');
  const [category, setCategory] = useState('LAPTOP');
  const [serialNumber, setSerialNumber] = useState('');

  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [assignUserId, setAssignUserId] = useState<number | ''>('');

  const canManage = hasPermission('manage_assets');

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAsset({
        asset_code: assetCode,
        asset_name: assetName,
        category,
        serial_number: serialNumber
      });
      alert('Aset baru berhasil dicatat!');
      setIsAdding(false);
      setAssetCode('');
      setAssetName('');
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !assignUserId) return;
    try {
      await assignAsset(selectedAssetId, Number(assignUserId), '2026-12-31');
      alert('Aset berhasil dipinjamkan ke karyawan!');
      setSelectedAssetId(null);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Box className="text-[#2563eb]" size={24} />
            {t.assets}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.assetsSub}
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            {isAdding ? t.cancel : t.addAssetBtn}
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-4 font-display">Registrasi Perangkat Aset Baru</h3>
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.assetCode}</label>
                <input
                  type="text"
                  required
                  placeholder="AST-MBP-003"
                  value={assetCode}
                  onChange={(e) => setAssetCode(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#2563eb]/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2563eb]/40 outline-none"
                >
                  <option value="LAPTOP">Laptop / Macbook</option>
                  <option value="MONITOR">Monitor Display</option>
                  <option value="SMARTPHONE">Smartphone Test Unit</option>
                  <option value="ACCESSORIES">Aksesori & Docking</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.assetName}</label>
                <input
                  type="text"
                  required
                  placeholder="MacBook Pro M3 Max 16 Inch"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#2563eb]/40 outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.serialNumber}</label>
                <input
                  type="text"
                  placeholder="SN-AAPL-2026-X9"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-[#2563eb]/40 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-3 rounded-full shadow-md transition-all"
            >
              {t.save}
            </button>
          </form>
        </div>
      )}

      {/* Assets Table */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">Daftar Inventaris Aset Perusahaan</h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">{t.assetCode}</th>
                <th className="p-3.5">{t.assetName}</th>
                <th className="p-3.5">{t.category}</th>
                <th className="p-3.5">Status Peminjaman</th>
                <th className="p-3.5">{t.assignedTo}</th>
                {canManage && <th className="p-3.5 text-right">Aksi HR</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {assets.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-[#2563eb] dark:text-blue-400">{item.asset_code}</td>
                  <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">{item.asset_name}</td>
                  <td className="p-3.5 font-semibold text-slate-600 dark:text-slate-400">{item.category}</td>
                  <td className="p-3.5">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      item.status === 'AVAILABLE'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800'
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400 dark:border dark:border-purple-800'
                    }`}>
                      {item.status === 'AVAILABLE' ? `✔ ${t.available}` : '🔒 BORROWED'}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-slate-800 dark:text-slate-200">{item.assigned_to_name || '-'}</td>
                  {canManage && (
                    <td className="p-3.5 text-right">
                      {item.status === 'AVAILABLE' && (
                        <button
                          onClick={() => setSelectedAssetId(item.id)}
                          className="px-3 py-1.5 bg-[#2563eb] text-white hover:bg-blue-700 rounded-lg text-xs font-bold shadow-sm transition-all"
                        >
                          {t.borrowAsset}
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Modal */}
      {selectedAssetId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-md rounded-[28px] p-6 shadow-2xl">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2 font-display">{t.borrowAsset}</h3>
            <form onSubmit={handleAssignSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.selectEmployee}</label>
                <select
                  required
                  value={assignUserId}
                  onChange={(e) => setAssignUserId(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none"
                >
                  <option value="">-- {t.selectEmployee} --</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.position})</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedAssetId(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-full text-xs"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2563eb] text-white hover:bg-blue-700 font-bold rounded-full text-xs shadow-md"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
