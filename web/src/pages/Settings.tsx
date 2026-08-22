import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
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
              className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-full shadow-md flex items-center justify-center gap-2 transition-all mt-2 text-xs"
            >
              <Save size={16} />
              {loading ? t.processing : t.save}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};
