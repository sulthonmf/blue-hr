import React, { useState } from "react";
import {
  MapPin,
  Clock,
  QrCode,
  Calendar,
  User,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Sparkles,
  RefreshCw,
  Award,
  ChevronRight,
  FileText,
  Briefcase,
} from "lucide-react";

export const MobilePhoneSimulator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"attendance" | "idcard" | "leave" | "profile">("attendance");
  const [inRadius, setInRadius] = useState<boolean>(true);
  const [biometricVerified, setBiometricVerified] = useState<boolean>(true);
  const [clockedIn, setClockedIn] = useState<boolean>(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClockIn = () => {
    if (!inRadius) {
      showToast("❌ Gagal: Lokasi di luar radius kantor (6.5 km)!");
      return;
    }
    if (!biometricVerified) {
      showToast("⚠️ Silakan verifikasi Biometrik FaceID / Sidik jari lebih dulu!");
      return;
    }
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setClockedIn(true);
    setClockInTime(now);
    showToast(`✅ Absen Masuk Berhasil pukul ${now} WIB!`);
  };

  const handleClockOut = () => {
    setClockedIn(false);
    showToast("✅ Absen Pulang Berhasil! Sampai jumpa besok.");
  };

  return (
    <div className="flex flex-col items-center">
      {/* Outer Phone Mockup Container */}
      <div className="relative w-[320px] sm:w-[350px] h-[670px] bg-slate-900 dark:bg-black rounded-[48px] p-3 shadow-2xl border-[6px] border-slate-700 dark:border-slate-800 ring-1 ring-white/10 flex flex-col justify-between">
        
        {/* Dynamic Island / Speaker Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-30 flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
          <div className="w-2 h-2 bg-blue-900/60 rounded-full"></div>
        </div>

        {/* Smartphone Screen Viewport */}
        <div className="w-full h-full bg-slate-950 text-slate-100 rounded-[38px] overflow-hidden flex flex-col pt-7 relative border border-slate-800/80">
          
          {/* Status Bar */}
          <div className="px-5 py-1 text-[11px] font-semibold flex justify-between text-slate-400 select-none border-b border-slate-800/40">
            <span>08:45 WIB</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="text-[10px] font-bold text-emerald-400">GPS REAL</span>
              <span>5G</span>
              <div className="w-4 h-2 bg-emerald-500 rounded-sm"></div>
            </div>
          </div>

          {/* Screen Header Bar */}
          <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                BS
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Budi Santoso</h4>
                <p className="text-[10px] text-slate-400">Sr. Software Engineer</p>
              </div>
            </div>
            <div className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-semibold border border-blue-500/30">
              EMP-2026-089
            </div>
          </div>

          {/* Toast Floating Alert */}
          {toastMessage && (
            <div className="absolute top-16 left-3 right-3 z-40 bg-slate-900/95 border border-blue-500/40 text-white text-[11px] px-3 py-2.5 rounded-xl shadow-xl flex items-center justify-between animate-bounce">
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Tab Screen Contents */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            
            {/* TAB 1: ATTENDANCE GEOFENCE */}
            {activeTab === "attendance" && (
              <div className="space-y-3">
                {/* Geofence Status Card */}
                <div className={`p-3 rounded-2xl border transition-all ${
                  inRadius 
                    ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" 
                    : "bg-rose-950/40 border-rose-500/40 text-rose-200"
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-400" />
                      Status Radius GPS
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      inRadius ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {inRadius ? "Dalam Radius" : "Luar Radius"}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-1">
                    {inRadius ? "📍 Menara Sudirman HQ (Jarak: 0.12 km)" : "⚠️ Di Luar Jangkauan Kantor (Jarak: 6.5 km)"}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Batas Maksimal Radius: 1.0 km
                  </div>
                </div>

                {/* Simulator GPS Toggle Buttons */}
                <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800 text-[10px]">
                  <div className="text-slate-400 mb-1.5 font-semibold text-center uppercase tracking-wider">
                    ⚡ Simulator Lokasi GPS Perangkat:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setInRadius(true)}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                        inRadius
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      Aman (0.12 km)
                    </button>
                    <button
                      onClick={() => setInRadius(false)}
                      className={`py-1.5 px-2 rounded-lg font-medium transition-all ${
                        !inRadius
                          ? "bg-rose-600 text-white shadow-sm"
                          : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                      }`}
                    >
                      Jauh (6.5 km)
                    </button>
                  </div>
                </div>

                {/* Biometric Status Toggle */}
                <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${biometricVerified ? "text-emerald-400" : "text-amber-400"}`} />
                    <div>
                      <div className="font-semibold text-white text-[11px]">FaceID / Biometrik Perangkat</div>
                      <div className="text-[9px] text-slate-400">{biometricVerified ? "Terverifikasi" : "Perlu Verifikasi"}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setBiometricVerified(!biometricVerified)}
                    className="text-[10px] text-blue-400 hover:underline font-medium"
                  >
                    {biometricVerified ? "Batal Verification" : "Verifikasi"}
                  </button>
                </div>

                {/* Main Action Clock In / Clock Out */}
                <div className="p-4 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
                  <div className="text-[11px] text-slate-400">
                    Jadwal Shift: <span className="text-white font-semibold">Regular Normal (08:00 - 17:00)</span>
                  </div>

                  {clockedIn ? (
                    <div className="space-y-2">
                      <div className="p-2 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs">
                        Telah Absen Masuk pukul <span className="font-bold">{clockInTime} WIB</span>
                      </div>
                      <button
                        onClick={handleClockOut}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <Clock className="w-4 h-4" />
                        <span>ABSEN PULANG SEKARANG</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleClockIn}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>ABSEN MASUK (PRESENSI GPS)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: DIGITAL ID CARD */}
            {activeTab === "idcard" && (
              <div className="space-y-3 text-center">
                <div className="p-4 bg-gradient-to-br from-blue-900/60 via-indigo-950 to-slate-900 rounded-2xl border border-blue-500/30 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Sparkles className="w-24 h-24 text-white" />
                  </div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 mb-2">
                    BLUEHR DIGITAL ID CARD
                  </div>
                  
                  {/* Photo Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 mx-auto mb-2 shadow-lg">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center font-bold text-xl text-white">
                      BS
                    </div>
                  </div>

                  <h3 className="font-bold text-white text-sm">Budi Santoso</h3>
                  <p className="text-[10px] text-blue-200">Senior Software Engineer</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Departemen: Technology & Engineering</p>

                  {/* QR Code Placeholder */}
                  <div className="w-28 h-28 bg-white p-2 rounded-xl mx-auto my-3 flex items-center justify-center shadow-md">
                    <QrCode className="w-full h-full text-slate-950" />
                  </div>

                  <div className="text-[10px] text-cyan-300 font-mono">
                    NIP: EMP-2026-089
                  </div>
                  <div className="inline-block px-2 py-0.5 mt-2 bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold rounded-full border border-emerald-500/30">
                    ● Status: Pegawai Tetap
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LEAVE REQUEST */}
            {activeTab === "leave" && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Sisa Kuota Cuti Tahunan</div>
                    <div className="text-lg font-bold text-cyan-400">12 Hari Hari</div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-white text-[11px] mb-1">Pengajuan Cuti Cepat</div>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs">
                    <option>Cuti Tahunan</option>
                    <option>Cuti Sakit dengan Surat Dokter</option>
                    <option>Cuti Alasan Penting</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="date" className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-300" defaultValue="2026-10-01" />
                    <input type="date" className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-[10px] text-slate-300" defaultValue="2026-10-03" />
                  </div>
                  <button
                    onClick={() => showToast("✅ Pengajuan cuti terkirim ke Manager (Level 1)!")}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-all"
                  >
                    Kirim Permohonan Cuti
                  </button>
                </div>

                {/* History Item */}
                <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-200">Cuti Libur Idul Fitri</div>
                    <div className="text-slate-400">14 Apr - 16 Apr 2026 (3 Hari)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    APPROVED
                  </span>
                </div>
              </div>
            )}

            {/* TAB 4: PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Informasi Kontak</div>
                  <div className="text-[11px] text-slate-200 space-y-1">
                    <div>📧 Email: budi.santoso@bluehr.com</div>
                    <div>📱 Telepon: +62 812-9876-5432</div>
                    <div>🏢 Cabang: Sudirman Tower HQ</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">BPJS & Pajak PPh21</div>
                  <div className="text-[11px] text-slate-200 space-y-1">
                    <div>💳 BPJS Kesehatan: 00019283746</div>
                    <div>🏥 BPJS Ketenagakerjaan: 9988776655</div>
                    <div>🧾 NPWP: 98.765.432.1-012.000</div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Bottom Navigation Tabs */}
          <div className="p-2 bg-slate-900 border-t border-slate-800/80 grid grid-cols-4 gap-1 text-center select-none">
            <button
              onClick={() => setActiveTab("attendance")}
              className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
                activeTab === "attendance" ? "text-cyan-400 bg-cyan-950/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span className="text-[9px] font-medium mt-0.5">Presensi</span>
            </button>

            <button
              onClick={() => setActiveTab("idcard")}
              className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
                activeTab === "idcard" ? "text-cyan-400 bg-cyan-950/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span className="text-[9px] font-medium mt-0.5">ID Card</span>
            </button>

            <button
              onClick={() => setActiveTab("leave")}
              className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
                activeTab === "leave" ? "text-cyan-400 bg-cyan-950/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-[9px] font-medium mt-0.5">Cuti</span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`py-1.5 flex flex-col items-center justify-center rounded-xl transition-all ${
                activeTab === "profile" ? "text-cyan-400 bg-cyan-950/40" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[9px] font-medium mt-0.5">Profil</span>
            </button>
          </div>

          {/* Android / iOS Home Indicator Line */}
          <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto my-1"></div>
        </div>
      </div>

      {/* Simulator Caption */}
      <div className="mt-3 text-center">
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          <Smartphone className="w-3.5 h-3.5 text-blue-500" />
          <span>Interactive Phone Simulator — Klik tombol di atas untuk uji coba!</span>
        </div>
      </div>
    </div>
  );
};
