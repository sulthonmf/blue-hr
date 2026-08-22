import React, { useState } from 'react';
import { useHRStore } from '../stores/useHRStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { RoleBuilderModal } from '../components/modules/RoleBuilderModal';
import { ShieldCheck, Plus, Check, Lock } from 'lucide-react';

export const RolesPage: React.FC = () => {
  const { hasPermission } = useAuthStore();
  const { roles } = useHRStore();
  const { t } = useLanguageStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManage = hasPermission('manage_roles');

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
            <ShieldCheck className="text-[#2563eb]" size={24} />
            {t.rolesTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.rolesSub}
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2563eb] hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition-all"
          >
            <Plus size={16} />
            {t.addRoleBtn}
          </button>
        )}
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {roles.map((role) => {
          const perms: string[] = typeof role.permissions === 'string' ? JSON.parse(role.permissions) : role.permissions;
          return (
            <div key={role.id} className="bg-white dark:bg-slate-900 p-5 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">{role.name}</h3>
                  {role.is_system === 1 ? (
                    <span className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#2563eb] text-[10px] font-bold rounded-full flex items-center gap-1">
                      <Lock size={10} /> {t.systemRole}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full">
                      {t.dynamicRole}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 font-medium">{role.description}</p>

                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider font-display">{t.activePermissions}</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {perms.map((p) => (
                      <span key={p} className="px-2 py-0.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-[10px] rounded-lg flex items-center gap-1 font-medium">
                        <Check size={10} className="text-emerald-500" /> {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <RoleBuilderModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
