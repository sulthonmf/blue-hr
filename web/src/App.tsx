import React, { useEffect, useState } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useHRStore } from "./stores/useHRStore";
import { useThemeStore } from "./stores/useThemeStore";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { LoadingOverlay } from "./components/ui/LoadingOverlay";
import { LoginPage } from "./pages/Login";
import { LandingPage } from "./pages/LandingPage";

import { DashboardPage } from "./pages/Dashboard";
import { AttendancePage } from "./pages/Attendance";
import { SchedulesPage } from "./pages/Schedules";
import { ShiftsPage } from "./pages/Shifts";
import { OvertimePage } from "./pages/Overtime";
import { ReimbursementsPage } from "./pages/Reimbursements";
import { PayrollPage } from "./pages/Payroll";
import { LeavePage } from "./pages/Leave";
import { KPIPage } from "./pages/KPI";
import { EmployeesPage } from "./pages/Employees";
import { BranchesPage } from "./pages/Branches";
import { OffboardingPage } from "./pages/Offboarding";
import { TrainingsPage } from "./pages/Trainings";
import { OrgChartPage } from "./pages/OrgChart";
import { RecruitmentPage } from "./pages/Recruitment";
import { AssetsPage } from "./pages/Assets";
import { AnnouncementsPage } from "./pages/Announcements";
import { RolesPage } from "./pages/Roles";
import { AuditLogsPage } from "./pages/AuditLogs";
import { SettingsPage } from "./pages/Settings";
import { HelpdeskPage } from "./pages/Helpdesk";
import { DocumentsPage } from "./pages/Documents";
import { ShiftSwapPage } from "./pages/ShiftSwap";
import { FieldVisitsPage } from "./pages/FieldVisits";
import { ArrowLeft, Sparkles, UserCheck, LogOut } from "lucide-react";

export const App: React.FC = () => {
  const { token, user, loginAsDemo, logout } = useAuthStore();
  const { fetchData } = useHRStore();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [viewMode, setViewMode] = useState<"landing" | "login" | "app">(token ? "app" : "landing");

  useEffect(() => {
    if (token) {
      fetchData();
      setViewMode("app");
    }
  }, [token, fetchData]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [theme]);

  // Handle Landing Page View Mode
  if (viewMode === "landing" && !token) {
    return (
      <LandingPage
        onGoToLogin={() => setViewMode("login")}
        onGoToDashboard={() => setViewMode("app")}
      />
    );
  }

  // Handle Staff Login View Mode
  if (!token || viewMode === "login") {
    return (
      <div className="relative">
        {/* Back to Landing Page Floating Button */}
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={() => setViewMode("landing")}
            className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 shadow-xl backdrop-blur-md flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Kembali ke Landing Page</span>
          </button>
        </div>
        <LoginPage />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage onNavigate={setActiveTab} />;
      case "attendance":
        return <AttendancePage />;
      case "schedules":
        return <SchedulesPage />;
      case "shifts":
        return <ShiftsPage />;
      case "overtime":
        return <OvertimePage />;
      case "reimbursements":
        return <ReimbursementsPage />;
      case "payroll":
        return <PayrollPage />;
      case "leave":
        return <LeavePage />;
      case "kpi":
        return <KPIPage />;
      case "employees":
        return <EmployeesPage />;
      case "branches":
        return <BranchesPage />;
      case "orgChart":
        return <OrgChartPage />;
      case "trainings":
        return <TrainingsPage />;
      case "offboarding":
        return <OffboardingPage />;
      case "recruitment":
        return <RecruitmentPage />;
      case "assets":
        return <AssetsPage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "roles":
        return <RolesPage />;
      case "auditLogs":
        return <AuditLogsPage />;
      case "settings":
        return <SettingsPage />;
      case "helpdesk":
        return <HelpdeskPage />;
      case "documents":
        return <DocumentsPage />;
      case "shiftSwap":
        return <ShiftSwapPage />;
      case "fieldVisits":
        return <FieldVisitsPage />;
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  const isDemoMode = token?.startsWith("demo_jwt_token_");

  return (
    <div
      className={
        theme === "dark"
          ? "dark bg-[#090d16] text-slate-100 w-screen h-screen overflow-hidden font-sans flex flex-col"
          : "light bg-[#eef0f3] text-slate-800 w-screen h-screen overflow-hidden font-sans flex flex-col"
      }
    >
      {/* Top Floating Demo Mode Notification Bar */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 border-b border-blue-500/30 text-white px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-md z-40">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-cyan-300 animate-pulse" />
            <span>Mode Live Demo BlueHR Vercel Preview — </span>
            <span className="text-cyan-200 font-bold bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/40">
              Role: {user?.role_name || "Demo User"} ({user?.name})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 hidden sm:inline">Ganti Role Demo:</span>
            <button
              onClick={() => loginAsDemo("admin")}
              className="px-2 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] transition-all"
            >
              Admin HR
            </button>
            <button
              onClick={() => loginAsDemo("manager")}
              className="px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] transition-all"
            >
              Manager
            </button>
            <button
              onClick={() => loginAsDemo("employee")}
              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-all"
            >
              Karyawan
            </button>

            <button
              onClick={() => {
                logout();
                setViewMode("landing");
              }}
              className="ml-2 px-2.5 py-1 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 font-semibold text-[10px] flex items-center gap-1 transition-all"
            >
              <LogOut className="w-3 h-3" />
              <span>Ke Landing Page</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Full-Height Application Window (Fills 100% Viewport Height) */}
      <div className="bg-[#f8fafc] dark:bg-[#0d1117] p-4 md:p-6 shadow-sm flex-1 flex flex-col md:flex-row gap-6 w-full overflow-hidden border-none">
        <LoadingOverlay />
        {/* Floating Sidebar Card */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col h-full overflow-hidden" role="region" aria-label="Main HR Portal Workspace">
          <Navbar onNavigate={setActiveTab} />
          <main className="flex-1 overflow-y-auto pr-1" role="main" id="main-content" aria-label="Tab Content View">
            {renderTabContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default App;

