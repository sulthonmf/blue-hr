import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { Building2, MapPin, Phone, Plus, Search, Edit2, Trash2, CheckCircle, AlertCircle, X, ShieldCheck } from 'lucide-react';

export const BranchesPage: React.FC = () => {
  const { branches, createBranch, updateBranch, deleteBranch } = useHRStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    address: '',
    city: '',
    phone: '',
    latitude: -6.2088,
    longitude: 106.8456,
    radius_km: 5.0,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingBranch(null);
    setFormData({
      code: `BR-${Math.floor(10 + Math.random() * 89)}`,
      name: '',
      address: '',
      city: '',
      phone: '',
      latitude: -6.2088,
      longitude: 106.8456,
      radius_km: 5.0,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      code: branch.code,
      name: branch.name,
      address: branch.address,
      city: branch.city,
      phone: branch.phone || '',
      latitude: branch.latitude || -6.2088,
      longitude: branch.longitude || 106.8456,
      radius_km: branch.radius_km || 5.0,
      status: branch.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      await updateBranch(editingBranch.id, formData);
    } else {
      await createBranch(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus cabang ini?')) {
      await deleteBranch(id);
    }
  };

  const filteredBranches = branches.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Building2 className="text-[#2563eb]" size={26} />
            <span>Daftar Cabang Perusahaan</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola cabang operasional, alamat lokasi, dan koordinat geofence presensi karyawan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Cabang</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari cabang berdasarkan nama, kode, atau kota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2563eb]"
          />
        </div>
      </div>

      {/* Branch Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBranches.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] font-extrabold text-[11px] rounded-lg">
                  {b.code}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    b.status === 'ACTIVE'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {b.status}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display mb-1">
                {b.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5 mb-3">
                <MapPin size={14} className="text-[#2563eb] shrink-0 mt-0.5" />
                <span>{b.address}, {b.city}</span>
              </p>

              {b.phone && (
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
                  <Phone size={14} className="text-emerald-500 shrink-0" />
                  <span>{b.phone}</span>
                </p>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Geofence Latitude:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{b.latitude}</span>
                </div>
                <div className="flex justify-between">
                  <span>Geofence Longitude:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{b.longitude}</span>
                </div>
                <div className="flex justify-between">
                  <span>Radius Presensi:</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{b.radius_km} km</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => handleOpenEdit(b)}
                className="p-2 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all"
                title="Edit Cabang"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(b.id)}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all"
                title="Hapus Cabang"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add/Edit Branch */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                {editingBranch ? 'Edit Cabang Perusahaan' : 'Tambah Cabang Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kode Cabang</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nama Cabang</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cabang Surabaya"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kota</label>
                  <input
                    type="text"
                    required
                    placeholder="Surabaya"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">No. Telepon</label>
                  <input
                    type="text"
                    placeholder="031-5312000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Alamat Lengkap</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Pemuda No. 88"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Radius (km)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.radius_km}
                    onChange={(e) => setFormData({ ...formData, radius_km: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Status Cabang</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  <option value="ACTIVE">Aktif (ACTIVE)</option>
                  <option value="INACTIVE">Non-Aktif (INACTIVE)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-bold shadow-md hover:bg-blue-700"
                >
                  Simpan Cabang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
