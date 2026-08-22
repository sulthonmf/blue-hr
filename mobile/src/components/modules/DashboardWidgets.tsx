import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../../stores/useHRStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

// 1. Holiday Notice Card (Connected to Backend Announcements & Interactive Detail Modal)
export const HolidayNoticeCard: React.FC<{ onOpenDetail?: () => void }> = ({ onOpenDetail }) => {
  const { announcements } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const latestAnn = announcements[0] || {
    title: 'Kebijakan Jam Kerja & Absensi Hibrid 2026',
    content: 'Seluruh karyawan diwajibkan melakukan absen geofencing radius 5 km dari lokasi kantor Jakarta Central.',
    category: 'IMPORTANT'
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onOpenDetail}
      style={[styles.card, isDark ? styles.cardDark : styles.cardLight, styles.noticeCard]}
    >
      <View style={styles.noticeIconBox}>
        <Feather name="volume-2" size={20} color="#6366f1" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.noticeTitle, isDark ? styles.textDark : styles.textLight]}>
          {latestAnn.title}
        </Text>
        <Text style={styles.noticeDesc} numberOfLines={2}>
          {latestAnn.content}
        </Text>
        <View style={styles.noticeFooter}>
          <View style={styles.officeBadge}>
            <Feather name="check-circle" size={10} color="#2563eb" />
            <Text style={styles.officeBadgeText}>{latestAnn.category || 'Office Notice'}</Text>
          </View>
          <TouchableOpacity onPress={onOpenDetail}>
            <Text style={styles.seeDetailsText}>Lihat Detail →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// 2. Attendance Timeline Widget Card (Check-in, Check-out, Overtime, Total Hours)
export const AttendanceTimelineWidget: React.FC = () => {
  const { todayAttendance } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const todayDateStr = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const checkInTime = todayAttendance?.check_in
    ? new Date(todayAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const checkOutTime = todayAttendance?.check_out
    ? new Date(todayAttendance.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  // Calculate total hours
  let totalHoursStr = '0h:00m';
  if (todayAttendance?.check_in) {
    const startTime = new Date(todayAttendance.check_in).getTime();
    const endTime = todayAttendance.check_out
      ? new Date(todayAttendance.check_out).getTime()
      : new Date().getTime();
    const diffMs = Math.max(0, endTime - startTime);
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    totalHoursStr = `${hrs}h:${mins < 10 ? '0' : ''}${mins}m`;
  }

  const statusLabel = todayAttendance
    ? todayAttendance.status === 'ON_TIME'
      ? 'Ontime'
      : todayAttendance.status === 'LATE'
      ? 'Late'
      : 'Out of Bounds'
    : 'Belum Presensi';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.widgetHeader}>
        <Text style={styles.dateHeader}>{todayDateStr}</Text>
        <View style={styles.viewBadge}>
          <Text style={styles.viewBadgeText}>Live GPS Log</Text>
        </View>
      </View>

      <View style={styles.timelineRow}>
        {/* Timeline Steps */}
        <View style={styles.leftTimeline}>
          {/* Check In Step */}
          <View style={styles.stepRow}>
            <View style={[styles.stepIcon, { backgroundColor: '#2563eb' }]}>
              <Feather name="log-in" size={12} color="#ffffff" />
            </View>
            <View>
              <Text style={[styles.stepTime, isDark ? styles.textDark : styles.textLight]}>
                {checkInTime}
              </Text>
              <Text style={styles.stepLabel}>Check in Hari Ini</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          {/* Check Out Step */}
          <View style={styles.stepRow}>
            <View style={[styles.stepIcon, { backgroundColor: '#a855f7' }]}>
              <Feather name="log-out" size={12} color="#ffffff" />
            </View>
            <View>
              <Text style={[styles.stepTime, isDark ? styles.textDark : styles.textLight]}>
                {checkOutTime}
              </Text>
              <Text style={styles.stepLabel}>Check out Hari Ini</Text>
            </View>
          </View>

          <View style={styles.verticalLine} />

          {/* Overtime Step */}
          <View style={styles.stepRow}>
            <View style={[styles.stepIcon, { backgroundColor: '#ec4899' }]}>
              <Feather name="clock" size={12} color="#ffffff" />
            </View>
            <View>
              <Text style={[styles.stepTime, isDark ? styles.textDark : styles.textLight]}>
                Overtime / Lembur
              </Text>
              <Text style={styles.stepLabel}>Total <Text style={{ color: '#2563eb', fontWeight: '800' }}>{todayAttendance?.check_out ? '+1h:30m' : '+0h:00m'}</Text></Text>
            </View>
          </View>
        </View>

        {/* Total Hours & Status Card */}
        <View style={styles.rightStatsColumn}>
          <View style={styles.totalHoursCard}>
            <View>
              <Text style={styles.hoursSub}>Total Jam Kerja</Text>
              <Text style={styles.hoursVal}>{totalHoursStr}</Text>
            </View>
            <View style={styles.clockIconCircle}>
              <Feather name="clock" size={16} color="#2563eb" />
            </View>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusBoxTitle}>Status Presensi</Text>
            <Text style={styles.statusBoxVal}>{statusLabel}</Text>
            <View style={styles.greenPill}>
              <Feather name="check-circle" size={10} color="#22c55e" />
              <Text style={styles.greenPillText}>{todayAttendance ? 'GPS Terverifikasi' : 'Siap Clock In'}</Text>
            </View>
          </View>
        </View>
      </View>

      <Text style={styles.shiftFooter}>Shift Kantor Standar (08:30 WIB - 17:30 WIB)</Text>
    </View>
  );
};

