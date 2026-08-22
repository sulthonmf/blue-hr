import React, { useState } from 'react';
import { useHRStore } from '../../stores/useHRStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { Clock, MapPin, Camera, X, Check, AlertTriangle } from 'lucide-react';

import { authenticateBiometric } from '../../services/biometrics';
import { checkDeviceSecurity } from '../../services/security';

export const ClockInModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { clockIn, simulatedDistanceKm, settings } = useHRStore();
  const { t } = useLanguageStore();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const maxDistance = parseFloat(settings.max_distance_km || '5.0');
  const isWithin = simulatedDistanceKm <= maxDistance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const sec = checkDeviceSecurity();
      if (!sec.isSecure) {
        alert(`⚠️ Keamanan Perangkat: ${sec.warnings.join(', ')}`);
      }

      const bioRes = await authenticateBiometric('Clock In Presensi Geofence');
      if (!bioRes.success) {
        alert(`❌ Biometrik Gagal: ${bioRes.message}`);
        setLoading(false);
        return;
      }

      const res = await clockIn('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', notes || 'Presensi Web (Biometric Verified)');
      setResult(res);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-md rounded-[28px] p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1 flex items-center gap-2 font-display">
          <Clock className="text-[#2563eb]" size={20} />
          {t.clockInTitle}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{t.clockInSub}</p>

        {result ? (
          <div className="space-y-4 text-center py-4">
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center border-2 ${
              result.status === 'ON_TIME'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-600 dark:text-amber-400'
            }`}>
              {result.status === 'ON_TIME' ? <Check size={32} /> : <AlertTriangle size={32} />}
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-display">
                {result.status === 'ON_TIME' ? 'Absensi Berhasil Disimpan!' : 'Absen Tercatat (Di Luar Radius)'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Jarak Anda: <strong className="text-slate-900 dark:text-white">{result.distanceKm} km</strong> dari kantor (Maksimal {result.maxDistanceKm} km)
              </p>
            </div>
            <button
              onClick={() => { setResult(null); onClose(); }}
              className="w-full bg-[#2563eb] hover:bg-blue-700 text-white font-bold py-2.5 rounded-full text-xs shadow-md"
            >
              {t.completed}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                <MapPin size={16} className="text-[#2563eb]" />
                <span>Status Lokasi GPS</span>
              </div>
              <span className={`font-bold ${isWithin ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {simulatedDistanceKm.toFixed(1)} km ({isWithin ? t.withinRadius : t.outRange})
              </span>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center bg-slate-50/50 dark:bg-slate-950/40">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center mx-auto mb-2 border border-blue-100 dark:border-blue-900/40">
                <Camera size={20} />
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">{t.selfieVerified}</p>
              <p className="text-[10px] text-slate-400">Pratinjau kamera siap untuk absensi</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{t.notesOptional}</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Bekerja dari kantor Jakarta Central"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
                rows={2}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563eb] hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-full text-xs shadow-md transition-all"
            >
              {loading ? t.processing : t.sendClockIn}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
