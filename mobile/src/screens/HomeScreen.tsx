import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../stores/useAuthStore';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { LocationSimulator } from '../components/modules/LocationSimulator';
import {
  HolidayNoticeCard,
  AttendanceTimelineWidget,
  LeaveDonutSummaryCard,
  WorkingHoursBarChartCard,
  TravelOnDutyBanner,
  HRLeaveApprovalCard,
  TeamMembersRibbon
} from '../components/modules/DashboardWidgets';

interface HomeScreenProps {
  onOpenClockInModal: () => void;
  onOpenLeaveModal: () => void;
  onOpenAnnouncementModal?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onOpenClockInModal, 
  onOpenLeaveModal,
  onOpenAnnouncementModal 
}) => {
  const { user } = useAuthStore();
  const { todayAttendance } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();

  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      {/* 1. GPS Geofence Location Simulator */}
      <LocationSimulator />

      {/* 2. Primary Action Bar (Clock In / Status) */}
      <View style={[styles.bannerCard, todayAttendance ? styles.bannerGreen : styles.bannerBlue]}>
        <View style={styles.bannerRow}>
          <View>
            <Text style={styles.bannerSub}>Presensi Geofence GPS</Text>
            <Text style={styles.bannerTitle}>
              {todayAttendance ? `Sudah Clock In (${todayAttendance.status})` : 'Belum Melakukan Presensi'}
            </Text>
            <Text style={styles.bannerTime}>
              {todayAttendance?.check_in
                ? `Masuk: ${new Date(todayAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Silakan absen dalam radius kantor 5 km'}
            </Text>
          </View>

          {!todayAttendance && (
            <TouchableOpacity onPress={onOpenClockInModal} style={styles.clockInBtn}>
              <Feather name="map-pin" size={14} color="#2563eb" />
              <Text style={styles.clockInBtnText}>Absen Now</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 3. Holiday & Company Notice Card (Connected to Backend HR Announcements) */}
      <HolidayNoticeCard onOpenDetail={onOpenAnnouncementModal} />

      {/* 4. Attendance Timeline Widget (From Reference Image) */}
      <AttendanceTimelineWidget />

      {/* 5. Working Hours Bar Chart (From Reference Image) */}
      <WorkingHoursBarChartCard />

      {/* 6. Leave Ring Donut Summary (From Reference Image) */}
      <LeaveDonutSummaryCard />

      {/* 7. Travel on Duty Banner (From Reference Image) */}
      <TravelOnDutyBanner />

      {/* 8. HR / Manager Leave Approval Card (For HR / Admin Users) */}
      <HRLeaveApprovalCard />

      {/* 9. Team Members Ribbon (From Reference Image) */}
      <TeamMembersRibbon />
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
  clockInBtnText: { color: '#2563eb', fontWeight: '800', fontSize: 11 }
});
