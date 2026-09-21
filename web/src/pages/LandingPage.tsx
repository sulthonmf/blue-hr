import React, { useState, useEffect, useRef } from "react";
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
  Users,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  Compass,
  HelpCircle,
  ArrowUp,
  Sparkles,
  CreditCard,
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
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] =
    useState<PlanItem | null>(null);
  const [activeTab, setActiveTab] = useState<"geofence" | "payroll" | "mobile">(
    "geofence",
  );
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "annual",
  );

  // Parallax & Scroll Interactive State
  const [scrollY, setScrollY] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const heroRef = useRef<HTMLDivElement>(null);

  // Interactive ROI & Efficiency Calculator State
  const [roiEmployees, setRoiEmployees] = useState<number>(65);

  // Interactive FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(
          Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)),
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleQuickDemo = (
    role: "admin" | "employee" | "manager" = "admin",
  ) => {
    loginAsDemo(role);
    onGoToDashboard();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
                <span
                  className={
                    isDark
                      ? "text-slate-400 font-mono text-xs font-normal"
                      : "text-slate-500 font-mono text-xs font-normal"
                  }
                >
                  Enterprise
                </span>
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav
            className={`hidden md:flex items-center gap-7 text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-600"}`}
          >
            <button
              onClick={() => scrollToSection("interactive-tools")}
              className="hover:text-blue-600 transition-colors"
            >
              Simulasi Presensi
            </button>
            <button
              onClick={() => scrollToSection("calculator")}
              className="hover:text-blue-600 transition-colors"
            >
              Kalkulator Efisiensi
            </button>
            <button
              onClick={() => scrollToSection("modules")}
              className="hover:text-blue-600 transition-colors"
            >
              Modul Sistem
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="hover:text-blue-600 transition-colors"
            >
              Skema Harga
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="hover:text-blue-600 transition-colors"
            >
              FAQ
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
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
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

      {/* Top Scroll Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 z-50 transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Back to Top Button */}
      {scrollY > 400 && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-blue-600/90 hover:bg-blue-600 text-white shadow-2xl backdrop-blur-md border border-blue-400/30 transition-all hover:scale-110 flex items-center justify-center group"
          title="Kembali ke atas"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      )}

      {/* HERO SECTION WITH PARALLAX */}
      <section
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className={`relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b overflow-hidden ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
      >
        {/* Parallax Ambient Orbs */}
        <div
          className="absolute -top-12 -left-12 w-96 h-96 bg-blue-600/15 dark:bg-blue-500/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 40}px, ${mousePos.y * 40 - scrollY * 0.12}px, 0)`,
          }}
        />
        <div
          className="absolute top-1/3 -right-16 w-80 h-80 bg-indigo-500/15 dark:bg-indigo-600/20 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${-mousePos.x * 45}px, ${-mousePos.y * 45 - scrollY * 0.1}px, 0)`,
          }}
        />
        <div
          className="absolute -bottom-10 left-1/3 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none transition-transform duration-300 ease-out"
          style={{
            transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25 - scrollY * 0.05}px, 0)`,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div
              className={
                isDark
                  ? "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/80 text-blue-300 text-xs font-semibold shadow-sm backdrop-blur-sm"
                  : "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-sm backdrop-blur-sm"
              }
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>
                Modul Presensi GPS Geofencing, Biometrik & Payroll Terintegrasi
              </span>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Software HRIS &amp; Payroll Indonesia: Presensi GPS, Cuti &amp;
              PPh21 Otomatis
            </h1>

            <p
              className={`text-base sm:text-lg leading-relaxed max-w-2xl font-normal ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              Solusi enterprise terpadu untuk efisiensi bisnis: kelola presensi
              karyawan real-time berbasis Geofencing GPS anti-spoofing,
              persetujuan cuti bertingkat 2-level, dan kalkulasi slip gaji BPJS
              &amp; PPh21 TER otomatis.
            </p>

            {/* Main Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Jadwalkan Presentasi Demo</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleQuickDemo("admin")}
                className={
                  isDark
                    ? "px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] shadow-sm backdrop-blur-sm"
                    : "px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-300 shadow-sm transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                }
              >
                <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                <span>Uji Coba Live Dashboard Admin</span>
              </button>
            </div>

            {/* Quick Demo Role Selectors */}
            <div
              className={`pt-2 flex flex-wrap items-center gap-3 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              <span className="font-semibold">Demo Role Cepat:</span>
              <button
                onClick={() => handleQuickDemo("admin")}
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold border border-blue-500/20 transition-all"
              >
                ● Admin HR Lead
              </button>
              <button
                onClick={() => handleQuickDemo("manager")}
                className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20 transition-all"
              >
                ● Manager Departemen
              </button>
              <button
                onClick={() => handleQuickDemo("employee")}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20 transition-all"
              >
                ● Karyawan Staff
              </button>
            </div>
          </div>

          {/* Hero Right Graphic Card with 3D Tilt & Floating Badges */}
          <div
            className="lg:col-span-5 relative"
            style={{ perspective: "1000px" }}
          >
            {/* Satellite Badge 1 (Top Left) */}
            <div
              className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md transition-transform duration-150 ease-out"
              style={{
                transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0)`,
              }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                GPS Radius: {simDistanceMeter}m
              </span>
            </div>

            {/* Satellite Badge 2 (Bottom Right) */}
            <div
              className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md transition-transform duration-150 ease-out"
              style={{
                transform: `translate3d(${-mousePos.x * 28}px, ${-mousePos.y * 28}px, 0)`,
              }}
            >
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                Midtrans 256-Bit SSL
              </span>
            </div>

            {/* Card Body with 3D tilt */}
            <div
              style={{
                transform: `rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`,
                transition: "transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)",
              }}
              className={
                isDark
                  ? "p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4 backdrop-blur-sm"
                  : "p-6 rounded-3xl bg-white/95 border border-slate-200/90 shadow-2xl space-y-4 backdrop-blur-sm"
              }
            >
              <div
                className={`flex items-center justify-between border-b pb-3 ${isDark ? "border-slate-800" : "border-slate-100"}`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span
                    className={`text-xs font-bold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Sudirman HQ Geofence Engine
                  </span>
                </div>
                <span
                  className={
                    isDark
                      ? "text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800"
                      : "text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                  }
                >
                  Haversine v2.4
                </span>
              </div>

              {/* Functional Mini Specs */}
              <div className="space-y-2.5 text-xs">
                <div
                  className={
                    isDark
                      ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                      : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  }
                >
                  <span
                    className={isDark ? "text-slate-400" : "text-slate-500"}
                  >
                    Koordinat Kantor:
                  </span>
                  <span
                    className={`font-mono font-semibold ${isDark ? "text-slate-200" : "text-slate-800"}`}
                  >
                    -6.2088, 106.8456
                  </span>
                </div>
                <div
                  className={
                    isDark
                      ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                      : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  }
                >
                  <span
                    className={isDark ? "text-slate-400" : "text-slate-500"}
                  >
                    Toleransi Radius:
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    1.0 kilometer
                  </span>
                </div>
                <div
                  className={
                    isDark
                      ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                      : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  }
                >
                  <span
                    className={isDark ? "text-slate-400" : "text-slate-500"}
                  >
                    Keamanan Perangkat:
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-cyan-400">
                    Biometrik FaceID + Root Block
                  </span>
                </div>
                <div
                  className={
                    isDark
                      ? "p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between"
                      : "p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  }
                >
                  <span
                    className={isDark ? "text-slate-400" : "text-slate-500"}
                  >
                    Kalkulasi Payroll:
                  </span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    BPJS Ketenagakerjaan + PPh21
                  </span>
                </div>
              </div>

              <div
                className={`pt-1 text-[11px] text-center border-t ${isDark ? "text-slate-400 border-slate-800/60" : "text-slate-500 border-slate-100"}`}
              >
                ✓ Siap di-deploy ke Vercel tanpa perlu setup database lokal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOOLS SECTION */}
      <section
        id="interactive-tools"
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Simulasi Interaktif Produk
          </h2>
          <h3
            className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Uji Coba Langsung Modul Utama BlueHR
          </h3>
          <p
            className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Coba kalkulator slip gaji dan simulator presensi GPS di bawah ini
            untuk melihat akurasi perhitungan sistem.
          </p>

          {/* Switcher Tabs */}
          <div
            className={`mt-6 inline-flex p-1 rounded-xl border text-xs ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
          >
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
          <div
            className={
              isDark
                ? "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl"
                : "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xl"
            }
          >
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}
            >
              <div>
                <h4
                  className={`font-bold text-base flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Pengujian Jarak Presensi GPS (Haversine Formula)
                </h4>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Atur jarak lokasi karyawan ke titik pusat kantor Sudirman HQ
                  (Maksimal Radius Toleransi: 1,000 meter / 1.0 km).
                </p>
              </div>
              <div
                className={`px-2 py-1 rounded-lg text-xs font-bold text-center ${
                  simDistanceMeter <= 1000
                    ? isDark
                      ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : isDark
                      ? "bg-rose-950 text-rose-300 border border-rose-800"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {simDistanceMeter <= 1000
                  ? "VALID: DALAM RADIUS KANTOR"
                  : "DITOLAK: DI LUAR RADIUS"}
              </div>
            </div>

            {/* Slider Input */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className={isDark ? "text-slate-400" : "text-slate-600"}>
                  Jarak Simulasi Perangkat:
                </span>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">
                  {simDistanceMeter} meter (
                  {(simDistanceMeter / 1000).toFixed(2)} km)
                </span>
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
              <div
                className={`flex justify-between text-[10px] ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                <span>50m (Depan Pintu)</span>
                <span>500m (Gedung Parkir)</span>
                <span>1,000m (Batas Maksimal)</span>
                <span>3,000m (Luar Wilayah)</span>
              </div>
            </div>

            {/* Quick Interactive Location Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span
                className={`text-xs font-semibold ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                Pintasan Lokasi:
              </span>
              {[
                { label: "📌 Meja Kerja", dist: 25 },
                { label: "🏢 Lobi Utama", dist: 90 },
                { label: "☕ Kantin", dist: 350 },
                { label: "🚧 Batas Pagar", dist: 980 },
                { label: "🚗 Luar Radius", dist: 1650 },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setSimDistanceMeter(p.dist)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                    simDistanceMeter === p.dist
                      ? "bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30 scale-105"
                      : isDark
                        ? "bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  {p.label} ({p.dist}m)
                </button>
              ))}
            </div>

            {/* Interactive Visual Radar Map */}
            <div className="relative w-full h-52 sm:h-60 rounded-3xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center p-4 shadow-inner">
              {/* Radar Grid / Concentric Circles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* 1000m Geofence Boundary (Green/Red dashed ring) */}
                <div
                  className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-2 border-dashed ${
                    simDistanceMeter <= 1000
                      ? "border-emerald-500/50 bg-emerald-500/5"
                      : "border-rose-500/50 bg-rose-500/5"
                  } transition-colors duration-300`}
                />
                {/* 500m Inner Ring */}
                <div className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-blue-500/20" />
                {/* Crosshairs */}
                <div className="absolute w-full h-[1px] bg-slate-800/80" />
                <div className="absolute h-full w-[1px] bg-slate-800/80" />
                {/* Radar Sweep Effect */}
                <div className="absolute w-44 h-44 sm:w-52 sm:h-52 rounded-full animate-spin duration-[5000ms] border-t border-r border-cyan-400/30 bg-gradient-to-tr from-transparent via-transparent to-cyan-500/10 pointer-events-none" />
              </div>

              {/* Center Office Pin (Sudirman HQ) */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg shadow-blue-500/50 animate-pulse">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-bold text-blue-300 bg-slate-950/90 px-2 py-0.5 rounded-full mt-1 border border-blue-800 backdrop-blur-sm">
                  Sudirman HQ (Pusat)
                </span>
              </div>

              {/* Moving Employee Pin based on simDistanceMeter */}
              <div
                className="absolute z-20 flex flex-col items-center transition-all duration-300 ease-out pointer-events-none"
                style={{
                  transform: `translate(${Math.min(145, (simDistanceMeter / 1000) * 88)}px, -${Math.min(105, (simDistanceMeter / 1000) * 62)}px)`,
                }}
              >
                <div
                  className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-xl ${
                    simDistanceMeter <= 1000
                      ? "bg-emerald-500 shadow-emerald-500/50"
                      : "bg-rose-500 shadow-rose-500/50"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-white" />
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 border shadow-sm ${
                    simDistanceMeter <= 1000
                      ? "bg-emerald-950/90 text-emerald-300 border-emerald-700"
                      : "bg-rose-950/90 text-rose-300 border-rose-700"
                  }`}
                >
                  {simDistanceMeter}m
                </span>
              </div>

              {/* Radar Status Overlay */}
              <div className="absolute bottom-3 left-4 text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Radius Maks: 1.000m</span>
                </div>
                <span className="text-slate-600">•</span>
                <span
                  className={
                    simDistanceMeter <= 1000
                      ? "text-emerald-400 font-bold"
                      : "text-rose-400 font-bold"
                  }
                >
                  {simDistanceMeter <= 1000
                    ? "● LIVE IN-RANGE"
                    : "● LIVE OUT-OF-RANGE"}
                </span>
              </div>
            </div>

            {/* Calculation Output Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                }
              >
                <span
                  className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Status Presensi:
                </span>
                <span
                  className={`font-bold mt-1 block ${simDistanceMeter <= 1000 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
                >
                  {simDistanceMeter <= 1000
                    ? "✓ Diizinkan Clock-In"
                    : "❌ Ditolak (Luar Radius)"}
                </span>
              </div>

              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                }
              >
                <span
                  className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Perhitungan Haversine:
                </span>
                <span
                  className={`font-mono font-semibold mt-1 block ${isDark ? "text-slate-200" : "text-slate-800"}`}
                >
                  d = 2r × arcsin(√h) = {(simDistanceMeter / 1000).toFixed(3)}{" "}
                  km
                </span>
              </div>

              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                }
              >
                <span
                  className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Keamanan Biometrik:
                </span>
                <span className="font-semibold text-blue-600 dark:text-cyan-400 mt-1 block">
                  FaceID Verified + Mock Location Clean
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TOOL 2: PAYROLL & PPH21 CALCULATOR */}
        {activeTab === "payroll" && (
          <div
            className={
              isDark
                ? "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl"
                : "max-w-4xl mx-auto p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xl"
            }
          >
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 ${isDark ? "border-slate-800" : "border-slate-100"}`}
            >
              <div>
                <h4
                  className={`font-bold text-base flex items-center gap-2 ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  Kalkulator Potongan BPJS & Estimasi PPh 21
                </h4>
                <p
                  className={`text-xs mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Masukkan besaran Gaji Pokok untuk mensimulasikan potongan BPJS
                  dan kalkulasi Take Home Pay.
                </p>
              </div>
              <span
                className={
                  isDark
                    ? "text-xs font-mono font-bold text-emerald-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800"
                    : "text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200"
                }
              >
                Otomatisasi PPh 21 TER
              </span>
            </div>

            {/* Input Salary */}
            <div className="space-y-2">
              <label
                className={`block text-xs font-semibold ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
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
              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                }
              >
                <span
                  className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Gaji Pokok:
                </span>
                <span
                  className={`font-mono font-bold text-sm mt-1 block ${isDark ? "text-white" : "text-slate-900"}`}
                >
                  Rp {simSalary.toLocaleString("id-ID")}
                </span>
              </div>

              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                }
              >
                <span
                  className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  BPJS Ketenagakerjaan (2%):
                </span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-1 block">
                  - Rp {bpjsTk.toLocaleString("id-ID")}
                </span>
              </div>

              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                    : "p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                }
              >
                <span
                  className={`block text-[10px] ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  BPJS Kesehatan (1%):
                </span>
                <span className="font-mono font-semibold text-rose-600 dark:text-rose-400 mt-1 block">
                  - Rp {bpjsKes.toLocaleString("id-ID")}
                </span>
              </div>

              <div
                className={
                  isDark
                    ? "p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/80"
                    : "p-3.5 rounded-xl bg-blue-50 border border-blue-200"
                }
              >
                <span
                  className={
                    isDark
                      ? "text-blue-300 block text-[10px] font-semibold"
                      : "text-blue-700 block text-[10px] font-semibold"
                  }
                >
                  Gaji Bersih (Take Home Pay):
                </span>
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
      <section
        id="modules"
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
      >
        <div className="text-center mb-14">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Modul Utama Sistem
          </h2>
          <h3
            className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Fitur Spesifik BlueHR Enterprise
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            }
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h4
              className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Presensi Geofencing & Biometrik
            </h4>
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Mengevaluasi koordinat GPS karyawan saat clock-in/clock-out,
              verifikasi FaceID perangkat, serta memblokir penggunaan alat GPS
              spoofing / mock location.
            </p>
          </div>

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            }
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h4
              className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Approval Cuti 2-Tingkat
            </h4>
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Alur persetujuan permohonan cuti bertingkat (APPROVED_L1 oleh
              Manager Departemen dan APPROVED oleh HR Lead) dengan potongan
              otomatis kuota cuti tahunan.
            </p>
          </div>

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            }
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <h4
              className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Payroll Automated & Slip PDF
            </h4>
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Kalkulasi gaji pokok, tunjangan, potongan keterlambatan, BPJS
              Ketenagakerjaan, BPJS Kesehatan, dan PPh21 beserta pengunduhan
              slip gaji digital.
            </p>
          </div>

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            }
          >
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h4
              className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Struktur Korporasi 4-Tingkat
            </h4>
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Manajemen bagan organisasi interaktif dari Direksi ➔ Divisi ➔
              Departemen ➔ Karyawan (NIP: EMP-XXXX) dan Kartu Pegawai Digital
              dengan QR Code.
            </p>
          </div>

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            }
          >
            <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h4
              className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Manajemen Shift & Penukaran Shift
            </h4>
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Pengaturan pola kerja shift, modul pengajuan lembur (overtime)
              kompensasi otomatis, dan fasilitas penukaran jadwal shift antar
              rekan kerja.
            </p>
          </div>

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3"
            }
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4
              className={`font-bold text-base ${isDark ? "text-white" : "text-slate-900"}`}
            >
              KPI Performance & Dokumentasi
            </h4>
            <p
              className={`text-xs leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Monitoring Key Performance Indicator (KPI) berkala, inventaris
              aset yang dipinjamkan, repositori dokumen resmi, dan portal
              rekrutmen pelamar.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROI & BUSINESS EFFICIENCY CALCULATOR */}
      <section
        id="calculator"
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 shadow-sm">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>Kalkulator Efisiensi Bisnis</span>
          </div>
          <h2
            className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Hitung Berapa Jam & Biaya yang Dihemat Perusahaan Anda
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Geser slider jumlah karyawan aktif Anda untuk melihat estimasi
            otomatis penghematan jam kerja tim HR dan kalkulasi biaya
            operasional.
          </p>
        </div>

        <div
          className={`max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl border shadow-xl ${isDark ? "bg-slate-900/90 border-slate-800 backdrop-blur-sm" : "bg-white border-slate-200"}`}
        >
          {/* Employee Count Slider */}
          <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex justify-between items-center">
              <span
                className={`text-xs sm:text-sm font-bold flex items-center gap-2 ${isDark ? "text-slate-200" : "text-slate-800"}`}
              >
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Jumlah Karyawan Aktif:
              </span>
              <span className="px-4 py-1 rounded-xl bg-blue-600 text-white font-mono font-bold text-sm sm:text-base shadow-sm">
                {roiEmployees} Karyawan
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="500"
              step="5"
              value={roiEmployees}
              onChange={(e) => setRoiEmployees(Number(e.target.value))}
              className={`w-full h-2.5 rounded-lg appearance-none cursor-pointer accent-blue-600 ${isDark ? "bg-slate-950" : "bg-slate-200"}`}
            />
            <div
              className={`flex justify-between text-[11px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              <span>5 Karyawan (Startup)</span>
              <span>50 Karyawan (Starter)</span>
              <span>200 Karyawan (Business)</span>
              <span>500+ Karyawan (Enterprise)</span>
            </div>
          </div>

          {/* Interactive Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-center">
            <div
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div
                className={`text-2xl font-black ${isDark ? "text-white" : "text-slate-900"}`}
              >
                ~{Math.round(roiEmployees * 0.45)} Jam
              </div>
              <div
                className={`text-xs font-semibold mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                Waktu HR Dihemat / Bulan
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Otomatisasi rekap absen, izin cuti & persetujuan lembur
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                Rp {(roiEmployees * 125000).toLocaleString("id-ID")}
              </div>
              <div
                className={`text-xs font-semibold mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                Estimasi Efisiensi Biaya / Bulan
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Bebas cetak kertas fisik, mesin fingerprint & lisensi terpisah
              </p>
            </div>

            <div
              className={`p-4 rounded-2xl border transition-all hover:scale-[1.02] ${isDark ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                5 Menit
              </div>
              <div
                className={`text-xs font-semibold mt-1 ${isDark ? "text-slate-400" : "text-slate-600"}`}
              >
                Perhitungan Payroll & PPh21
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Dahulu 3-5 hari manual Excel, kini 1-klik terbit slip gaji
              </p>
            </div>
          </div>

          {/* Recommended Plan Callout */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-cyan-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                Rekomendasi Paket Berdasarkan {roiEmployees} Karyawan:
              </span>
              <div
                className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {roiEmployees <= 50
                  ? "Starter Plan — Hingga 50 Karyawan Aktif"
                  : roiEmployees <= 200
                    ? "Growth Business Plan — Hingga 200 Karyawan Aktif"
                    : "Corporate Enterprise Plan — Karyawan Tak Terbatas"}
              </div>
            </div>

            <button
              onClick={() => {
                const planId =
                  roiEmployees <= 50
                    ? "starter"
                    : roiEmployees <= 200
                      ? "business"
                      : "enterprise";
                const planNames: Record<string, string> = {
                  starter: "Starter Plan",
                  business: "Growth Business Plan",
                  enterprise: "Corporate Enterprise Plan",
                };
                const pricesM: Record<string, string> = {
                  starter: "Rp 499.000",
                  business: "Rp 1.499.000",
                  enterprise: "Custom SLA",
                };
                const pricesA: Record<string, string> = {
                  starter: "Rp 399.000",
                  business: "Rp 1.199.000",
                  enterprise: "Custom SLA",
                };
                const maxEmps: Record<string, string> = {
                  starter: "Hingga 50 Karyawan Aktif",
                  business: "Hingga 200 Karyawan Aktif",
                  enterprise: "Karyawan Tak Terbatas",
                };
                setSelectedPlanForCheckout({
                  id: planId,
                  name: planNames[planId],
                  priceMonthly: pricesM[planId],
                  priceAnnual: pricesA[planId],
                  maxEmployees: maxEmps[planId],
                  features: [
                    "Presensi Geofencing GPS",
                    "Mobile App",
                    "Payroll & BPJS",
                  ],
                });
                setIsCheckoutModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5 whitespace-nowrap hover:scale-105"
            >
              <span>Pilih Paket yang Sesuai</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section
        id="pricing"
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
      >
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">
            Pilihan Lisensi
          </h2>
          <h3
            className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Skema Biaya Transparan Tanpa Biaya Tersembunyi
          </h3>

          <div
            className={`mt-6 inline-flex items-center gap-3 p-1 rounded-xl border text-xs ${isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
          >
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
          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
            }
          >
            <div>
              <div
                className={
                  isDark
                    ? "text-xs font-bold text-slate-400 uppercase"
                    : "text-xs font-bold text-slate-500 uppercase"
                }
              >
                Starter Plan
              </div>
              <div
                className={`text-2xl font-extrabold mt-4 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {billingCycle === "annual" ? "Rp 399.000" : "Rp 499.000"}
                <span
                  className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {" "}
                  / bulan
                </span>
              </div>
              <div
                className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Hingga 50 Karyawan Aktif
              </div>

              <ul
                className={`mt-6 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  Presensi Geofencing GPS
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  Mobile App (Android & iOS)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />{" "}
                  Pengajuan Cuti Standard
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
                  features: [
                    "Presensi Geofencing GPS",
                    "Mobile App (Android & iOS)",
                    "Pengajuan Cuti Standard",
                  ],
                });
                setIsCheckoutModalOpen(true);
              }}
              className={
                isDark
                  ? "mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
                  : "mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all"
              }
            >
              Pilih Paket Starter
            </button>
          </div>

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border-2 border-blue-500 flex flex-col justify-between relative shadow-xl"
                : "p-6 rounded-2xl bg-white border-2 border-blue-600 flex flex-col justify-between relative shadow-xl"
            }
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] tracking-wider uppercase shadow-sm">
              REKOMENDASI KORPORASI
            </div>

            <div>
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                Growth Business
              </div>
              <div
                className={`text-2xl font-extrabold mt-4 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                {billingCycle === "annual" ? "Rp 1.199.000" : "Rp 1.499.000"}
                <span
                  className={`text-xs font-normal ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  {" "}
                  / bulan
                </span>
              </div>
              <div
                className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Hingga 200 Karyawan Aktif
              </div>

              <ul
                className={`mt-6 space-y-2.5 text-xs ${isDark ? "text-slate-200" : "text-slate-700"}`}
              >
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />{" "}
                  Semuanya di Paket Starter
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />{" "}
                  Biometrik FaceID & Root Detection
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />{" "}
                  Approval Cuti Multi-Level (2 Level)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 font-bold" />{" "}
                  Kalkulasi Payroll BPJS & PPh21
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

          <div
            className={
              isDark
                ? "p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
                : "p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
            }
          >
            <div>
              <div
                className={
                  isDark
                    ? "text-xs font-bold text-slate-400 uppercase"
                    : "text-xs font-bold text-slate-500 uppercase"
                }
              >
                Corporate Enterprise
              </div>
              <div
                className={`text-2xl font-extrabold mt-4 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Custom SLA
              </div>
              <div
                className={`text-[11px] mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Karyawan Tak Terbatas (&gt; 1,000)
              </div>

              <ul
                className={`mt-6 space-y-2.5 text-xs ${isDark ? "text-slate-300" : "text-slate-700"}`}
              >
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{" "}
                  Semuanya di Paket Growth
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{" "}
                  Custom Dedicated Server & API
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />{" "}
                  Support SLA 24/7 Dedicated
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className={
                isDark
                  ? "mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-all"
                  : "mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-all"
              }
            >
              Hubungi Tim Sales
            </button>
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ SECTION */}
      <section
        id="faq"
        className={`py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b ${isDark ? "border-slate-800/60" : "border-slate-200"}`}
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold mb-3 shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>FAQ & Bantuan</span>
          </div>
          <h2
            className={`text-2xl sm:text-4xl font-extrabold ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Pertanyaan yang Sering Diajukan
          </h2>
          <p
            className={`text-xs sm:text-sm mt-2 max-w-xl mx-auto ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Jawaban seputar integrasi pembayaran Midtrans Sandbox, presensi GPS
            anti fake location, kalkulasi BPJS & PPh21 TER.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "Bagaimana cara melakukan pembayaran dan testing di Midtrans Sandbox?",
              a: "Anda dapat memilih paket di bagian Harga, lalu melengkapi informasi perusahaan. Sistem terhubung langsung ke Midtrans Snap Sandbox resmi. Anda bisa scan QRIS menggunakan simulator Midtrans atau cukup klik tombol '⚡ Bypass Sandbox' untuk langsung mengaktifkan modul paket dan masuk ke dashboard.",
            },
            {
              q: "Apakah presensi GPS bisa dimanipulasi dengan Fake GPS / Mock Location?",
              a: "Tidak bisa. BlueHR dilengkapi algoritma verifikasi integritas perangkat, pemeriksaan Mock Location API Android & iOS, serta verifikasi Biometrik FaceID. Karyawan yang terdeteksi mengaktifkan alat pemalsu lokasi akan otomatis ditolak saat clock-in.",
            },
            {
              q: "Bagaimana perhitungan PPh 21 dan BPJS Ketenagakerjaan dilakukan?",
              a: "Sistem BlueHR telah disesuaikan dengan PP No. 58 Tahun 2023 (Tarif Efektif Rata-rata / TER) untuk PPh 21 bulanan, serta komponen iuran BPJS Ketenagakerjaan (JHT 2% karyawan, 3.7% perusahaan) dan BPJS Kesehatan (1% karyawan, 4% perusahaan) secara otomatis.",
            },
            {
              q: "Apakah saya bisa mencoba semua fitur sebelum memutuskan untuk berlangganan?",
              a: "Tentu saja! Anda bisa menekan tombol 'Uji Coba Live Dashboard Admin' atau memilih opsi peran Admin HR, Manager, maupun Karyawan di bagian atas halaman untuk merasakan alur kerja sistem secara langsung tanpa kartu kredit.",
            },
            {
              q: "Apakah data karyawan kami aman dan bagaimana ketersediaan servernya?",
              a: "Data diamankan dengan enkripsi 256-bit SSL dan RBAC (Role-Based Access Control) multi-level. Backend dirancang ringan dan siap di-deploy ke Vercel atau server private on-premise perusahaan Anda.",
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? isDark
                      ? "bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5"
                      : "bg-white border-blue-500/50 shadow-md shadow-blue-500/5"
                    : isDark
                      ? "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                      : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm transition-colors"
                >
                  <span className={isDark ? "text-white" : "text-slate-900"}>
                    {item.q}
                  </span>
                  <div
                    className={`p-1.5 rounded-lg shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? "bg-blue-600 text-white rotate-180"
                        : isDark
                          ? "bg-slate-800 text-slate-400"
                          : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div
                    className={`px-6 pb-5 pt-1 text-xs sm:text-sm leading-relaxed border-t transition-all ${
                      isDark
                        ? "text-slate-300 border-slate-800/80 bg-slate-950/30"
                        : "text-slate-600 border-slate-100 bg-slate-50/50"
                    }`}
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-xs flex flex-col sm:flex-row items-center justify-between gap-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
      >
        <div>
          © 2026 BlueHR Enterprise System. Diterbitkan di bawah Lisensi MIT.
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => scrollToSection("modules")}
            className="hover:text-blue-600 transition-colors"
          >
            Modul
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="hover:text-blue-600 transition-colors"
          >
            Harga
          </button>
          <button
            onClick={onGoToLogin}
            className="text-blue-600 font-semibold hover:underline"
          >
            Portal Login Staf
          </button>
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
