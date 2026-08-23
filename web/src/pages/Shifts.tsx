import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { Clock, Plus, Search, Edit2, Trash2, Building2, CheckCircle2, X } from 'lucide-react';

export const ShiftsPage: React.FC = () => {
  const { shifts, branches, createShift, updateShift, deleteShift } = useHRStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    start_time: '08:00',
    end_time: '17:00',
    branch_id: 1,
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const handleOpenAdd = () => {
    setEditingShift(null);
    setFormData({
      code: `SH-${Math.floor(10 + Math.random() * 89)}`,
      name: '',
      start_time: '08:00',
      end_time: '17:00',
      branch_id: branches[0]?.id || 1,
      status: 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shift: any) => {
    setEditingShift(shift);
    setFormData({
      code: shift.code,
      name: shift.name,
      start_time: shift.start_time,
      end_time: shift.end_time,
      branch_id: shift.branch_id || 1,
      status: shift.status || 'ACTIVE'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingShift) {
      await updateShift(editingShift.id, formData);
    } else {
      await createShift(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus jadwal shift ini?')) {
      await deleteShift(id);
    }
  };

  const filteredShifts = shifts.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Clock className="text-[#2563eb]" size={26} />
            <span>Manajemen Shift & Roster Kerja</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola master pola jam kerja shift operasional karyawan di setiap cabang perusahaan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Tambah Shift</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari shift berdasarkan nama atau kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-[#2563eb]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredShifts.map((s) => (
          <div key={s.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-600 font-extrabold text-[11px] rounded-lg">
                  {s.code}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${s.status === 'ACTIVE' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {s.status}
                </span>
              </div>

              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display mb-1">{s.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mb-3">
                <Building2 size={14} className="text-[#2563eb]" />
                <span>{s.branch_name || 'Seluruh Cabang'}</span>
              </p>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-around text-xs font-bold text-slate-800 dark:text-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Jam Masuk</span>
                  <span className="text-base font-black text-[#2563eb]">{s.start_time}</span>
                </div>
                <div className="text-slate-300">➔</div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Jam Keluar</span>
                  <span className="text-base font-black text-emerald-600">{s.end_time}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => handleOpenEdit(s)} className="p-2 text-slate-500 hover:text-[#2563eb] hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-xl transition-all">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl transition-all">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                {editingShift ? 'Edit Shift Kerja' : 'Tambah Shift Kerja Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Kode Shift</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Nama Shift</label>
                <input
                  type="text"
                  required
                  placeholder="Shift Siang Operasional"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jam Masuk</label>
                  <input
                    type="time"
                    required
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jam Keluar</label>
                  <input
                    type="time"
                    required
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Cabang Perusahaan</label>
                <select
                  value={formData.branch_id}
                  onChange={(e) => setFormData({ ...formData, branch_id: parseInt(e.target.value, 10) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name} ({b.city})</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold">
                  Batal
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#2563eb] text-white font-bold shadow-md hover:bg-blue-700">
                  Simpan Shift
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
