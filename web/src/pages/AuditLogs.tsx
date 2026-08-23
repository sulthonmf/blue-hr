import React, { useEffect } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { ShieldCheck, Search, Activity, User, Globe, Calendar, RefreshCw } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, fetchAuditLogs } = useHRStore();

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <ShieldCheck className="text-rose-600" size={26} />
            <span>Audit Log & System Activity Trail</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Jejak aktivitas keamanan enterprise untuk memantau perubahan data sensitif, akses sistem, dan aksi pengguna.
          </p>
        </div>

        <button
          onClick={() => fetchAuditLogs()}
          className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <RefreshCw size={16} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Riwayat Aktivitas Terbaru</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">WAKTU</th>
                <th className="p-3">PENGGUNA</th>
                <th className="p-3">AKSI / ACTION</th>
                <th className="p-3">ENTITAS</th>
                <th className="p-3">Rincian / DETAILS</th>
                <th className="p-3">IP ADDRESS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                    Belum ada jejak audit terdeteksi.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 text-slate-500 font-sans text-[11px]">{log.created_at || 'Baru Saja'}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white font-sans">{log.user_name || 'System'}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-extrabold text-[10px] rounded-md">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-700 dark:text-slate-300 font-sans">{log.entity}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-sans max-w-sm truncate">{log.details || '-'}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{log.ip_address || '127.0.0.1'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
