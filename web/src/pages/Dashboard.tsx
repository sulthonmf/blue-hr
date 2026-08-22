import React from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { LocationSimulator } from '../components/modules/LocationSimulator';
import {
  Clock,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react';

export const DashboardPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuthStore();
  const { todayAttendance, settings } = useHRStore();
  const { t } = useLanguageStore();

  const sampleRecentLogs = [
    { no: 1, name: 'Royhan Muhammad', pos: 'Product Designer', date: '12/03/2026', status: 'Completed', color: 'bg-[#4D96FF]/15 text-[#4D96FF]' },
    { no: 2, name: 'Muhammad Irfan', pos: 'Backend Developer', date: '12/03/2026', status: 'Delayed', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' },
    { no: 3, name: 'Tosan Garditama', pos: 'Frontend Developer', date: '12/03/2026', status: 'Completed', color: 'bg-[#4D96FF]/15 text-[#4D96FF]' }
  ];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t.goodMorning}</p>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            {user?.department || settings.company_name || 'BlueHR Studio'}
          </h1>
        </div>

        {/* User Specified Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Custom Green Action: #6BCB77 */}
          <button
            onClick={() => onNavigate('attendance')}
            className="bg-[#6BCB77] hover:bg-[#5bb867] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
          >
            <Clock size={15} />
            {todayAttendance ? t.attendance : t.actionSuccess}
          </button>

          {/* Custom Blue Action: #4D96FF */}
          <button
            onClick={() => onNavigate('settings')}
            className="bg-[#4D96FF] hover:bg-[#3b82f6] text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-md transition-all"
          >
            {t.actionAdjust}
          </button>
        </div>
      </div>

      {/* Geofencing Location Simulator */}
      <LocationSimulator />

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Rate Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">{t.attendanceRate}</h3>
                <p className="text-xs text-slate-400">{t.attendanceRateSub}</p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer">
                <span>{t.monthly}</span>
                <ChevronDown size={14} />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-black text-slate-900 dark:text-white font-display">94.85%</span>
                  <span className="w-7 h-7 rounded-full bg-[#2563eb] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    <TrendingUp size={14} />
                  </span>
                </div>
                <p className="text-xs text-slate-400 max-w-xs mb-6">
                  Total employees attendance rate is consistent every week
                </p>

                <div className="space-y-2.5 text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-[#2563eb]"></span>
                    <span>{t.onTimeLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-[#6BCB77]"></span>
                    <span>{t.lateLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span>
                    <span>{t.absentDeduction.split(' ')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Bar Chart Simulation */}
              <div className="flex items-end gap-3 h-44 pt-4 px-2">
                {[
                  { month: 'JAN', blue: 50, lime: 25 },
                  { month: 'FEB', blue: 70, lime: 20 },
                  { month: 'MAR', blue: 85, lime: 15 },
                  { month: 'APR', blue: 60, lime: 30 },
                  { month: 'MAY', blue: 90, lime: 10 },
                  { month: 'JUN', blue: 65, lime: 25 },
                  { month: 'JUL', blue: 80, lime: 15 },
                  { month: 'AUG', blue: 95, lime: 5 }
                ].map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-1.5 group">
                    <div className="w-7 bg-slate-100 dark:bg-slate-800 rounded-full h-36 flex flex-col justify-end p-1 overflow-hidden">
                      <div style={{ height: `${item.lime}%` }} className="w-full bg-[#6BCB77] rounded-t-full"></div>
                      <div style={{ height: `${item.blue}%` }} className="w-full bg-[#2563eb] rounded-b-full"></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-display">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Payroll Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 font-display">{t.recentLogs}</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 dark:bg-slate-950 text-slate-400 font-semibold border-b border-slate-200/80 dark:border-slate-800">
                  <tr>
                    <th className="p-3 w-10 text-center">NO</th>
                    <th className="p-3">KARYAWAN</th>
                    <th className="p-3">JABATAN</th>
                    <th className="p-3">TANGGAL</th>
                    <th className="p-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {sampleRecentLogs.map((row) => (
                    <tr key={row.no} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3 text-center font-bold text-slate-400">{row.no}</td>
                      <td className="p-3 font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                          {row.name.substring(0, 1)}
                        </div>
                        {row.name}
                      </td>
                      <td className="p-3 text-slate-500 dark:text-slate-400">{row.pos}</td>
                      <td className="p-3 text-slate-500 font-mono">{row.date}</td>
                      <td className="p-3 text-right">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${row.color}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Schedule Ribbon Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">Schedule</h3>
              <MoreHorizontal size={18} className="text-slate-400 cursor-pointer" />
            </div>
            <p className="text-xs text-slate-400 mb-5">Here's your schedule activity for today</p>

            {/* Days Ribbon */}
            <div className="flex items-center justify-between text-center mb-6 px-1">
              {[
                { day: '14', name: 'Sat' },
                { day: '15', name: 'Sun' },
                { day: '16', name: 'Mon', active: true },
                { day: '17', name: 'Tue' },
                { day: '18', name: 'Wed' },
                { day: '19', name: 'Thu' },
                { day: '20', name: 'Fri' }
              ].map((d) => (
                <div
                  key={d.day}
                  className={`flex flex-col items-center py-2 px-2.5 rounded-2xl transition-all ${
                    d.active
                      ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/30 font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-sm font-black font-display">{d.day}</span>
                  <span className="text-[10px] font-medium">{d.name}</span>
                </div>
              ))}
            </div>

            {/* 4 Vertical Pill Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#2563eb] text-white p-4 rounded-[28px] flex flex-col justify-between h-48 shadow-md shadow-[#2563eb]/20">
                <p className="text-xs font-bold leading-tight rotate-180 text-right [writing-mode:vertical-lr] font-display">
                  Meeting with ui/ux design teams
                </p>
                <div className="flex flex-col items-center gap-1 pt-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    👴
                  </div>
                  <span className="text-[9px] font-mono opacity-90">09:00 - 10:00 AM</span>
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 p-4 rounded-[28px] flex flex-col justify-between h-48 shadow-sm">
                <p className="text-xs font-bold leading-tight rotate-180 text-right [writing-mode:vertical-lr] font-display">
                  Break activity
                </p>
                <div className="flex flex-col items-center gap-1 pt-2">
                  <span className="text-[10px] font-bold text-slate-400">Weekend</span>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-[28px] flex flex-col justify-between h-48 shadow-md">
                <p className="text-xs font-bold leading-tight rotate-180 text-right [writing-mode:vertical-lr] font-display">
                  Meeting with management teams
                </p>
                <div className="flex flex-col items-center gap-1 pt-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    👩
                  </div>
                  <span className="text-[9px] font-mono opacity-90">09:00 - 10:00 AM</span>
                </div>
              </div>

              <div className="bg-[#6BCB77] text-white p-4 rounded-[28px] flex flex-col justify-between h-48 shadow-md shadow-[#6BCB77]/20">
                <p className="text-xs font-bold leading-tight rotate-180 text-right [writing-mode:vertical-lr] font-display">
                  Meeting with developer teams
                </p>
                <div className="flex flex-col items-center gap-1 pt-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                    👧
                  </div>
                  <span className="text-[9px] font-mono opacity-90">09:00 - 10:00 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promo / Platform Info Card */}
          <div className="bg-gradient-to-br from-[#6BCB77]/15 via-blue-500/10 to-slate-100 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-[32px] shadow-sm flex flex-col justify-between h-52">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white max-w-[160px] font-display">
                  Learn on how to effectively using of the platform
                </h4>
                <button className="px-3.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold text-[11px] rounded-full flex items-center gap-1 shadow-sm hover:border-[#4D96FF]">
                  Learn More <ExternalLink size={12} />
                </button>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white font-display">2,476</h3>
              <p className="text-[10px] text-slate-500 font-bold max-w-[100px] text-right">Total videos updated weekly</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
