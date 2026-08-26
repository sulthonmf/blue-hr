import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../stores/useAuthStore';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { LocationSimulator } from '../components/modules/LocationSimulator';
import {
  QuickHRActionsWidget,
  HolidayNoticeCard,
  AttendanceTimelineWidget,
  LeaveDonutSummaryCard,
  WorkingHoursBarChartCard,
  TravelOnDutyBanner,
  HRLeaveApprovalCard,
  TeamMembersRibbon,
  MeetingScheduleWidget
} from '../components/modules/DashboardWidgets';

import { HRAssistantModal } from '../components/modules/HRAssistantModal';

interface HomeScreenProps {
  onOpenClockInModal: () => void;
  onOpenLeaveModal: () => void;
  onOpenAnnouncementModal?: () => void;
  onNavigate?: (tab: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onOpenClockInModal, 
  onOpenLeaveModal,
  onOpenAnnouncementModal,
  onNavigate
}) => {
  const { user } = useAuthStore();
  const { todayAttendance } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const [isAiModalOpen, setIsAiModalOpen] = React.useState(false);

  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      {/* AI HR Assistant Trigger Banner */}
      <TouchableOpacity onPress={() => setIsAiModalOpen(true)} style={styles.aiBanner}>
        <Feather name="message-square" size={16} color="#ffffff" />
        <Text style={styles.aiBannerText}>{t.aiAssistant} • Tanya Kebijakan & Sisa Cuti</Text>
      </TouchableOpacity>

      {/* 1. GPS Geofence Location Simulator */}
      <LocationSimulator />

      {/* 2. Quick HR Actions Widget (6-tile Grid matching Web Version) */}
      <QuickHRActionsWidget onNavigate={onNavigate} />

      {/* 3. Primary Action Bar (Clock In / Status) */}
      <View style={[styles.bannerCard, todayAttendance ? styles.bannerGreen : styles.bannerBlue]}>
        <View style={styles.bannerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerSub}>{t.geofenceTitle || 'Presensi Geofence GPS'}</Text>
            <Text style={styles.bannerTitle}>
              {todayAttendance ? `${t.clockInSuccessStatus || 'Sudah Clock In'} (${todayAttendance.status})` : (t.notClockedInYet || 'Belum Melakukan Presensi')}
            </Text>
            <Text style={styles.bannerTime}>
              {todayAttendance?.check_in
                ? `Masuk: ${new Date(todayAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : (t.clockInHint || 'Silakan absen dalam radius kantor 5 km')}
            </Text>
          </View>

          {!todayAttendance && (
            <TouchableOpacity onPress={onOpenClockInModal} style={styles.clockInBtn}>
              <Feather name="map-pin" size={14} color="#2563eb" />
              <Text style={styles.clockInBtnText}>{t.clockInBtnText || 'Absen Sekarang'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 4. Meeting Schedule & Room Reservation Widget */}
      <MeetingScheduleWidget />

      {/* 5. Holiday & Company Notice Card (Connected to Backend HR Announcements) */}
      <HolidayNoticeCard onOpenDetail={onOpenAnnouncementModal} />

      {/* 6. Attendance Timeline Widget (Check-in, Check-out, Total Hours) */}
      <AttendanceTimelineWidget />

      {/* 7. Working Hours Bar Chart */}
      <WorkingHoursBarChartCard />

      {/* 8. Leave Ring Donut Summary */}
      <LeaveDonutSummaryCard />

      {/* 9. Travel on Duty Banner */}
      <TravelOnDutyBanner />

      {/* 10. HR / Manager Leave Approval Card (For HR / Admin Users) */}
      <HRLeaveApprovalCard />

      {/* 11. Team Members Ribbon */}
      <TeamMembersRibbon />

      <HRAssistantModal visible={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  bannerCard: { padding: 18, borderRadius: 24, marginBottom: 16 },
  bannerBlue: { backgroundColor: '#2563eb' },
  bannerGreen: { backgroundColor: '#16a34a' },
  bannerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bannerSub: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', fontWeight: '600' },
  bannerTitle: { fontSize: 14, fontWeight: '900', color: '#ffffff', marginTop: 2 },
  bannerTime: { fontSize: 10, color: 'rgba(255, 255, 255, 0.9)', marginTop: 4 },
  clockInBtn: { backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 6 },
  clockInBtnText: { color: '#2563eb', fontWeight: '800', fontSize: 11 },
  aiBanner: { backgroundColor: '#0f172a', padding: 14, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  aiBannerText: { color: '#ffffff', fontSize: 12, fontWeight: '800' }
});
