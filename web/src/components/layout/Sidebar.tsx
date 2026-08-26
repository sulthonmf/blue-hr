import React from 'react';
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  Award,
  Users,
  Building2,
  Box,
  Megaphone,
  Sliders,
  ShieldCheck,
  CreditCard,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Network,
  UserPlus,
  UserX,
  GraduationCap,
  Wallet,
  Receipt,
  FileCheck2,
  LifeBuoy,
  FileText,
  ArrowLeftRight,
  MapPin
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useLanguageStore } from '../../stores/useLanguageStore';
import { useSidebarStore } from '../../stores/useSidebarStore';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuthStore();
  const { hasPermission } = useAuthStore();
  const { t } = useLanguageStore();
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  const menuGroups = [
    {
      category: 'RINGKASAN',
      items: [
        { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard, perm: null },
      ]
    },
    {
      category: 'MANAJEMEN HR',
      items: [
        { id: 'employees', label: t.employees, icon: Users, perm: null },
        { id: 'orgChart', label: 'Struktur Organisasi', icon: Network, perm: null },
        { id: 'documents', label: t.documentsTitle, icon: FileText, perm: null },
        { id: 'helpdesk', label: t.helpdeskTitle, icon: LifeBuoy, perm: null },
        { id: 'branches', label: 'Cabang Perusahaan', icon: Building2, perm: null },
        { id: 'recruitment', label: 'Perekrutan (ATS)', icon: UserPlus, perm: 'manage_users' },
        { id: 'offboarding', label: 'Offboarding & SP', icon: UserX, perm: null },
        { id: 'trainings', label: 'Pelatihan & Sertifikat', icon: GraduationCap, perm: null },
        { id: 'kpi', label: t.kpi, icon: Award, perm: null },
      ]
    },
    {
      category: 'PENGGAJIAN & KLAIM',
      items: [
        { id: 'payroll', label: 'Slip Gaji (Payroll)', icon: Wallet, perm: null },
        { id: 'overtime', label: 'Upah Lembur (SPL)', icon: Receipt, perm: null },
        { id: 'reimbursements', label: 'Klaim Reimbursement', icon: CreditCard, perm: null },
      ]
    },
    {
      category: 'WAKTU & ABSENSI',
      items: [
        { id: 'attendance', label: t.attendance, icon: Clock, perm: null },
        { id: 'fieldVisits', label: t.fieldVisitsTitle, icon: MapPin, perm: null },
        { id: 'shifts', label: 'Shift Kerja', icon: FileCheck2, perm: null },
        { id: 'shiftSwap', label: t.shiftSwapTitle, icon: ArrowLeftRight, perm: null },
        { id: 'leave', label: t.leave, icon: CalendarDays, perm: null },
      ]
    },
    {
      category: 'OPERASIONAL & ASET',
      items: [
        { id: 'schedules', label: 'Agenda & Ruang Rapat', icon: CalendarDays, perm: null },
        { id: 'assets', label: t.assets, icon: Box, perm: 'manage_assets' },
        { id: 'announcements', label: t.announcements, icon: Megaphone, perm: null },
      ]
    },
    {
      category: 'PENGATURAN SISTEM',
      items: [
        { id: 'roles', label: t.roles, icon: ShieldCheck, perm: 'manage_roles' },
        { id: 'auditLogs', label: 'Audit Log Trail', icon: ShieldCheck, perm: 'manage_settings' },
        { id: 'settings', label: t.settings, icon: Sliders, perm: 'manage_settings' },
      ]
    }
  ];

  return (
    <aside
      className={`h-full transition-all duration-300 p-4 lg:p-5 flex flex-col justify-between shrink-0 bg-white dark:bg-slate-900 rounded-[32px] shadow-sm overflow-hidden border-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex flex-col flex-1 min-h-0">
        {/* Top Brand Logo & Collapse Toggle */}
        <div className="flex items-center justify-between mb-4 px-1 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2563eb] flex items-center justify-center font-black text-white text-base shadow-sm">
                B
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-display">
                BlueHR<span className="text-[#2563eb]">.</span>
              </span>
            </div>
          )}

          {/* Minimize / Expand Toggle Icon */}
          <button
            onClick={toggleSidebar}
            aria-label={isCollapsed ? 'Expand Sidebar Navigation' : 'Minimize Sidebar Navigation'}
            className={`p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all ${
              isCollapsed ? 'mx-auto' : ''
            }`}
            title={isCollapsed ? 'Expand Sidebar' : 'Minimize Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        </div>

        {/* Floating Categorized Menu Card Container */}
        <nav role="navigation" aria-label="Sidebar Menu Navigation" className={`flex-1 overflow-y-auto space-y-3 p-2 rounded-3xl scrollbar-none ${!isCollapsed ? 'bg-slate-50/80 dark:bg-slate-950/60' : ''}`}>
          {menuGroups.map((group, groupIdx) => {
            const visibleItems = group.items.filter(item => !item.perm || hasPermission(item.perm));
            if (visibleItems.length === 0) return null;

            return (
              <div key={groupIdx} className="space-y-1">
                {!isCollapsed && (
                  <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 pt-2 pb-1 font-display">
                    {group.category}
                  </div>
                )}
                {isCollapsed && groupIdx > 0 && (
                  <div className="my-2 border-t border-slate-200/60 dark:border-slate-800/60" />
                )}
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center text-left gap-3 py-2.5 rounded-2xl font-bold text-xs transition-all ${
                        isCollapsed ? 'justify-center px-0' : 'px-3.5'
                      } ${
                        isActive
                          ? 'bg-[#2563eb] text-white shadow-md shadow-[#2563eb]/25'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {!isCollapsed && <span className="text-left leading-tight flex-1">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Pill Card */}
      {user && (
        <div className={`mt-4 shrink-0 ${isCollapsed ? 'text-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#2563eb] to-blue-500 flex items-center justify-center text-white font-bold text-xs mx-auto shadow-sm">
              {user.name.substring(0, 1).toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563eb] to-blue-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                  {user.name.substring(0, 1).toUpperCase()}
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-xs font-extrabold text-slate-900 dark:text-white leading-tight truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </div>
              <ChevronRight size={14} className="text-slate-400 shrink-0" />
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