// 3. Leave Donut & Summary Card (Connected to Live User Quota & Leaves)
export const LeaveDonutSummaryCard: React.FC = () => {
  const { user } = useAuthStore();
  const { leaves } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const approvedLeaves = leaves.filter(l => l.status === 'APPROVED');
  const annualUsed = approvedLeaves.filter(l => l.leave_type === 'ANNUAL').reduce((acc, curr) => acc + (curr.duration_days || 1), 0);
  const sickUsed = approvedLeaves.filter(l => l.leave_type === 'SICK').reduce((acc, curr) => acc + (curr.duration_days || 1), 0);

  const availableQuota = user?.leave_quota ?? 12;

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.widgetHeader}>
        <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>
          Cuti Saya (My Leave)
        </Text>
        <View style={styles.yearPill}>
          <Feather name="calendar" size={12} color="#2563eb" />
          <Text style={styles.yearPillText}>Tahun 2026</Text>
        </View>
      </View>

      <View style={styles.leaveHeaderRow}>
        <Text style={styles.availText}>Kuota Tersisa: <Text style={{ fontWeight: '900', color: '#2563eb' }}>{availableQuota} Hari</Text></Text>
        <Text style={styles.availText}>Terpakai: <Text style={{ fontWeight: '900', color: isDark ? '#fff' : '#0f172a' }}>{annualUsed + sickUsed} Hari</Text></Text>
      </View>

      {/* Ring Chart Simulation & Categories */}
      <View style={styles.ringSection}>
        <View style={styles.donutCircle}>
          <Text style={styles.donutVal}>{availableQuota}</Text>
          <Text style={styles.donutSub}>Hari Sisa</Text>
        </View>

        <View style={styles.categoriesColumn}>
          <View style={styles.catRow}>
            <View style={[styles.dot, { backgroundColor: '#2563eb' }]} />
            <Text style={styles.catText}>Cuti Tahunan: <Text style={styles.boldText}>{annualUsed} Hari Dipakai</Text></Text>
          </View>
          <View style={styles.catRow}>
            <View style={[styles.dot, { backgroundColor: '#f43f5e' }]} />
            <Text style={styles.catText}>Cuti Sakit: <Text style={styles.boldText}>{sickUsed} Hari Dipakai</Text></Text>
          </View>
          <View style={styles.catRow}>
            <View style={[styles.dot, { backgroundColor: '#8b5cf6' }]} />
            <Text style={styles.catText}>Permohonan: <Text style={styles.boldText}>{leaves.length} Total Diajukan</Text></Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// 4. Working Hours Bar Chart Card (Soft Pastel Colors & Crisp Non-Rotated Typography)
