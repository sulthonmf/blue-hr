import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../stores/useAuthStore';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';

export const LeaveScreen: React.FC<{ onOpenLeaveModal: () => void }> = ({ onOpenLeaveModal }) => {
  const { user } = useAuthStore();
  const { leaves } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();

  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      {/* Quota Card */}
      <View style={[styles.quotaCard, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.quotaRow}>
          <View>
            <Text style={styles.quotaSub}>{t.leaveQuota}</Text>
            <Text style={[styles.quotaVal, isDark ? styles.textDark : styles.textLight]}>
              {user?.leave_quota ?? 12} <Text style={{ fontSize: 14, color: '#94a3b8' }}>Hari</Text>
            </Text>
          </View>
          <TouchableOpacity onPress={onOpenLeaveModal} style={styles.requestBtn}>
            <Feather name="plus" size={16} color="#ffffff" />
            <Text style={styles.requestBtnText}>{t.requestLeave}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.sectionTitle, isDark ? styles.textDark : styles.textLight]}>
        Riwayat Pengajuan Cuti
      </Text>

      {leaves.length === 0 ? (
        <Text style={styles.empty}>Belum ada riwayat pengajuan cuti.</Text>
      ) : (
        leaves.map((item) => (
          <View key={item.id} style={[styles.leaveCard, isDark ? styles.cardDark : styles.cardLight]}>
            <View style={styles.leaveHeader}>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{item.leave_type}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  item.status === 'APPROVED'
                    ? styles.bgGreen
                    : item.status === 'REJECTED'
                    ? styles.bgRose
                    : styles.bgAmber
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === 'APPROVED'
                      ? styles.textGreen
                      : item.status === 'REJECTED'
                      ? styles.textRose
                      : styles.textAmber
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text style={[styles.reason, isDark ? styles.textDark : styles.textLight]}>
              {item.reason || 'Pengajuan Cuti'}
            </Text>

            <View style={styles.dateRow}>
              <Text style={styles.dateText}>
                {item.start_date} s/d {item.end_date} ({item.duration_days} Hari)
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  quotaCard: { padding: 20, borderRadius: 24, borderWidth: 1, marginBottom: 20 },
  quotaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  quotaSub: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
  quotaVal: { fontSize: 24, fontWeight: '900', marginTop: 2 },
  requestBtn: { backgroundColor: '#2563eb', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 },
  requestBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 11 },
  sectionTitle: { fontSize: 14, fontWeight: '800', marginBottom: 12 },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  empty: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginVertical: 30 },
  leaveCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 10 },
  leaveHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  typeBadge: { backgroundColor: 'rgba(37, 99, 235, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  typeBadgeText: { color: '#2563eb', fontSize: 10, fontWeight: '800' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  bgGreen: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  bgRose: { backgroundColor: 'rgba(244, 63, 94, 0.15)' },
  bgAmber: { backgroundColor: 'rgba(245, 158, 11, 0.15)' },
  statusText: { fontSize: 9, fontWeight: '800' },
  textGreen: { color: '#22c55e' },
  textRose: { color: '#f43f5e' },
  textAmber: { color: '#f59e0b' },
  reason: { fontSize: 13, fontWeight: '700', marginBottom: 6 },
  dateRow: { marginTop: 4 },
  dateText: { fontSize: 11, color: '#94a3b8' }
});
