import React, { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useHRStore } from "../../stores/useHRStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";
import {
  LogOut,
  Sun,
  Moon,
  Globe,
  Search,
  Mic,
  Plus,
  Download,
  Bell,
  CheckCheck,
  Megaphone,
  Calendar,
  Clock,
  ChevronDown,
  Users,
  CreditCard,
} from "lucide-react";

export const Navbar: React.FC<{
  onOpenActionModal?: () => void;
  onNavigate?: (tab: string) => void;
}> = ({ onOpenActionModal, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const { notifications, markNotificationsRead } = useHRStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLanguage, t } = useLanguageStore();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotifMeta = (type: string) => {
    switch (type) {
      case 'LEAVE':
        return { icon: Calendar, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60' };
      case 'ATTENDANCE':
        return { icon: Clock, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60' };
      case 'ANNOUNCEMENT':
        return { icon: Megaphone, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60' };
      default:
        return { icon: Bell, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60' };
    }
  };

  return (
    <header className="w-full mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-30 font-sans">
      {/* Search Input Bar */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        <div className="relative flex-1">
          <label htmlFor="global-search" className="sr-only">Search</label>
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="global-search"
            type="text"
            placeholder={t.searchPlaceholder || "Search..."}
            aria-label="Search input"
            className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/40 shadow-sm"
          />
        </div>
        <button
          className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#2563eb] transition-all shadow-sm"
          title="Voice Search"
          aria-label="Pencarian Suara"
        >
          <Mic size={16} />
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Export Button */}
        <button
          onClick={() => alert("Exporting data to CSV/PDF...")}
          aria-label="Ekspor Data"
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#2563eb] transition-all shadow-sm"
        >
          <Download size={14} />
          <span>{t.export}</span>
        </button>

        {/* + Add new entry Quick Action Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            aria-label="Tambah Data Baru"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-extrabold shadow-md hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer"
          >
            <Plus size={16} />
            <span>{t.addNewEntry || "Tambah Data Baru"}</span>
            <ChevronDown size={14} className={`transition-transform ${isActionMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {isActionMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-2 space-y-1 font-sans text-xs animate-in fade-in zoom-in-95">
              <p className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">TINDAKAN CEPAT</p>
              
              <button
                onClick={() => { onNavigate?.("employees"); setIsActionMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <Users size={14} className="text-blue-600" />
                <span>Registrasi Karyawan Baru</span>
              </button>

              <button
                onClick={() => { onNavigate?.("attendance"); setIsActionMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <Clock size={14} className="text-emerald-600" />
                <span>Presensi & Absensi</span>
              </button>

              <button
                onClick={() => { onNavigate?.("schedules"); setIsActionMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <Calendar size={14} className="text-purple-600" />
                <span>Pesan Ruang Rapat</span>
              </button>

              <button
                onClick={() => { onNavigate?.("announcements"); setIsActionMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <Megaphone size={14} className="text-amber-600" />
                <span>Buat Pengumuman</span>
              </button>

              <button
                onClick={() => { onNavigate?.("reimbursements"); setIsActionMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <CreditCard size={14} className="text-cyan-600" />
                <span>Klaim Reimbursement</span>
              </button>

              <button
                onClick={() => { onNavigate?.("offboarding"); setIsActionMenuOpen(false); }}
                className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-bold flex items-center gap-2 transition-all"
              >
                <LogOut size={14} className="text-rose-600" />
                <span>Pengajuan Resign</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Pill */}
        <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1 rounded-full shadow-sm">
          <button
            onClick={toggleTheme}
            aria-label="Mode Terang"
            className={`p-1.5 rounded-full transition-all ${
              theme === "light"
                ? "bg-slate-100 text-amber-500 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
            title="Light Mode"
          >
            <Sun size={15} />
          </button>
          <button
            onClick={toggleTheme}
            aria-label="Mode Gelap"
            className={`p-1.5 rounded-full transition-all ${
              theme === "dark"
                ? "bg-slate-800 text-indigo-400 shadow-sm"
                : "text-slate-400 hover:text-slate-900"
            }`}
            title="Dark Mode"
          >
            <Moon size={15} />
          </button>
        </div>

        {/* Language Switcher */}
        <button
          onClick={toggleLanguage}
          aria-label="Ganti Bahasa"
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#2563eb] shadow-sm transition-all"
        >
          <Globe size={14} className="text-[#2563eb]" />
          <span>{lang}</span>
        </button>

        {/* Notification Bell Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            aria-label="Pusat Notifikasi"
            className="p-2.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#2563eb] transition-all shadow-sm relative"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-black flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Interactive Notification Center Popover */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">
                    {t.notificationsTitle}
                  </h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-[#2563eb]/15 text-[#2563eb] text-[10px] font-bold rounded-full">
                      {unreadCount} {t.newBadge}
                    </span>
                  )}
                </div>

                <button
                  onClick={markNotificationsRead}
                  className="text-[11px] font-bold text-[#2563eb] hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={13} />
                  {t.markAllRead}
                </button>
              </div>

              <div className="space-y-2 mt-3 max-h-80 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">Belum ada notifikasi.</p>
                ) : (
                  notifications.map((n) => {
                    const meta = getNotifMeta(n.type);
                    const Icon = meta.icon;
                    return (
                      <div
                        key={n.id}
                        className={`p-3 rounded-2xl border transition-all flex items-start gap-3 ${
                          n.read
                            ? "bg-slate-50/50 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/60 opacity-70"
                            : "bg-blue-50/30 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40"
                        }`}
                      >
                        <div className={`p-2 rounded-xl shrink-0 ${meta.color}`}>
                          <Icon size={16} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                              {n.title}
                            </h5>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Hari Ini'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                            {n.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        {user && (
          <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full pl-1.5 pr-3 py-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563eb] to-blue-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              {user.name.substring(0, 1).toUpperCase()}
            </div>
            <div className="hidden lg:block text-left pr-1">
              <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5">
                {user.name.split(" ")[0]}
                <span className="text-[9px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-950 text-[#2563eb] dark:text-blue-400 rounded-md font-extrabold">
                  EMP-{String(user.id).padStart(4, '0')}
                </span>
              </p>
              <p className="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
                {user.email}
              </p>
            </div>
            <button
              onClick={logout}
              title={t.logout}
              className="p-1 text-slate-400 hover:text-rose-600 transition-colors ml-1"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
