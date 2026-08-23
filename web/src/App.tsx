import React, { useEffect, useState } from "react";
import { useAuthStore } from "./stores/useAuthStore";
import { useHRStore } from "./stores/useHRStore";
import { useThemeStore } from "./stores/useThemeStore";
import { Navbar } from "./components/layout/Navbar";
import { Sidebar } from "./components/layout/Sidebar";
import { LoadingOverlay } from "./components/ui/LoadingOverlay";
import { LoginPage } from "./pages/Login";

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

export const App: React.FC = () => {
  const { token } = useAuthStore();
  const { fetchData } = useHRStore();
  const { theme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (token) {
      fetchData();
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

  if (!token) {
    return <LoginPage />;
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
      default:
        return <DashboardPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div
      className={
        theme === "dark"
          ? "dark bg-[#090d16] text-slate-100 w-screen h-screen overflow-hidden font-sans"
          : "light bg-[#eef0f3] text-slate-800 w-screen h-screen overflow-hidden font-sans"
      }
    >
      {/* Main Full-Height Application Window (Fills 100% Viewport Height) */}
      <div className="bg-[#f8fafc] dark:bg-[#0d1117] p-4 md:p-6 shadow-sm flex flex-col md:flex-row gap-6 w-full h-full overflow-hidden border-none">
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
