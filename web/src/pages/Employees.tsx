import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { NewEmployeeModal } from '../components/modules/NewEmployeeModal';
import { ORGANIZATION_STRUCTURE } from '../utils/organizationData';
import {
  Users, UserPlus, KeyRound, FileText, Shield, Search,
  Edit3, UserX, UserCheck, Loader2, X, Save, Phone,
  Building2, Briefcase, CheckCircle2, AlertTriangle,
  CreditCard, Award, FileCheck, Layers, GitFork, MapPin, PhoneCall
} from 'lucide-react';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Aktif', color: 'text-emerald-700 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/60' },
  INACTIVE: { label: 'Nonaktif', color: 'text-amber-700 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/60' },
  RESIGNED: { label: 'Resign', color: 'text-rose-700 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-950/60' },
};

export const EmployeesPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { employees, roles, resetPassword, updateEmployee, setEmployeeStatus } = useHRStore();
  const { t } = useLanguageStore();

  const [viewMode, setViewMode] = useState<'GRID' | 'ORG_CHART'>('GRID');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Edit employee state
  const [editEmp, setEditEmp] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Doc viewer state
  const [docEmp, setDocEmp] = useState<any | null>(null);

  // Freeze/Status confirm state
  const [statusAction, setStatusAction] = useState<{ emp: any; status: 'ACTIVE' | 'INACTIVE' | 'RESIGNED' } | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  const canManage = hasPermission('manage_users');

  const filteredEmps = employees.filter(emp => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (emp.division && emp.division.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = filterStatus === 'ALL' || emp.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const openEditModal = (emp: any) => {
    setEditEmp(emp);
    setEditForm({
      name: emp.name,
      position: emp.position,
      department: emp.department,
      division: emp.division || 'Divisi Teknologi & Informasi',
      directorate: emp.directorate || 'Direktorat Utama',
      phone: emp.phone || '',
      address: emp.address || '',
      emergency_contact_name: emp.emergency_contact_name || '',
      emergency_contact_phone: emp.emergency_contact_phone || '',
      emergency_contact_relation: emp.emergency_contact_relation || '',
      role_id: emp.role_id,
      leave_quota: emp.leave_quota,
    });
    setEditError('');
  };

  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editEmp) return;
    setEditLoading(true);
    setEditError('');
    try {
      await updateEmployee(editEmp.id, editForm);
      setEditEmp(null);
    } catch (err: any) {
      setEditError(err.response?.data?.error || err.message || 'Gagal memperbarui karyawan');
    } finally {
      setEditLoading(false);
    }
  };

  const handleConfirmStatus = async () => {
    if (!statusAction) return;
    setStatusLoading(true);
    try {
      await setEmployeeStatus(statusAction.emp.id, statusAction.status);
      setStatusAction(null);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message || 'Gagal mengubah status');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
            <Users className="text-[#2563eb]" size={24} />
            {t.employees} ({employees.length})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manajemen direktori karyawan, hak akses, & hirarki struktur organisasi
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle (Grid vs Org Chart) */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('GRID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'GRID' ? 'bg-white dark:bg-slate-900 text-[#2563eb] shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users size={14} /> Daftar Karyawan
            </button>
            <button
              onClick={() => setViewMode('ORG_CHART')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'ORG_CHART' ? 'bg-white dark:bg-slate-900 text-[#2563eb] shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <GitFork size={14} /> Org Chart Hirarki
            </button>
          </div>

          {canManage && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
            >
              <UserPlus size={16} />
              {t.registerEmp}
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Cari karyawan, jabatan, divisi, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ACTIVE', 'INACTIVE', 'RESIGNED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === st
                  ? 'bg-[#2563eb] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'ALL' ? 'Semua Status' : STATUS_CONFIG[st]?.label || st}
            </button>
          ))}
        </div>
      </div>

      {/* ORG CHART VIEW */}
      {viewMode === 'ORG_CHART' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto mb-4">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white font-display flex items-center justify-center gap-2">
              <GitFork className="text-[#2563eb]" size={20} />
              Struktur Organisasi Bertingkat
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direksi / Board of Directors ➔ Divisi ➔ Departemen ➔ Karyawan
            </p>
          </div>

          {/* Level 1: Direksi */}
          <div className="border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl text-center">
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#2563eb] bg-blue-100 dark:bg-blue-900/60 px-3 py-1 rounded-full inline-block mb-3">
              👑 Level 1: Board of Directors (Direksi Utama)
            </span>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 p-3 rounded-2xl shadow-sm text-left w-56">
                <p className="font-extrabold text-slate-900 dark:text-white text-xs">Budi Santoso, M.B.A</p>
                <p className="text-[10px] text-[#2563eb] font-bold">Direktur Utama (CEO)</p>
                <p className="text-[10px] text-slate-400 mt-1">Penanggung Jawab Utama</p>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 p-3 rounded-2xl shadow-sm text-left w-56">
                <p className="font-extrabold text-slate-900 dark:text-white text-xs">Siti Rahma, S.T</p>
                <p className="text-[10px] text-[#2563eb] font-bold">Direktur Operasional & IT (COO)</p>
                <p className="text-[10px] text-slate-400 mt-1">Divisi IT & Operasional</p>
              </div>
            </div>
          </div>

          {/* Level 2: Divisi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-indigo-600 bg-indigo-100 dark:bg-indigo-900/60 px-3 py-1 rounded-full inline-block">
                🏢 Divisi Teknologi & Informasi
              </span>
              <div className="space-y-2">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Dept Backend Engineering</p>
                  <p className="text-[10px] text-slate-500">Anggota: {employees.filter(e => e.department?.includes('Backend')).length || 4} Karyawan</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Dept Frontend UI/UX</p>
                  <p className="text-[10px] text-slate-500">Anggota: {employees.filter(e => e.department?.includes('Frontend')).length || 3} Karyawan</p>
                </div>
              </div>
            </div>

            <div className="border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 p-4 rounded-2xl space-y-3">
              <span className="text-[10px] font-extrabold tracking-wider uppercase text-purple-600 bg-purple-100 dark:bg-purple-900/60 px-3 py-1 rounded-full inline-block">
                💼 Divisi Keuangan & Human Resources
              </span>
              <div className="space-y-2">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Dept Human Capital & Talent</p>
                  <p className="text-[10px] text-slate-500">Anggota: {employees.filter(e => e.department?.includes('HR')).length || 2} Karyawan</p>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl">
                  <p className="font-bold text-slate-900 dark:text-white text-xs">Dept Finance & Tax</p>
                  <p className="text-[10px] text-slate-500">Anggota: {employees.filter(e => e.department?.includes('Finance')).length || 2} Karyawan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEmps.map((emp) => {
            const stConf = STATUS_CONFIG[emp.status] || STATUS_CONFIG.ACTIVE;
            return (
              <div
                key={emp.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-[#2563eb]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {emp.avatar ? (
                        <img src={emp.avatar} alt={emp.name} loading="lazy" className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-800" />
                      ) : (
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2563eb] to-indigo-500 text-white font-extrabold flex items-center justify-center text-sm shadow-md shadow-blue-500/20">
                          {emp.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-sm font-display leading-tight">
                          {emp.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563eb] dark:text-blue-400 font-extrabold text-[9px] rounded-md">
                            NIP: EMP-{String(emp.id).padStart(4, '0')}
                          </span>
                          <span className="text-[11px] text-slate-400 leading-tight">{emp.email}</span>
                        </div>
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${stConf.bg} ${stConf.color}`}>
                      {stConf.label}
                    </span>
                  </div>

                  {/* Structure Badges */}
                  <div className="space-y-1.5 text-[11px] bg-slate-50 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 mb-3">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Briefcase size={13} className="text-[#2563eb]" />
                      <span>{emp.position}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Building2 size={13} className="text-[#2563eb]" />
                      <span>{emp.department} • <span className="text-slate-400 font-semibold">{emp.division || 'Divisi IT'}</span></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                      <Shield size={12} className="text-slate-400" />
                      <span>{emp.directorate || 'Direktorat Utama'}</span>
                    </div>
                    {emp.phone && (
                      <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                        <Phone size={12} className="text-slate-400" />
                        <span>{emp.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setDocEmp(emp)}
                    className="text-[#2563eb] font-bold text-[11px] hover:underline flex items-center gap-1"
                  >
                    <FileText size={13} /> Dokumen HR
                  </button>

                  <div className="flex items-center gap-1.5">
                    {canManage && (
                      <>
                        <button
                          onClick={() => openEditModal(emp)}
                          className="p-1.5 text-slate-400 hover:text-[#2563eb] dark:hover:text-blue-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                          title="Edit Karyawan"
                        >
                          <Edit3 size={15} />
                        </button>

                        {emp.status === 'ACTIVE' ? (
                          <button
                            onClick={() => setStatusAction({ emp, status: 'INACTIVE' })}
                            className="p-1.5 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                            title="Freeze / Nonaktifkan"
                          >
                            <UserX size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setStatusAction({ emp, status: 'ACTIVE' })}
                            className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-[10px] font-bold rounded-lg hover:bg-emerald-100 flex items-center gap-1"
                            title="Aktifkan Kembali"
                          >
                            <UserCheck size={11} />
                            Aktifkan
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredEmps.length === 0 && (
            <div className="col-span-3 text-center py-12 text-slate-400 font-semibold text-sm">
              Tidak ada karyawan yang cocok dengan filter.
            </div>
          )}
        </div>
      )}

      {/* ---- Edit Employee Modal ---- */}
      {editEmp && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Edit3 size={18} className="text-[#2563eb]" />
                Edit Data: {editEmp.name}
              </h3>
              <button onClick={() => setEditEmp(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>

            {editError && (
              <div className="mb-3 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 text-xs rounded-xl">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSave} className="space-y-3 text-xs max-h-[75vh] overflow-y-auto pr-1">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                <img
                  src={editForm.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Avatar Preview"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#2563eb]"
                />
                <div className="flex-1">
                  <p className="font-extrabold text-slate-900 dark:text-white text-xs">Ubah Foto Profil</p>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1 mt-1 bg-[#2563eb] text-white rounded-xl font-bold text-[10px] cursor-pointer shadow-sm">
                    Pilih File Foto dari Device
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setEditForm({ ...editForm, avatar: reader.result as string });
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Lengkap</label>
                  <input
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. Telepon</label>
                  <input
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    placeholder="+62..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Jabatan / Posisi</label>
                  <input
                    value={editForm.position}
                    onChange={e => setEditForm({ ...editForm, position: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Direksi Penanggung Jawab *</label>
                  <select
                    value={editForm.directorate || ORGANIZATION_STRUCTURE[0].name}
                    onChange={e => {
                      const dirName = e.target.value;
                      const dirObj = ORGANIZATION_STRUCTURE.find(d => d.name === dirName) || ORGANIZATION_STRUCTURE[0];
                      const firstDiv = dirObj.divisions[0];
                      const firstDept = firstDiv.departments[0];
                      setEditForm({
                        ...editForm,
                        directorate: dirObj.name,
                        division: firstDiv.name,
                        department: firstDept.name
                      });
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  >
                    {ORGANIZATION_STRUCTURE.map(d => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Divisi *</label>
                  {(() => {
                    const currentDir = ORGANIZATION_STRUCTURE.find(d => d.name === editForm.directorate) || ORGANIZATION_STRUCTURE[0];
                    const availableDivs = currentDir.divisions;
                    return (
                      <select
                        value={editForm.division || availableDivs[0].name}
                        onChange={e => {
                          const divName = e.target.value;
                          const divObj = availableDivs.find(d => d.name === divName) || availableDivs[0];
                          const firstDept = divObj.departments[0];
                          setEditForm({
                            ...editForm,
                            division: divObj.name,
                            department: firstDept.name
                          });
                        }}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                      >
                        {availableDivs.map(div => (
                          <option key={div.code} value={div.name}>{div.name}</option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Departemen *</label>
                  {(() => {
                    const currentDir = ORGANIZATION_STRUCTURE.find(d => d.name === editForm.directorate) || ORGANIZATION_STRUCTURE[0];
                    const currentDiv = currentDir.divisions.find(div => div.name === editForm.division) || currentDir.divisions[0];
                    const availableDepts = currentDiv.departments;
                    return (
                      <select
                        value={editForm.department || availableDepts[0].name}
                        onChange={e => setEditForm({ ...editForm, department: e.target.value })}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                      >
                        {availableDepts.map(dept => (
                          <option key={dept.code} value={dept.name}>{dept.name}</option>
                        ))}
                      </select>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">Nama Kontak Darurat</label>
                  <input
                    value={editForm.emergency_contact_name}
                    onChange={e => setEditForm({ ...editForm, emergency_contact_name: e.target.value })}
                    placeholder="Budi (Kakak)"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-semibold mb-1">No. HP Kontak Darurat</label>
                  <input
                    value={editForm.emergency_contact_phone}
                    onChange={e => setEditForm({ ...editForm, emergency_contact_phone: e.target.value })}
                    placeholder="+62812..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditEmp(null)}
                  className="px-4 py-2 font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-4 py-2 font-bold bg-[#2563eb] text-white rounded-xl flex items-center gap-1.5"
                >
                  {editLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---- Document Viewer & Upload Modal ---- */}
      {docEmp && (
        <DocumentManagementModal emp={docEmp} onClose={() => setDocEmp(null)} />
      )}

      <NewEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};

// Document Management Modal Component
const DocumentManagementModal: React.FC<{ emp: any; onClose: () => void }> = ({ emp, onClose }) => {
  const { fetchUserDocuments, uploadDocument, deleteDocument } = useHRStore();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Upload state
  const [docType, setDocType] = useState<'KTP' | 'NPWP' | 'CONTRACT' | 'BPJS' | 'CERTIFICATE' | 'OTHER'>('KTP');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  const loadDocs = async () => {
    setLoading(true);
    const data = await fetchUserDocuments(emp.id);
    setDocuments(data);
    setLoading(false);
  };

  React.useEffect(() => {
    loadDocs();
  }, [emp.id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      if (!title) setTitle(file.name);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setFileUrl(evt.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !fileUrl) return;
    setUploading(true);
    try {
      await uploadDocument({
        user_id: emp.id,
        doc_type: docType,
        title,
        file_url: fileUrl
      });
      setTitle('');
      setFileUrl('');
      setFileName('');
      setShowUploadForm(false);
      await loadDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDoc = async (id: number) => {
    if (window.confirm('Hapus dokumen ini?')) {
      await deleteDocument(id, emp.id);
      await loadDocs();
    }
  };

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'KTP':
        return { icon: CreditCard, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
      case 'NPWP':
        return { icon: FileCheck, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
      case 'CONTRACT':
        return { icon: FileText, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' };
      case 'BPJS':
        return { icon: Award, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60' };
      default:
        return { icon: Layers, color: 'text-slate-500 bg-slate-50 dark:bg-slate-950/60' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
              Dokumen: {emp.name}
            </h3>
            <p className="text-xs text-slate-400">{emp.position} • {emp.department}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Upload Toggle Button */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Daftar Dokumen ({documents.length})
          </span>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="px-3 py-1.5 bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow hover:bg-blue-700 flex items-center gap-1.5 transition-all"
          >
            {showUploadForm ? 'Tutup Upload' : '+ Upload Dokumen'}
          </button>
        </div>

        {/* Form Upload */}
        {showUploadForm && (
          <form onSubmit={handleUploadSubmit} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Jenis Dokumen</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium"
                >
                  <option value="KTP">KTP (Identitas)</option>
                  <option value="NPWP">NPWP (Pajak)</option>
                  <option value="CONTRACT">Kontrak PKWTT/PKWT</option>
                  <option value="BPJS">Kartu BPJS</option>
                  <option value="CERTIFICATE">Sertifikat</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Judul Dokumen</label>
                <input
                  type="text"
                  required
                  placeholder="KTP_Terverifikasi.pdf"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Pilih File (PDF, PNG, JPG)</label>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
              {fileName && <p className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-bold">Terpilih: {fileName}</p>}
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                disabled={uploading || !fileUrl}
                className="px-4 py-2 bg-[#2563eb] text-white text-xs font-bold rounded-xl shadow hover:bg-blue-700 disabled:opacity-50"
              >
                {uploading ? 'Mengunggah...' : 'Simpan Dokumen'}
              </button>
            </div>
          </form>
        )}

        {/* Documents List */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
          {loading ? (
            <div className="p-6 text-center text-slate-400 flex items-center justify-center gap-2">
              <Loader2 size={16} className="animate-spin" />
              <span>Memuat dokumen...</span>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              Belum ada dokumen diunggah untuk karyawan ini.
            </div>
          ) : (
            documents.map((doc) => {
              const { icon: IconComponent, color } = getDocIcon(doc.doc_type);
              return (
                <div key={doc.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-slate-900 dark:text-white">{doc.title}</h5>
                      <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-md mr-2">
                        {doc.doc_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-[#2563eb] font-bold hover:underline"
                    >
                      Pratinjau
                    </a>
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      className="text-[11px] text-rose-500 font-bold hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
