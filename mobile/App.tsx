import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar } from 'react-native';
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

export default function App() {
  const { token } = useAuthStore();
  const { fetchData } = useHRStore();
  const { theme } = useThemeStore();

  const [activeTab, setActiveTab] = useState('home');
  const [isClockInOpen, setIsClockInOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  if (!token) {
    return (
      <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <LoginScreen />
        <GlobalLoadingOverlay />
        <ErrorPopupModal />
      </SafeAreaView>
    );
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'attendance':
        return <AttendanceScreen />;
      case 'leave':
        return <LeaveScreen onOpenLeaveModal={() => setIsLeaveOpen(true)} />;
      case 'approval':
        return <LeaveScreen onOpenLeaveModal={() => setIsLeaveOpen(true)} />;
      case 'profile':
        return <ProfileScreen onOpenAvatarUploadModal={() => setIsAvatarOpen(true)} />;
      case 'home':
      default:
        return (
          <HomeScreen
            onOpenClockInModal={() => setIsClockInOpen(true)}
            onOpenLeaveModal={() => setIsLeaveOpen(true)}
            onOpenAnnouncementModal={() => setIsAnnounceOpen(true)}
          />
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#ffffff' },
  screenContainer: { flex: 1 }
});
