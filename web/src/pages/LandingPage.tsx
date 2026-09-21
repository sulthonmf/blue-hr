import React, { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Calendar,
  DollarSign,
  FileCheck,
  Building2,
  Clock,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Laptop,
  Users,
  ChevronRight,
  Lock,
  Zap,
  Globe,
  Star,
  Check,
  HelpCircle,
  Play,
  Sun,
  Moon,
} from "lucide-react";
import { RequestDemoModal } from "../components/landing/RequestDemoModal";
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
  const [activeShowcase, setActiveShowcase] = useState<"web" | "mobile">("mobile");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const { loginAsDemo } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500 selection:text-white overflow-x-hidden">
      
      {/* Background Radial Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-600/20 via-indigo-600/10 to-transparent blur-3xl opacity-70"></div>
        <div className="absolute top-[40%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>
      </div>

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/30 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-blue-400 font-bold text-xl">
                B
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
                Blue<span className="text-blue-500">HR</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-bold border border-blue-500/40">
                  ENTERPRISE
                </span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-0.5 font-medium">Smart HR & Geofencing System</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollToSection("features")} className="hover:text-cyan-400 transition-colors">
              Fitur Unggulan
            </button>
            <button onClick={() => scrollToSection("showcase")} className="hover:text-cyan-400 transition-colors">
              Simulasi App
            </button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-cyan-400 transition-colors">
              Paket Harga
            </button>
            <button onClick={() => scrollToSection("faq")} className="hover:text-cyan-400 transition-colors">
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800 transition-all"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => handleQuickDemo("admin")}
              className="hidden sm:inline-flex px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-all items-center gap-1.5"
            >
              <Laptop className="w-3.5 h-3.5 text-cyan-400" />
              <span>Live Web Demo</span>
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
              <span>Request Demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-cyan-300 text-xs font-semibold mb-8 animate-fade-in shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Platform Presensi GPS Real Device & Payroll Automated V2.5</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Kelola Karyawan, Presensi GPS & Payroll Enterprise dalam{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Satu Ekosistem Terpadu
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-normal leading-relaxed">
          Tingkatkan kedisiplinan dan transparansi tim dengan <strong className="text-slate-200">Presensi GPS Geofencing</strong>, verifikasi <strong className="text-slate-200">Biometrik FaceID</strong>, alur <strong className="text-slate-200">Multi-Level Approval Cuti</strong>, serta kalkulasi slip gaji BPJS & PPh21 secara instan.
        </p>

        {/* Hero Action CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Jadwalkan Request Demo</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => handleQuickDemo("admin")}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 font-semibold text-sm border border-slate-700 shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
            <span>Uji Coba Web Admin</span>
          </button>
        </div>

        {/* Role Quick Switcher Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400">
          <span>Atau coba role demo:</span>
          <button
            onClick={() => handleQuickDemo("admin")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 font-medium transition-all"
          >
            ● Admin HR
          </button>
          <button
            onClick={() => handleQuickDemo("manager")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 border border-slate-800 font-medium transition-all"
          >
            ● Manager
          </button>
          <button
            onClick={() => handleQuickDemo("employee")}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 font-medium transition-all"
          >
            ● Karyawan
          </button>
        </div>

        {/* Metrics Counter Strip */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl font-extrabold text-cyan-400">99.98%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Uptime Service SLA</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl font-extrabold text-blue-400">50,000+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Presensi GPS Real/Hari</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl font-extrabold text-indigo-400">120+</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Perusahaan Enterprise</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <div className="text-3xl font-extrabold text-emerald-400">&lt; 3 Menit</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Proses Payroll Bulanan</div>
          </div>
        </div>
      </section>

      {/* SHOWCASE SECTION: DUAL APP SIMULATOR (WEB & MOBILE) */}
      <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Live Interactive Preview
          </h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
            Lihat Antarmuka Web Dashboard & Mobile App
          </h3>
          <p className="text-slate-400 text-sm mt-3 max-w-2xl mx-auto">
            BlueHR dirancang sempurna untuk dua sisi pengguna: Management HR melalui Web Dashboard dan Karyawan Lapangan melalui Mobile App.
          </p>

          {/* Toggle Switcher */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setActiveShowcase("mobile")}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeShowcase === "mobile"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Aplikasi Mobile Karyawan</span>
            </button>
            <button
              onClick={() => setActiveShowcase("web")}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                activeShowcase === "web"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Web Admin Dashboard</span>
            </button>
          </div>
        </div>

        {/* Showcase Content Body */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {activeShowcase === "mobile" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Mobile Highlights */}
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-950 text-cyan-300 text-xs font-semibold border border-cyan-800">
                  <Smartphone className="w-4 h-4" /> React Native + Expo (Android & iOS)
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  Presensi Geofencing GPS Real Device & ID Card Digital QR Code
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Karyawan dapat melakukan absensi langsung di HP masing-masing dengan deteksi jarak radius otomatis (Haversine Formula), otentikasi Biometrik lokal, serta perlindungan deteksi Fake GPS / Rooted Device.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Geofencing & Testing Simulator</h4>
                      <p className="text-xs text-slate-400">Deteksi koordinat lokasi real-time terhadap lokasi kantor dengan mode uji coba radius.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Verifikasi Biometrik Perangkat</h4>
                      <p className="text-xs text-slate-400">Mendukung FaceID dan Sidik Jari bawaan HP sebelum memvalidasi clock-in/out.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Cuti & Slip Gaji On-The-Go</h4>
                      <p className="text-xs text-slate-400">Pengajuan cuti cepat, cek sisa kuota, dan pantau rincian slip gaji bulanan.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Phone Frame Simulator Component */}
              <div className="lg:col-span-6 flex justify-center">
                <MobilePhoneSimulator />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-950 text-blue-300 text-xs font-semibold border border-blue-800 mb-2">
                    <Laptop className="w-4 h-4" /> Web HR Command Center (React 18 + Vite)
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Dashboard Pengelolaan SDM Kompleks & Multi-Kantor Cabang
                  </h3>
                </div>
                <button
                  onClick={() => handleQuickDemo("admin")}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Buka Live Web App</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Web App Interactive Snapshot Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Manajemen Pegawai & RBAC</h4>
                  <p className="text-xs text-slate-400">
                    Kelola NIP, jabatan, struktur divisi 4-tingkat, hak akses per peran (*Fine-grained Permissions*), dan dokumen karyawan.
                  </p>
                  <div className="text-[11px] font-semibold text-cyan-400">● 25+ Menu Terintegrasi</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Kalkulasi Payroll Automated</h4>
                  <p className="text-xs text-slate-400">
                    Hitung otomatis Gaji Pokok, Tunjangan, Potongan Keterlambatan, BPJS Kesehatan, BPJS Ketenagakerjaan & PPh21.
                  </p>
                  <div className="text-[11px] font-semibold text-indigo-400">● Generate Slip PDF Instant</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">Approval Cuti Multi-Level</h4>
                  <p className="text-xs text-slate-400">
                    Alur verifikasi 2 tingkat (Manager Dept ➔ HR Lead) dengan kalkulasi otomatis saldo cuti tahunan karyawan.
                  </p>
                  <div className="text-[11px] font-semibold text-emerald-400">● Status Real-Time Notification</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CORE FEATURES GRID */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Modul Lengkap Enterprise</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white max-w-3xl mx-auto">
            Semua Modul HRD yang Anda Butuhkan Ada di BlueHR
          </h3>
          <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto">
            Dirancang khusus menyesuaikan regulasi hukum ketenagakerjaan Indonesia.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Presensi GPS Geofencing</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Penghitungan jarak presisi dengan Haversine Formula terhadap lokasi cabang perusahaan & radius toleransi kantor.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Biometrik & Keamanan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Otentikasi FaceID / Fingerprint, deteksi perangkat Root/Jailbreak, dan perlindungan alat spoofing Fake GPS.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Multi-Level Approval Cuti</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Alur persetujuan bertingkat (APPROVED_L1 oleh Manager & APPROVED oleh HR Lead) serta kuota otomatis.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Payroll & PPh21 Automated</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Kalkulasi gaji bersih otomatis termasuk BPJS Kesehatan, BPJS Ketenagakerjaan, potongan keterlambatan, & PPh21.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Struktur Organisasi 4-Tingkat</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bagan hirarki korporat interaktif: Direksi ➔ Divisi ➔ Departemen ➔ Karyawan dengan Kartu Pegawai Digital QR Code.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-rose-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Shift & Penukaran Shift</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Manajemen pola kerja shift, lembur (overtime) kompensasi otomatis, dan fasilitas penukaran jadwal sesama staf.
            </p>
          </div>

          {/* Feature 7 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Evaluasi KPI Performance</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitoring target Key Performance Indicator (KPI) berkala, skor pencapaian, dan lembaran feedback manager.
            </p>
          </div>

          {/* Feature 8 */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/50 transition-all hover:-translate-y-1 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Inventaris Aset & Rekrutmen</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pelacakan aset kantor yang dipinjamkan, posting lowongan rekrutmen, portal pelamar, dan offboarding karyawan.
            </p>
          </div>
        </div>
      </section>

      {/* PRICING TABLE SECTION */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Investasi Terbaik Perusahaan</h2>
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">
            Pilih Paket yang Sesuai dengan Skala Bisnis Anda
          </h3>

          {/* Monthly vs Annual Toggle */}
          <div className="mt-8 inline-flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl font-bold transition-all ${
                billingCycle === "monthly" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              Bayar Bulanan
            </button>
            <button
              onClick={() => setBillingCycle("annual")}
              className={`px-5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                billingCycle === "annual" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Bayar Tahunan</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px]">
                DISKON 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Starter Plan */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="text-sm font-bold text-slate-400">STARTER PLAN</div>
              <div className="text-xs text-slate-500 mt-1">Untuk UKM & Startup Berkembang</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === "annual" ? "Rp 399rb" : "Rp 499rb"}
                </span>
                <span className="text-xs text-slate-400">/bulan</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Hingga 50 Karyawan Active</div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Presensi GPS Geofencing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Mobile App Android & iOS
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Pengajuan Cuti 1-Level Approval
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" /> Web Dashboard Admin Standard
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              Pilih Paket Starter
            </button>
          </div>

          {/* Growth / Business Plan (Featured) */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-blue-950/80 via-slate-900 to-slate-900 border-2 border-blue-500 shadow-2xl flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md">
              PALING POPULER
            </div>

            <div>
              <div className="text-sm font-bold text-cyan-400">GROWTH BUSINESS</div>
              <div className="text-xs text-slate-400 mt-1">Untuk Perusahaan Menengah & Multi Cabang</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">
                  {billingCycle === "annual" ? "Rp 1.199rb" : "Rp 1.499rb"}
                </span>
                <span className="text-xs text-slate-400">/bulan</span>
              </div>
              <div className="text-[11px] text-cyan-300 mt-1">Hingga 200 Karyawan Active</div>

              <ul className="mt-8 space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 font-bold" /> Semuanya di Paket Starter
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 font-bold" /> Biometrik FaceID & Root Detection
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 font-bold" /> Multi-Level Approval Cuti 2-Level
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 font-bold" /> Payroll & Hitung BPJS / PPh21
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-cyan-400 font-bold" /> Penukaran Shift & Overtime Modul
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/30 transition-all"
            >
              Mulai Uji Coba Gratis
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
            <div>
              <div className="text-sm font-bold text-slate-400">CORPORATE ENTERPRISE</div>
              <div className="text-xs text-slate-500 mt-1">Untuk Holding & Korporasi Besar</div>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white">Custom SLA</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Karyawan Tak Terbatas (&gt; 1,000)</div>

              <ul className="mt-8 space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" /> Semuanya di Paket Growth
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" /> Custom Dedicated Cloud Server
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" /> Integrasi Mesin Fingerprint Fisik API
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-indigo-400" /> Account Manager & SLA 24/7 Dedicated
                </li>
              </ul>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="mt-8 w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
            >
              Hubungi Tim Enterprise
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 text-slate-400 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              B
            </div>
            <div>
              <div className="font-bold text-white text-sm">BlueHR Enterprise System</div>
              <div className="text-[11px] text-slate-500">© 2026 BlueHR Platform. Hak Cipta Dilindungi Undang-Undang.</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection("features")} className="hover:text-white">Fitur</button>
            <button onClick={() => scrollToSection("pricing")} className="hover:text-white">Harga</button>
            <button onClick={() => setIsDemoModalOpen(true)} className="hover:text-white">Request Demo</button>
            <button onClick={onGoToLogin} className="text-blue-400 font-semibold hover:underline">Portal Staff Login</button>
          </div>
        </div>
      </footer>

      {/* Request Demo Modal Component */}
      <RequestDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onLaunchDemo={() => handleQuickDemo("admin")}
      />
    </div>
  );
};
