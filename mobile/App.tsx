import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar as RNStatusBar, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from './src/stores/useAuthStore';
import { useHRStore } from './src/stores/useHRStore';
import { useThemeStore } from './src/stores/useThemeStore';
import { Header } from './src/components/common/Header';
import { BottomNav } from './src/components/common/BottomNav';
import { GlobalLoadingOverlay } from './src/components/common/GlobalLoadingOverlay';
import { ErrorPopupModal } from './src/components/common/ErrorPopupModal';
import { ClockInModal } from './src/components/modules/ClockInModal';
import { LeaveModal } from './src/components/modules/LeaveModal';
import { NotificationCenterModal } from './src/components/modules/NotificationCenterModal';
import { AvatarUploadModal } from './src/components/modules/AvatarUploadModal';
import { AnnouncementDetailModal } from './src/components/modules/AnnouncementDetailModal';

import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { AttendanceScreen } from './src/screens/AttendanceScreen';
import { LeaveScreen } from './src/screens/LeaveScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { EmployeesScreen } from './src/screens/EmployeesScreen';
import { ReimbursementScreen } from './src/screens/ReimbursementScreen';
import { OvertimeScreen } from './src/screens/OvertimeScreen';
import { DigitalIDScreen } from './src/screens/DigitalIDScreen';
import { FieldVisitScreen } from './src/screens/FieldVisitScreen';
import { HelpdeskScreen } from './src/screens/HelpdeskScreen';
import { ShiftSwapScreen } from './src/screens/ShiftSwapScreen';
import { SchedulesScreen } from './src/screens/SchedulesScreen';
import { AnnouncementsScreen } from './src/screens/AnnouncementsScreen';

export default function App() {
  const { token, isInitializing, initAuth } = useAuthStore();
  const { fetchData } = useHRStore();
  const { theme } = useThemeStore();

  const [activeTab, setActiveTab] = useState('home');
  const [isClockInOpen, setIsClockInOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);

  const isDark = theme === 'dark';

  // Restore authentication session from AsyncStorage on app launch
  useEffect(() => {
    initAuth();
  }, []);

  // Fetch HR data once token is authenticated
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  // Render splash/loading screen while checking stored credentials
  if (isInitializing) {
    return (
      <SafeAreaProvider>
        <View style={[styles.splashContainer, isDark ? styles.bgDark : styles.bgLight]}>
          <StatusBar style={isDark ? 'light' : 'dark'} translucent />
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      </SafeAreaProvider>
    );
  }

  if (!token) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight, styles.safeTopPadding]}>
          <StatusBar style={isDark ? 'light' : 'dark'} translucent />
          <LoginScreen />
          <GlobalLoadingOverlay />
          <ErrorPopupModal />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeesScreen />;
      case 'attendance':
        return <AttendanceScreen />;
      case 'leave':
        return <LeaveScreen onOpenLeaveModal={() => setIsLeaveOpen(true)} />;
      case 'approval':
        return <LeaveScreen onOpenLeaveModal={() => setIsLeaveOpen(true)} />;
      case 'profile':
        return <ProfileScreen onOpenAvatarUploadModal={() => setIsAvatarOpen(true)} onNavigate={(tab) => setActiveTab(tab)} />;
      case 'reimbursements':
        return <ReimbursementScreen />;
      case 'overtime':
        return <OvertimeScreen />;
      case 'digitalId':
        return <DigitalIDScreen />;
      case 'fieldVisit':
        return <FieldVisitScreen />;
      case 'helpdesk':
        return <HelpdeskScreen />;
      case 'shiftSwap':
        return <ShiftSwapScreen />;
      case 'schedules':
        return <SchedulesScreen />;
      case 'announcements':
        return <AnnouncementsScreen />;
      case 'home':
      default:
        return (
          <HomeScreen
            onOpenClockInModal={() => setIsClockInOpen(true)}
            onOpenLeaveModal={() => setIsLeaveOpen(true)}
            onOpenAnnouncementModal={() => setIsAnnounceOpen(true)}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight, styles.safeTopPadding]}>
        <StatusBar style={isDark ? 'light' : 'dark'} translucent />

        {/* Clean Architecture Header */}
        <Header activeTab={activeTab} onOpenNotif={() => setIsNotifOpen(true)} />

        {/* Main Screen Container */}
        <View style={styles.screenContainer}>{renderActiveScreen()}</View>

        {/* Native Role-Based Bottom Navigation Tabs */}
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Modals & Global Overlays */}
        <ClockInModal isOpen={isClockInOpen} onClose={() => setIsClockInOpen(false)} />
        <LeaveModal isOpen={isLeaveOpen} onClose={() => setIsLeaveOpen(false)} />
        <NotificationCenterModal isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        <AvatarUploadModal isOpen={isAvatarOpen} onClose={() => setIsAvatarOpen(false)} />
        <AnnouncementDetailModal isOpen={isAnnounceOpen} onClose={() => setIsAnnounceOpen(false)} />
        <GlobalLoadingOverlay />
        <ErrorPopupModal />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeTopPadding: { paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#ffffff' },
  screenContainer: { flex: 1 }
});
