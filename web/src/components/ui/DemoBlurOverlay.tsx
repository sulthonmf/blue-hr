import React from "react";
import { Lock, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react";

interface DemoBlurOverlayProps {
  moduleName: string;
  moduleDescription?: string;
  children: React.ReactNode;
  onRequestDemo: () => void;
  onNavigateUnlocked: (tab: string) => void;
}

export const DemoBlurOverlay: React.FC<DemoBlurOverlayProps> = ({
  moduleName,
  moduleDescription = "Modul ini merupakan bagian dari paket BlueHR Corporate Enterprise yang mencakup manajemen data kompleks, integrasi API, dan hak akses bertingkat.",
  children,
  onRequestDemo,
  onNavigateUnlocked,
}) => {
  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden rounded-2xl">
      {/* Underlying Blurred Content View */}
      <div className="w-full h-full filter blur-[7px] opacity-40 select-none pointer-events-none transition-all">
        {children}
      </div>

      {/* Foreground Teaser Floating Lock Card */}
      <div className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-[2px]">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-5 animate-fade-in">
          
          {/* Lock Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 p-0.5 mx-auto shadow-lg shadow-blue-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-cyan-400">
              <Lock className="w-7 h-7" />
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 text-[11px] font-extrabold uppercase tracking-wider mb-2 border border-blue-200 dark:border-blue-800">
              <Sparkles className="w-3.5 h-3.5" /> Modul Enterprise Terkunci
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {moduleName}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {moduleDescription}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={onRequestDemo}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
            >
              <span>Jadwalkan Presentasi Demo Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <button
                onClick={() => onNavigateUnlocked("attendance")}
                className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-all flex items-center justify-center gap-1"
              >
                <span>Coba Presensi GPS</span>
              </button>
              <button
                onClick={() => onNavigateUnlocked("payroll")}
                className="py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-all flex items-center justify-center gap-1"
              >
                <span>Coba Slip Gaji</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
