import React, { useState } from 'react';
import axios from 'axios';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { PasswordStrengthChecklist } from '../components/ui/PasswordStrengthChecklist';
import { Sliders, Save } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { settings, updateSettings } = useHRStore();
  const { t } = useLanguageStore();

  const [officeLat, setOfficeLat] = useState(settings.office_lat || '-6.2088');
  const [officeLng, setOfficeLng] = useState(settings.office_lng || '106.8456');
  const [maxDistance, setMaxDistance] = useState(settings.max_distance_km || '5.0');
  const [companyName, setCompanyName] = useState(settings.company_name || 'BlueHR Corp');
  const [loading, setLoading] = useState(false);

  const canManage = hasPermission('manage_settings');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings({
        office_lat: officeLat,
        office_lng: officeLng,
        max_distance_km: maxDistance,
        company_name: companyName
      });
      alert('Pengaturan Geofencing kantor berhasil diperbarui!');
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Sliders className="text-[#2563eb]" size={24} />
            {t.settingsTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.settingsSub}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.companyName}</label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.officeLat}</label>
              <input
                type="text"
                required
                value={officeLat}
                onChange={(e) => setOfficeLat(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>
            <div>
              <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.officeLng}</label>
              <input
                type="text"
                required
                value={officeLng}
                onChange={(e) => setOfficeLng(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">{t.maxRadiusSetting}</label>
            <input
              type="number"
              step="0.1"
              min="0.5"
              max="50.0"
              required
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-slate-900 dark:text-white font-bold text-sm outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            />
            <p className="text-[11px] text-slate-400 mt-1">Karyawan yang melakukan absen melebihi radius ini akan ditandai OUT OF BOUNDS.</p>
          </div>

          {canManage && (
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-md flex items-center gap-2"
            >
              <Save size={16} />
              <span>{loading ? 'Menyimpan...' : 'Simpan Pengaturan Geofence'}</span>
            </button>
          )}
        </form>
      </div>

      <ChangePasswordSection />
    </div>
  );
};

const ChangePasswordSection: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const headers = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await axios.post('http://localhost:5000/api/v1/auth/change-password', { newPassword }, headers);
      setMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Gagal mengubah password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm max-w-xl space-y-4 font-sans">
      <div>
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Keamanan Akun & Ganti Password</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Perbarui kata sandi Anda secara berkala sesuai kebijakan standar keamanan perusahaan.
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-2xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleChangePassword} className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">Password Baru</label>
          <input
            type="password"
            required
            placeholder="Masukkan kata sandi baru..."
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200"
          />
        </div>

        <PasswordStrengthChecklist password={newPassword} />

        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold rounded-2xl shadow-md"
        >
          {loading ? 'Memperbarui...' : 'Perbarui Password Saya'}
        </button>
      </form>
    </div>
  );
};
