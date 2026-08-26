import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { useThemeStore } from '../stores/useThemeStore';
import { apiClient } from '../api/client';

export const AnnouncementsScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [announcements, setAnnouncements] = useState<any[]>([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await apiClient.get('/announcements');
      setAnnouncements(res.data || []);
    } catch {
      setAnnouncements([
        { id: 1, title: 'Kebijakan Jam Kerja & Absensi Hibrid 2026', content: 'Seluruh karyawan diwajibkan melakukan absen geofencing radius 5 km dari lokasi kantor.', category: 'IMPORTANT', created_at: '2026-08-20' },
        { id: 2, title: 'Townhall All-Hands Meeting Q3', content: 'Acara Townhall perusahaan akan diselenggarakan hari Jumat jam 14.00 WIB.', category: 'GENERAL', created_at: '2026-08-22' }
      ]);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      <Text style={[styles.screenTitle, isDark ? styles.textDark : styles.textLight]}>{t.announcements || 'Pengumuman Perusahaan'}</Text>
      
      {announcements.map((a) => (
        <View key={a.id} style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.badgeRow}>
            <Text style={styles.catBadge}>{a.category || 'INFO'}</Text>
            <Text style={styles.dateText}>{a.created_at || '2026-08'}</Text>
          </View>
          <Text style={[styles.annTitle, isDark ? styles.textDark : styles.textLight]}>{a.title}</Text>
          <Text style={[styles.annContent, isDark ? styles.descDark : styles.descLight]}>{a.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  descDark: { color: '#94a3b8' },
  descLight: { color: '#475569' },
  content: { padding: 16, gap: 12 },
  screenTitle: { fontSize: 18, fontWeight: '900', marginBottom: 6 },
  card: { borderRadius: 20, padding: 16, borderWidth: 1 },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  catBadge: { fontSize: 10, fontWeight: '900', backgroundColor: 'rgba(37, 99, 235, 0.12)', color: '#2563eb', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  dateText: { fontSize: 11, color: '#94a3b8' },
  annTitle: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  annContent: { fontSize: 12, lineHeight: 18 }
});
