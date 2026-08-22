import React from 'react';
import { useFrameStore } from '../../stores/useFrameStore';
import { Smartphone, Monitor } from 'lucide-react';

export const MobileWebFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deviceMode } = useFrameStore();

  if (deviceMode === 'WEB') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 py-8">
      {/* Device Header Info */}
      <div className="mb-4 flex items-center gap-3 bg-slate-900/90 backdrop-blur border border-slate-800 px-4 py-2 rounded-full text-xs text-slate-300 shadow-xl">
        <span className="flex items-center gap-1.5 font-medium text-brand-400">
          <Smartphone size={14} />
          {deviceMode === 'IOS' ? 'Apple iPhone 15 Pro Frame' : 'Google Pixel 8 Frame'}
        </span>
        <span className="text-slate-600">•</span>
        <span className="text-slate-400">Responsive Native Mobile Preview</span>
      </div>

      {/* Phone Shell */}
      <div
        className={`relative transition-all duration-300 shadow-2xl overflow-hidden bg-slate-950 border-[10px] ${
          deviceMode === 'IOS'
            ? 'border-slate-800 rounded-[50px] w-[393px] h-[852px] shadow-brand-500/10'
            : 'border-slate-800 rounded-[40px] w-[412px] h-[870px] shadow-indigo-500/10'
        }`}
      >
        {/* Dynamic Island / Notch */}
        {deviceMode === 'IOS' ? (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-700"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
          </div>
        ) : (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 border border-slate-800"></div>
        )}

        {/* Screen Content Container */}
        <div className="w-full h-full pt-8 pb-4 overflow-y-auto overflow-x-hidden text-sm scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  );
};
