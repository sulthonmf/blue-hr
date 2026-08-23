import React, { useState } from 'react';
import { useHRStore } from '../../stores/useHRStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { UserPlus, X, Upload, Camera } from 'lucide-react';
import { ORGANIZATION_STRUCTURE } from '../../utils/organizationData';

export const NewEmployeeModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { roles, registerEmployee } = useHRStore();
  const { t } = useLanguageStore();

  const defaultDir = ORGANIZATION_STRUCTURE[1] || ORGANIZATION_STRUCTURE[0];
  const defaultDiv = defaultDir.divisions[0];
  const defaultDept = defaultDiv.departments[0];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role_id: 3,
    position: '',
    department: defaultDept.name,
    division: defaultDiv.name,
    directorate: defaultDir.name,
    phone: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: 'Keluarga',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    leave_quota: 12
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // Selected Directorate Object
  const selectedDirObj = ORGANIZATION_STRUCTURE.find(d => d.name === formData.directorate) || ORGANIZATION_STRUCTURE[0];
  const availableDivisions = selectedDirObj.divisions;
  
  // Selected Division Object
  const selectedDivObj = availableDivisions.find(div => div.name === formData.division) || availableDivisions[0];
  const availableDepartments = selectedDivObj.departments;

  const handleDirectorateChange = (dirName: string) => {
    const dirObj = ORGANIZATION_STRUCTURE.find(d => d.name === dirName) || ORGANIZATION_STRUCTURE[0];
    const firstDiv = dirObj.divisions[0];
    const firstDept = firstDiv.departments[0];
    setFormData(prev => ({
      ...prev,
      directorate: dirObj.name,
      division: firstDiv.name,
      department: firstDept.name
    }));
  };

  const handleDivisionChange = (divName: string) => {
    const divObj = availableDivisions.find(d => d.name === divName) || availableDivisions[0];
    const firstDept = divObj.departments[0];
    setFormData(prev => ({
      ...prev,
      division: divObj.name,
      department: firstDept.name
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerEmployee(formData);
      alert('Karyawan baru berhasil didaftarkan oleh HR/Admin!');
      setFormData({
        name: '',
        email: '',
        password: 'password123',
        role_id: 3,
        position: '',
        department: 'Dept Backend Engineering',
        division: 'Divisi Teknologi & Informasi',
        directorate: 'Direktorat Utama',
        phone: '',
        address: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relation: 'Keluarga',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        leave_quota: 12
      });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-xl rounded-[28px] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2 font-display">
          <UserPlus className="text-[#2563eb]" size={20} />
          {t.newEmpTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Daftarkan akun karyawan baru lengkap dengan hirarki organisasi & upload foto profil</p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {/* Avatar Photo Preview & File Uploader */}
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <img
              src={formData.avatar}
              alt="Avatar Preview"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2563eb] shadow-sm"
            />
            <div className="flex-1">
              <p className="font-extrabold text-slate-900 dark:text-white text-xs">Upload Foto Profil Karyawan</p>
              <p className="text-[10px] text-slate-400 mb-1.5">Pilih file foto dari device/komputer Anda (PNG, JPG, WebP)</p>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2563eb] hover:bg-blue-700 text-white rounded-xl font-extrabold text-[11px] cursor-pointer shadow-sm transition-all">
                <Upload size={13} />
                Pilih File Foto dari Device
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="emp-name" className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Lengkap *</label>
              <input
                id="emp-name"
                type="text"
                required
                placeholder="Contoh: Rian Hidayat"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <div>
              <label htmlFor="emp-email" className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Email Perusahaan *</label>
              <input
                id="emp-email"
                type="email"
                required
                placeholder="rian@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="emp-directorate" className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Direksi *</label>
              <select
                id="emp-directorate"
                value={formData.directorate}
                onChange={(e) => handleDirectorateChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              >
                {ORGANIZATION_STRUCTURE.map((d) => (
                  <option key={d.code} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="emp-division" className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Divisi *</label>
              <select
                id="emp-division"
                value={formData.division}
                onChange={(e) => handleDivisionChange(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              >
                {availableDivisions.map((div) => (
                  <option key={div.code} value={div.name}>{div.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="emp-department" className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Departemen *</label>
              <select
                id="emp-department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              >
                {availableDepartments.map((dept) => (
                  <option key={dept.code} value={dept.name}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Jabatan / Posisi *</label>
              <input
                type="text"
                required
                placeholder="Senior Software Engineer"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">System Role *</label>
              <select
                value={formData.role_id}
                onChange={(e) => setFormData({ ...formData, role_id: Number(e.target.value) })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">No. Telepon / WhatsApp</label>
              <input
                type="text"
                placeholder="+62812..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Alamat Domisili</label>
              <input
                type="text"
                placeholder="Jl. Sudirman No. 45, Jakarta"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">Nama Kontak Darurat</label>
              <input
                type="text"
                placeholder="Budi (Kakak Kandung)"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">No. HP Darurat</label>
              <input
                type="text"
                placeholder="+62813..."
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl font-extrabold bg-[#2563eb] text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Daftarkan...' : 'Daftarkan Karyawan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
