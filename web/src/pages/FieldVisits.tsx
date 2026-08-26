import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../stores/useLanguageStore';
import { MapPin, Navigation, Clock, User, Building } from 'lucide-react';
import { client } from '../api/client';

interface FieldVisit {
  id: number;
  user_name: string;
  client_name: string;
  location: string;
  notes: string;
  timestamp: string;
}

export const FieldVisitsPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [visits, setVisits] = useState<FieldVisit[]>([]);

  const fetchVisits = async () => {
    try {
      const res = await client.get('/api/v1/field-visits');
      setVisits(res.data);
    } catch {
      setVisits([
        { id: 1, user_name: 'Budi Santoso', client_name: 'PT Bank Central Asia', location: 'Jakarta Selatan', notes: 'Pertemuan demo produk HRIS', timestamp: '2026-08-25 10:30' }
      ]);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <MapPin size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.fieldVisitsTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.fieldVisitsSub}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200/80 dark:border-slate-800 font-bold text-slate-500">
            <tr>
              <th className="p-4">{t.colEmployee}</th>
              <th className="p-4">{t.clientName}</th>
              <th className="p-4">{t.companyLocation}</th>
              <th className="p-4">{t.visitNotes}</th>
              <th className="p-4">Waktu Check-In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {visits.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                <td className="p-4 font-bold text-slate-900 dark:text-white">{v.user_name}</td>
                <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{v.client_name}</td>
                <td className="p-4 text-slate-500 flex items-center gap-1.5">
                  <Navigation size={14} className="text-cyan-600 dark:text-cyan-400" />
                  <span>{v.location}</span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400">{v.notes}</td>
                <td className="p-4 text-slate-500">{v.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
