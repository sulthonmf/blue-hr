import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { ClockInModal } from '../components/modules/ClockInModal';
import { Clock, Search, LogOut, Users, ShieldAlert, CheckCheck, CheckCircle2 } from 'lucide-react';

export const AttendancePage: React.FC = () => {
  const { user, hasPermission } = useAuthStore();
  const { attendanceLogs, todayAttendance, clockOut, simulatedDistanceKm, settings } = useHRStore();
  const { t } = useLanguageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const maxDistance = parseFloat(settings.max_distance_km || '5.0');

  const canAuditAttendance = hasPermission('manage_attendance');

  // Stats
  const totalLogs = attendanceLogs.length;
  const onTimeCount = attendanceLogs.filter(l => l.status === 'ON_TIME').length;
  const outOfBoundsCount = attendanceLogs.filter(l => l.status === 'OUT_OF_BOUNDS').length;

  const filteredLogs = attendanceLogs.filter(log => {
    const matchesUser = log.user_name ? log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;
    return matchesUser && matchesStatus;
  });

  return (
    <div className="space-y-6 font-sans">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <Clock className="text-[#2563eb]" size={24} />
            {t.attendanceTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.attendanceSub} <strong className="text-[#2563eb]">{maxDistance} km</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {todayAttendance ? (
            <button
              onClick={() => clockOut()}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
            >
              <LogOut size={16} />
              {t.clockOut}
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
            >
              <Clock size={16} />
              {t.actionSuccess}
            </button>
          )}
        </div>
      </div>

      {/* HR Audit Summary Stats Cards */}
      {canAuditAttendance && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] flex items-center justify-center font-bold">
              <Users size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-display">{t.totalAuditLogs}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">{totalLogs} {t.records}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCheck size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-display">{t.onTimeCount}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">{onTimeCount} {t.people}</h3>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-bold">
              <ShieldAlert size={22} />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-display">{t.outCount}</span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">{outOfBoundsCount} {t.people}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Personal Status Card */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider font-display">Status Absensi Personal Hari Ini</span>
          {todayAttendance ? (
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 size={14} />
                SUDAH ABSEN ({new Date(todayAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
              </span>
              <span className="text-xs font-semibold text-slate-500">Jarak: {todayAttendance.distance_km} km</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              Belum Melakukan Absensi Masuk Hari Ini
            </div>
          )}
        </div>
      </div>

      {/* Logs Table Section */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Histori Audit Absensi Seluruh Tim</h3>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40"
            >
              <option value="ALL">{t.filterAll}</option>
              <option value="ON_TIME">✔ {t.onTimeLabel}</option>
              <option value="OUT_OF_BOUNDS">✖ {t.outRadius}</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200/80 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Karyawan</th>
                <th className="p-3.5">Divisi / Jabatan</th>
                <th className="p-3.5">Waktu Clock In</th>
                <th className="p-3.5">Jarak GPS</th>
                <th className="p-3.5">Status Geofence</th>
                <th className="p-3.5">Keterangan HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    Belum ada data log absensi.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-extrabold text-slate-900 dark:text-white">{log.user_name || 'System User'}</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">{log.department || 'Engineering'} ({log.position || 'Employee'})</td>
                    <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300">
                      {new Date(log.check_in).toLocaleString()}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 dark:text-white">{log.distance_km} km</td>
                    <td className="p-3.5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        log.status === 'ON_TIME'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border dark:border-emerald-800'
                          : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 dark:border dark:border-rose-800'
                      }`}>
                        {log.status === 'ON_TIME' ? `✔ ${t.onTimeLabel}` : `✖ ${t.outRange}`}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{log.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClockInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