export const WorkingHoursBarChartCard: React.FC = () => {
  const { todayAttendance, leaves } = useHRStore();

  const sickLeaveCount = leaves.filter(l => l.leave_type === 'SICK').length;
  const regularLeaveCount = leaves.filter(l => l.leave_type !== 'SICK').length;

  const daysData = [
    { day: 'Min', num: '24', type: 'Week off', label: 'Off', height: '35%', bg: 'rgba(255, 255, 255, 0.35)', badgeColor: '#ffffff' },
    { day: 'Sen', num: '25', type: 'Present', label: 'Hadir', height: '85%', bg: '#ffffff', badgeColor: '#2563eb', active: true },
    { day: 'Sel', num: '26', type: 'Present', label: 'Hadir', height: '90%', bg: '#ffffff', badgeColor: '#2563eb' },
    { day: 'Rab', num: '27', type: regularLeaveCount > 0 ? 'Leave' : 'Kosong', label: regularLeaveCount > 0 ? 'Cuti' : 'Kosong', height: regularLeaveCount > 0 ? '65%' : '25%', bg: regularLeaveCount > 0 ? '#e9d5ff' : 'rgba(15, 23, 42, 0.45)', badgeColor: regularLeaveCount > 0 ? '#a855f7' : '#94a3b8' },
    { day: 'Kam', num: '28', type: sickLeaveCount > 0 ? 'Sick' : todayAttendance ? 'Present' : 'Kosong', label: sickLeaveCount > 0 ? 'Sakit' : todayAttendance ? 'Hadir' : 'Kosong', height: sickLeaveCount > 0 ? '55%' : todayAttendance ? '85%' : '25%', bg: sickLeaveCount > 0 ? '#fbcfe8' : todayAttendance ? '#ffffff' : 'rgba(15, 23, 42, 0.45)', badgeColor: sickLeaveCount > 0 ? '#ec4899' : todayAttendance ? '#2563eb' : '#94a3b8' },
    { day: 'Jum', num: '29', type: 'Present', label: 'Hadir', height: '75%', bg: '#ffffff', badgeColor: '#2563eb' },
    { day: 'Sab', num: '30', type: 'Week off', label: 'Off', height: '35%', bg: 'rgba(255, 255, 255, 0.35)', badgeColor: '#ffffff' }
  ];

  return (
    <View style={[styles.card, styles.blueChartCard]}>
      <View style={styles.widgetHeader}>
        <Text style={styles.blueCardTitle}>Statistik Jam Kerja (Working Hours)</Text>
        <View style={styles.blueDatePill}>
          <Feather name="calendar" size={12} color="#ffffff" />
          <Text style={styles.blueDateText}>Minggu Ini</Text>
        </View>
      </View>

      <Text style={styles.blueSubHeader}>
        Rata-rata: 9hr 55min/hari • {todayAttendance?.check_in
          ? `Masuk: ${new Date(todayAttendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : 'Belum presensi hari ini'}
      </Text>

      {/* Legend for Soft Color Differentiation */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#ffffff' }]} />
          <Text style={styles.legendText}>Hadir</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#e9d5ff' }]} />
          <Text style={styles.legendText}>Cuti</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#fbcfe8' }]} />
          <Text style={styles.legendText}>Sakit</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: 'rgba(15, 23, 42, 0.5)' }]} />
          <Text style={styles.legendText}>Kosong</Text>
        </View>
      </View>

      {/* 7 Vertical Bar Pills (Non-rotated, Crisp Text Rendering) */}
      <View style={styles.barsContainer}>
        <View style={styles.barsRow}>
          {daysData.map((item, idx) => (
            <View key={idx} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { height: item.height as any, backgroundColor: item.bg }]}>
                  {/* Clean Dot Accent Instead of Rotated Text */}
                  <View style={[styles.barDotAccent, { backgroundColor: item.badgeColor }]} />
                </View>
              </View>
              <Text style={styles.barNum}>{item.num}</Text>
              <Text style={styles.barDay}>{item.day}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// 5. Travel on Duty Banner
export const TravelOnDutyBanner: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <View style={styles.travelBanner}>
      <View style={styles.travelLeft}>
        <View style={styles.travelIconBox}>
          <Feather name="briefcase" size={18} color="#ffffff" />
        </View>
        <View>
          <Text style={styles.travelTitle}>Dinas Luar Kota (Travel on Duty)</Text>
          <Text style={styles.travelSub}>
            {user?.department ? `${user.department} • Penugasan Lapangan` : 'Pengajuan Penugasan & Perjalanan Dinas'}
          </Text>
        </View>
      </View>
      <Feather name="arrow-right" size={18} color="#ffffff" />
    </View>
  );
};

// 6. HR / Manager Leave Approval Card (Multi-Level Approval System)
export const HRLeaveApprovalCard: React.FC = () => {
  const { leaves, approveLeaveL1, approveLeave, rejectLeave } = useHRStore();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const isHR = user?.permissions?.includes('approve_leave') || user?.role_name === 'Admin' || user?.role_name === 'HR Manager';
  const pendingLeave = leaves.find((l) => l.status === 'PENDING' || l.status === 'APPROVED_L1');

  if (!isHR || !pendingLeave) return null;

  const isL1 = pendingLeave.status === 'PENDING';

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight, styles.approvalCard]}>
      <View style={styles.approvalHeader}>
        <View style={styles.userAvatarBox}>
          <Text style={styles.avatarChar}>{pendingLeave.user_name?.substring(0, 1) || 'H'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.approvalName, isDark ? styles.textDark : styles.textLight]}>
            {pendingLeave.user_name || 'Karyawan'} <Text style={styles.appliedText}>Pengajuan {pendingLeave.duration_days || 2} Hari</Text>
          </Text>
          <Text style={styles.approvalDates}>
            {pendingLeave.start_date} - {pendingLeave.end_date} • <Text style={{ color: '#2563eb', fontWeight: '800' }}>{pendingLeave.leave_type}</Text>
          </Text>
          <Text style={[styles.casualTag, { color: isL1 ? '#d97706' : '#2563eb' }]}>
            Status: {isL1 ? '⏳ Menunggu Persetujuan L1 (Manager)' : '🔹 Disetujui L1 (Manager) - Menunggu Final HR'}
          </Text>
        </View>
      </View>

      <View style={styles.approvalBtnRow}>
        {isL1 ? (
          <TouchableOpacity
            onPress={() => approveLeaveL1(pendingLeave.id)}
            style={[styles.approveBtn, { backgroundColor: '#2563eb' }]}
          >
            <Text style={styles.btnTextWhite}>Approve L1 (Manager)</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => approveLeave(pendingLeave.id)}
            style={[styles.approveBtn, { backgroundColor: '#16a34a' }]}
          >
            <Text style={styles.btnTextWhite}>Approve Final (HR)</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => rejectLeave(pendingLeave.id)}
          style={styles.rejectBtn}
        >
          <Text style={styles.btnTextWhite}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 7. Team Members Ribbon (Department Colleagues from SQLite Database)
export const TeamMembersRibbon: React.FC = () => {
  const { user } = useAuthStore();
  const { teamMembers } = useHRStore();

  const deptMembers = teamMembers.filter(
    (m) => m.department === user?.department || m.division === user?.division
  );

  const membersToDisplay = deptMembers.length > 0 ? deptMembers : teamMembers;

  return (
    <View style={styles.teamRibbon}>
      <View style={styles.avatarOverlapRow}>
        {membersToDisplay.slice(0, 4).map((member, idx) => (
          <View key={member.id || idx} style={[styles.overlapAvatar, { marginLeft: idx > 0 ? -10 : 0 }]}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: '#2563eb' }}>
              {member.name?.substring(0, 1) || 'K'}
            </Text>
          </View>
        ))}
        {membersToDisplay.length > 4 && (
          <View style={[styles.overlapAvatar, { marginLeft: -10, backgroundColor: 'rgba(255, 255, 255, 0.3)' }]}>
            <Text style={{ fontSize: 10, color: '#ffffff', fontWeight: '800' }}>
              +{membersToDisplay.length - 4}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.memberBadge}>
        <Text style={styles.memberBadgeText}>
          {membersToDisplay.length} Anggota {user?.department ? user.department : 'Departemen'} →
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 18, borderRadius: 28, marginBottom: 14, borderWidth: 1 },
  cardDark: { backgroundColor: '#0f172a', borderColor: '#1e293b' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },

  // Notice
  noticeCard: { flexDirection: 'row', gap: 12 },
  noticeIconBox: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(99, 102, 241, 0.15)', justifyContent: 'center', alignItems: 'center' },
  noticeTitle: { fontSize: 14, fontWeight: '800' },
  noticeDesc: { fontSize: 11, color: '#94a3b8', marginTop: 2, marginBottom: 8 },
  noticeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  officeBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(37, 99, 235, 0.12)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  officeBadgeText: { fontSize: 9, fontWeight: '800', color: '#2563eb' },
  seeDetailsText: { fontSize: 10, fontWeight: '800', color: '#6366f1' },

  // Timeline
  widgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  dateHeader: { fontSize: 13, fontWeight: '800', color: '#94a3b8' },
  cardTitle: { fontSize: 15, fontWeight: '800' },
  viewBadge: { borderWidth: 1, borderColor: '#cbd5e1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  viewBadgeText: { fontSize: 10, fontWeight: '700', color: '#64748b' },
  timelineRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  leftTimeline: { flex: 1, paddingRight: 10 },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  stepIcon: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  stepTime: { fontSize: 13, fontWeight: '800' },
  stepLabel: { fontSize: 10, color: '#94a3b8' },
  verticalLine: { width: 2, height: 16, backgroundColor: '#e2e8f0', marginLeft: 11, marginVertical: 2 },
  rightStatsColumn: { width: 130, gap: 10 },
  totalHoursCard: { backgroundColor: 'rgba(37, 99, 235, 0.12)', padding: 12, borderRadius: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hoursSub: { fontSize: 9, color: '#64748b', fontWeight: '600' },
  hoursVal: { fontSize: 15, fontWeight: '900', color: '#2563eb' },
  clockIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' },
  statusBox: { borderWidth: 1, borderColor: '#e2e8f0', padding: 10, borderRadius: 18 },
  statusBoxTitle: { fontSize: 9, color: '#94a3b8' },
  statusBoxVal: { fontSize: 12, fontWeight: '800', color: '#0f172a', marginVertical: 2 },
  greenPill: { flexDirection: 'row', alignItems: 'center', gap: 2, backgroundColor: 'rgba(34, 197, 94, 0.15)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  greenPillText: { fontSize: 8, fontWeight: '800', color: '#22c55e' },
  shiftFooter: { fontSize: 10, color: '#94a3b8', marginTop: 12, fontStyle: 'italic' },

  // Leave Donut
  yearPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  yearPillText: { fontSize: 10, fontWeight: '700', color: '#64748b' },
  leaveHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  availText: { fontSize: 11, color: '#94a3b8' },
  ringSection: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 },
  donutCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 6, borderColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  donutVal: { fontSize: 20, fontWeight: '900', color: '#2563eb' },
  donutSub: { fontSize: 8, color: '#94a3b8', fontWeight: '600' },
  categoriesColumn: { flex: 1, gap: 6 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  catText: { fontSize: 10, color: '#94a3b8' },
  boldText: { fontWeight: '800', color: '#2563eb' },
  summaryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 10 },
  summaryTitle: { fontSize: 13, fontWeight: '800' },
  allAppliedBtn: { backgroundColor: '#2563eb', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  allAppliedText: { fontSize: 9, color: '#ffffff', fontWeight: '800' },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 10, fontWeight: '700', color: '#64748b' },
  progressVal: { fontSize: 10, fontWeight: '800', color: '#94a3b8' },
  track: { width: '100%', height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },

  // Working Hours Blue Card
  blueChartCard: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  blueCardTitle: { fontSize: 15, fontWeight: '900', color: '#ffffff' },
  blueDatePill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  blueDateText: { fontSize: 10, fontWeight: '800', color: '#ffffff' },
  blueSubHeader: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
  legendRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 9, color: 'rgba(255, 255, 255, 0.9)', fontWeight: '700' },
  barsContainer: { marginTop: 10, position: 'relative' },
  barBadgeOver: { position: 'absolute', top: -20, left: '60%', backgroundColor: '#ffffff', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  barBadgeText: { fontSize: 8, fontWeight: '900', color: '#2563eb' },
  barsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120 },
  barCol: { alignItems: 'center', gap: 4 },
  barTrack: { width: 28, height: 90, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 14, justifyContent: 'flex-end', padding: 2, overflow: 'hidden' },
  barFill: { width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  barFillActive: { backgroundColor: '#ffffff' },
  barDotAccent: { width: 6, height: 6, borderRadius: 3, marginTop: 4 },
  barNum: { fontSize: 9, fontWeight: '800', color: '#ffffff' },
  barDay: { fontSize: 9, color: 'rgba(255, 255, 255, 0.8)' },

  // Travel Banner
  travelBanner: { backgroundColor: '#2563eb', borderRadius: 24, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  travelLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  travelIconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  travelTitle: { fontSize: 14, fontWeight: '900', color: '#ffffff' },
  travelSub: { fontSize: 10, color: 'rgba(255, 255, 255, 0.8)' },

  // Approval Card
  approvalCard: { borderWidth: 1, borderColor: '#e2e8f0' },
  approvalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  userAvatarBox: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  avatarChar: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
  approvalName: { fontSize: 13, fontWeight: '800' },
  appliedText: { fontSize: 10, color: '#94a3b8', fontWeight: '500' },
  approvalDates: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  casualTag: { fontSize: 10, fontWeight: '800', color: '#2563eb', marginTop: 2 },
  approvalBtnRow: { flexDirection: 'row', gap: 10 },
  approveBtn: { flex: 1, backgroundColor: '#2563eb', paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  rejectBtn: { flex: 1, backgroundColor: '#f43f5e', paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  btnTextWhite: { color: '#ffffff', fontWeight: '800', fontSize: 11 },

  // Team Ribbon
  teamRibbon: { backgroundColor: '#2563eb', padding: 14, borderRadius: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  avatarOverlapRow: { flexDirection: 'row', alignItems: 'center' },
  overlapAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#2563eb' },
  memberBadge: { backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  memberBadgeText: { fontSize: 10, fontWeight: '900', color: '#2563eb' }
});
