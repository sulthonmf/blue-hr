import React, { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  Calculator,
  Building2,
  Clock,
  ArrowRight,
  Smartphone,
  Laptop,
  Check,
  Play,
  Sun,
  Moon,
  FileSpreadsheet,
} from "lucide-react";
import { RequestDemoModal } from "../components/landing/RequestDemoModal";
import { CheckoutModal, PlanItem } from "../components/landing/CheckoutModal";
import { MobilePhoneSimulator } from "../components/landing/MobilePhoneSimulator";
import { useAuthStore } from "../stores/useAuthStore";
import { useThemeStore } from "../stores/useThemeStore";

interface LandingPageProps {
  onGoToLogin: () => void;
  onGoToDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGoToLogin,
  onGoToDashboard,
}) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanItem | null>(null);
  const [activeTab, setActiveTab] = useState<"geofence" | "payroll" | "mobile">("geofence");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  // Interactive Live Payroll Calculator State
  const [simSalary, setSimSalary] = useState<number>(10000000);
  const bpjsTk = Math.round(simSalary * 0.02);
  const bpjsKes = Math.round(simSalary * 0.01);
  const estimatedTax = Math.round((simSalary - bpjsTk - bpjsKes) * 0.05);
  const takeHomePay = simSalary - bpjsTk - bpjsKes - estimatedTax;

  // Interactive Live GPS Geofence Simulator State
  const [simDistanceMeter, setSimDistanceMeter] = useState<number>(120);

  const { loginAsDemo } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const isDark = theme === "dark";

  const handleQuickDemo = (role: "admin" | "employee" | "manager" = "admin") => {
    loginAsDemo(role);
    onGoToDashboard();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className={
        isDark
          ? "min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-blue-600 selection:text-white antialiased transition-colors duration-300"
          : "min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white antialiased transition-colors duration-300"
      }
    >
      {/* Editorial Header Navigation */}
      <header
        className={
          isDark
            ? "sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80"
            : "sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm"
        }
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-3">
          {/* Brand Mark */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-blue-600/20">
              B
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight flex items-center gap-1.5">
                BlueHR{" "}
                <span className={isDark ? "text-slate-400 font-mono text-xs font-normal" : "text-slate-500 font-mono text-xs font-normal"}>
                  Enterprise
                </span>
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className={`hidden md:flex items-center gap-7 text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}>
            <button onClick={() => scrollToSection("interactive-tools")} className="hover:text-blue-600 transition-colors">
              Kalkulator Interaktif
            </button>
            <button onClick={() => scrollToSection("modules")} className="hover:text-blue-600 transition-colors">
              Modul Sistem
            </button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-blue-600 transition-colors">
              Skema Harga
            </button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-blue-600 transition-colors">
              Pertanyaan Umum
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className={
                isDark
                  ? "p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all"
                  : "p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all"
              }
              title="Ganti Tema"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={() => handleQuickDemo("admin")}
              className={
                isDark
                  ? "hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-800 transition-all items-center gap-1.5"
                  : "hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-300 transition-all items-center gap-1.5 shadow-sm"
              }
            >
              <Laptop className="w-3.5 h-3.5 text-blue-600" />
              <span>Buka Live Web App</span>
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Jadwalkan Presentasi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className={`pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className={
                isDark
                  ? "inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold"
                  : "inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold"
              }
            >
              <span>Modul Presensi GPS Geofencing, Biometrik & Payroll Terintegrasi</span>
            </div>

            <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${isDark ? "text-white" : "text-slate-900"}`}>
              Sistem Manajemen SDM & Penggajian Tanpa Kerumitan
            </h1>

            <p className={`text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              Kelola presensi karyawan lokasi real-time dengan algoritma Haversine, persetujuan cuti bertingkat 2-level, dan kalkulasi komponen slip gaji BPJS & PPh21 secara otomatis.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Jadwalkan Presentasi Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickDemo("admin")}
                className={
                  isDark
                    ? "px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-800 transition-all flex items-center justify-center gap-2"
                    : "px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2"
                }
              >
                <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>Uji Coba Live Dashboard Admin</span>
              </button>
            </div>

            {/* Quick Demo Role Selectors */}
            <div className={`pt-2 flex items-center gap-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              <span>Demo Role:</span>
              <button onClick={() => handleQuickDemo("admin")} className="text-blue-600 hover:underline font-semibold">
                ● Admin HR
              </button>
              <button onClick={() => handleQuickDemo("manager")} className="text-indigo-600 hover:underline font-semibold">
                ● Manager
              </button>
              <button onClick={() => handleQuickDemo("employee")} className="text-emerald-600 hover:underline font-semibold">
                ● Karyawan
              </button>
            </div>
          </div>

          {/* Hero Right Graphic Card */}
          <div className="lg:col-span-5">
            <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-xl space-y-4"}>
              <div className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}>Sudirman HQ Geofence Engine</span>
                </div>
                <span className={isDark ? "text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800" : "text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"}>
                  Haversine v2.4
                </span>
              </div>

              {/* Functional Mini Specs */}
              <div className="space-y-2.5 text-xs">
                <div className={isDark ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between" : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"}>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Koordinat Kantor:</span>
                  <span className={`font-mono font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}>-6.2088, 106.8456</span>
                </div>
                <div className={isDark ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between" : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"}>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Toleransi Radius:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">1.0 kilometer</span>
                </div>
                <div className={isDark ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between" : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"}>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Keamanan Perangkat:</span>
                  <span className="font-semibold text-blue-600 dark:text-cyan-400">Biometrik FaceID + Root Block</span>
                </div>
                <div className={isDark ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between" : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"}>
                  <span className={isDark ? "text-slate-400" : "text-slate-500"}>Kalkulasi Payroll:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">BPJS Ketenagakerjaan + PPh21</span>
                </div>
              </div>

              <div className={`pt-1 text-[11px] text-center border-t ${isDark ? "text-slate-400 border-slate-800/60" : "text-slate-500 border-slate-100"}`}>
                ✓ Siap di-deploy ke Vercel tanpa perlu setup database lokal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOOLS SECTION */}
      <section id="interactive-tools" className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Simulasi Interaktif Produk</h2>
          <h3 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Uji Coba Langsung Modul Utama BlueHR
          </h3>
          <p className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}>
            Coba kalkulator slip gaji dan simulator presensi GPS di bawah ini untuk melihat akurasi perhitungan sistem.
          </p>

          {/* Switcher Tabs */}
          <div className={`mt-6 inline-flex p-1 rounded-xl border text-xs ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <button
              onClick={() => setActiveTab("geofence")}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                activeTab === "geofence"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Simulator Radius GPS
            </button>
            <button
              onClick={() => setActiveTab("payroll")}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                activeTab === "payroll"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kalkulator Slip Gaji & PPh21
            </button>
            <button
              onClick={() => setActiveTab("mobile")}
              className={`px-5 py-2 rounded-lg font-bold transition-all ${
                activeTab === "mobile"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Aplikasi Mobile Phone
            </button>
          </div>
        </div>

        {/* TOOL 1: GPS GEOFENCE SIMULATOR */}
        {activeTab === "geofence" && (
          <div className={isDark ? "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl" : "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xl"}>
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
              <div>
                <h4 className={`font-bold text-base flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Pengujian Jarak Presensi GPS (Haversine Formula)
                </h4>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Atur jarak lokasi karyawan ke titik pusat kantor Sudirman HQ (Maksimal Radius Toleransi: 1,000 meter / 1.0 km).
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  simDistanceMeter <= 1000
                    ? isDark
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isDark
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {simDistanceMeter <= 1000 ? "VALID: DALAM RADIUS KANTOR" : "DITOLAK: DI LUAR RADIUS"}
              </div>
            </div>

            {/* Slider Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>Jarak Simulasi Perangkat:</span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{simDistanceMeter} meter ({(simDistanceMeter / 1000).toFixed(2)} km)</span>
              </div>
              <input
                type="range"
                min="50"
                max="3000"
                step="50"
                value={simDistanceMeter}
                onChange={(e) => setSimDistanceMeter(Number(e.target.value))}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600 ${isDark ? "bg-slate-950" : "bg-slate-200"}`}
              />
              <div className={`flex justify-between text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}>
                <span>50m (Depan Pintu)</span>
                <span>500m (Gedung Parkir)</span>
                <span>1,000m (Batas Maksimal)</span>
                <span>3,000m (Luar Wilayah)</span>
              </div>
            </div>

            {/* Calculation Output Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className={isDark ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800" : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"}>
                <span className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Status Presensi:</span>
                <span className={`font-bold mt-1 block ${simDistanceMeter <= 1000 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                  {simDistanceMeter <= 1000 ? "✓ Diizinkan Clock-In" : "❌ Ditolak (Luar Radius)"}
                </span>
              </div>

              <div className={isDark ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800" : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"}>
                <span className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Perhitungan Haversine:</span>
                <span className={`font-mono font-semibold mt-1 block ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                  d = 2r × arcsin(√h) = {(simDistanceMeter / 1000).toFixed(3)} km
                </span>
              </div>

              <div className={isDark ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800" : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"}>
                <span className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Keamanan Biometrik:</span>
                <span className="font-semibold text-blue-600 dark:text-cyan-400 mt-1 block">
                  FaceID Verified + Mock Location Clean
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: PAYROLL & PPH21 CALCULATOR */}
        {activeTab === "payroll" && (
          <div className={isDark ? "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl" : "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xl"}>
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}>
              <div>
                <h4 className={`font-bold text-base flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}>
                  <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Kalkulator Potongan BPJS & Estimasi PPh 21
                </h4>
                <p className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Masukkan besaran Gaji Pokok untuk mensimulasikan potongan BPJS dan kalkulasi Take Home Pay.
                </p>
              </div>
              <span className={isDark ? "text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800" : "text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"}>
                Otomatisasi PPh 21 TER
              </span>
            </div>

            {/* Input Salary */}
            <div className="space-y-2">
              <label className={`block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                Gaji Pokok Karyawan (Rp):
              </label>
              <input
                type="number"
                step="500000"
                value={simSalary}
                onChange={(e) => setSimSalary(Number(e.target.value))}
                className={
                  isDark
                    ? "w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    : "w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                }
              />
            </div>

            {/* Payroll Breakdown Output */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className={isDark ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800" : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"}>
                <span className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>Gaji Pokok:</span>
                <span className={`font-mono font-bold text-sm mt-1 block ${isDark ? "text-white" : "text-slate-900"}`}>
                  Rp {simSalary.toLocaleString("id-ID")}
                </span>
              </div>

              <div className={isDark ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800" : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"}>
                <span className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>BPJS Ketenagakerjaan (2%):</span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-1 block">
                  - Rp {bpjsTk.toLocaleString("id-ID")}
                </span>
              </div>

              <div className={isDark ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800" : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"}>
                <span className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}>BPJS Kesehatan (1%):</span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-1 block">
                  - Rp {bpjsKes.toLocaleString("id-ID")}
                </span>
              </div>

              <div className={isDark ? "p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/80" : "p-3.5 rounded-xl bg-blue-50 border border-blue-200"}>
                <span className={isDark ? "text-blue-300 block text-[10px] font-semibold" : "text-blue-700 block text-[10px] font-semibold"}>Gaji Bersih (Take Home Pay):</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-1 block">
                  Rp {takeHomePay.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 3: MOBILE APP SIMULATOR */}
        {activeTab === "mobile" && (
          <div className="flex justify-center">
            <MobilePhoneSimulator />
          </div>
        )}
      </section>

      {/* CORE MODULES */}
      <section id="modules" className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Modul Utama Sistem</h2>
          <h3 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Fitur Spesifik BlueHR Enterprise
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"}>
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Presensi Geofencing & Biometrik</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Mengevaluasi koordinat GPS karyawan saat clock-in/clock-out, verifikasi FaceID perangkat, serta memblokir penggunaan alat GPS spoofing / mock location.
            </p>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Approval Cuti 2-Tingkat</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Alur persetujuan permohonan cuti bertingkat (APPROVED_L1 oleh Manager Departemen dan APPROVED oleh HR Lead) dengan potongan otomatis kuota cuti tahunan.
            </p>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Payroll Automated & Slip PDF</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Kalkulasi gaji pokok, tunjangan, potongan keterlambatan, BPJS Ketenagakerjaan, BPJS Kesehatan, dan PPh21 beserta pengunduhan slip gaji digital.
            </p>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"}>
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Struktur Korporasi 4-Tingkat</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Manajemen bagan organisasi interaktif dari Direksi ➔ Divisi ➔ Departemen ➔ Karyawan (NIP: EMP-XXXX) dan Kartu Pegawai Digital dengan QR Code.
            </p>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"}>
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>Manajemen Shift & Penukaran Shift</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Pengaturan pola kerja shift, modul pengajuan lembur (overtime) kompensasi otomatis, dan fasilitas penukaran jadwal shift antar rekan kerja.
            </p>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"}>
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}>KPI Performance & Dokumentasi</h4>
            <p className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}>
              Monitoring Key Performance Indicator (KPI) berkala, inventaris aset yang dipinjamkan, repositori dokumen resmi, dan portal rekrutmen pelamar.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}>
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">Pilihan Lisensi</h2>
          <h3 className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}>
            Skema Biaya Transparan Tanpa Biaya Tersembunyi
          </h3>

          <div className={`mt-6 inline-flex items-center gap-3 p-1 rounded-xl border text-xs ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all ${
                billingCycle === "monthly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Bayar Bulanan
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Bayar Tahunan</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px]">
                DISKON 20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"}>
            <div>
              <div className={isDark ? "text-xs font-bold text-slate-400 uppercase" : "text-xs font-bold text-slate-500 uppercase"}>Starter Plan</div>
              <div className={`text-2xl font-extrabold mt-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                {billingCycle === "annual" ? "Rp 399.000" : "Rp 499.000"}
                <span className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}> / bulan</span>
              </div>
              <div className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Hingga 50 Karyawan Aktif</div>

              <ul className={`mt-6 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Presensi Geofencing GPS
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Mobile App (Android & iOS)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Pengajuan Cuti Standard
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedPlanForCheckout({
                  id: "starter",
                  name: "Starter Plan",
                  priceMonthly: "Rp 499.000",
                  priceAnnual: "Rp 399.000",
                  maxEmployees: "Hingga 50 Karyawan Aktif",
                  features: ["Presensi Geofencing GPS", "Mobile App (Android & iOS)", "Pengajuan Cuti Standard"],
                });
                setIsCheckoutModalOpen(true);
              }}
              className={isDark ? "mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all" : "mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all"}
            >
              Pilih Paket Starter
            </button>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border-2 border-blue-500 flex flex-col justify-between relative shadow-xl" : "p-6 rounded-2xl bg-white border-2 border-blue-600 flex flex-col justify-between relative shadow-xl"}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] tracking-wider uppercase shadow-sm">
              REKOMENDASI KORPORASI
            </div>

            <div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">Growth Business</div>
              <div className={`text-2xl font-extrabold mt-4 ${isDark ? "text-white" : "text-slate-900"}`}>
                {billingCycle === "annual" ? "Rp 1.199.000" : "Rp 1.499.000"}
                <span className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}> / bulan</span>
              </div>
              <div className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Hingga 200 Karyawan Aktif</div>

              <ul className={`mt-6 space-y-2.5 text-xs ${isDark ? "text-slate-200" : "text-slate-700"}`}>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" /> Semuanya di Paket Starter
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" /> Biometrik FaceID & Root Detection
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" /> Approval Cuti Multi-Level (2 Level)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" /> Kalkulasi Payroll BPJS & PPh21
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                setSelectedPlanForCheckout({
                  id: "business",
                  name: "Growth Business Plan",
                  priceMonthly: "Rp 1.499.000",
                  priceAnnual: "Rp 1.199.000",
                  maxEmployees: "Hingga 200 Karyawan Aktif",
                  features: [
                    "Semuanya di Paket Starter",
                    "Biometrik FaceID & Root Detection",
                    "Approval Cuti Multi-Level (2 Level)",
                    "Kalkulasi Payroll BPJS & PPh21",
                  ],
                });
                setIsCheckoutModalOpen(true);
              }}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
            >
              Mulai Uji Coba & Pembayaran
            </button>
          </div>

          <div className={isDark ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between" : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"}>
            <div>
              <div className={isDark ? "text-xs font-bold text-slate-400 uppercase" : "text-xs font-bold text-slate-500 uppercase"}>Corporate Enterprise</div>
              <div className={`text-2xl font-extrabold mt-4 ${isDark ? "text-white" : "text-slate-900"}`}>Custom SLA</div>
              <div className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>Karyawan Tak Terbatas (&gt; 1,000)</div>

              <ul className={`mt-6 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Semuanya di Paket Growth
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Custom Dedicated Server & API
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> Support SLA 24/7 Dedicated
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className={isDark ? "mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all" : "mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all"}
            >
              Hubungi Tim Sales
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
        <div>
          © 2026 BlueHR Enterprise System. Diterbitkan di bawah Lisensi MIT.
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => scrollToSection("modules")} className="hover:text-blue-600 transition-colors">Modul</button>
          <button onClick={() => scrollToSection("pricing")} className="hover:text-blue-600 transition-colors">Harga</button>
          <button onClick={onGoToLogin} className="text-blue-600 font-semibold hover:underline">Portal Login Staf</button>
        </div>
      </footer>

      {/* Request Demo Modal */}
      <RequestDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDemo={() => handleQuickDemo("admin")}
      />

      {/* Mock Payment Gateway Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        selectedPlan={selectedPlanForCheckout}
        billingCycle={billingCycle}
        onPaymentSuccess={(details) => {
          const planId = (selectedPlanForCheckout?.id as any) || "starter";
          useAuthStore.getState().loginAsDemo("admin", planId);
          onGoToDashboard();
        }}
      />
    </div>
  );
};
