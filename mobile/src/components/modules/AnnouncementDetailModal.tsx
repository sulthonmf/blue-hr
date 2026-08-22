import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../../stores/useHRStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { AnnouncementItem } from '../../types';

interface AnnouncementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAnnouncement?: AnnouncementItem | null;
}

export const AnnouncementDetailModal: React.FC<AnnouncementDetailModalProps> = ({
  isOpen,
  onClose,
  initialAnnouncement
}) => {
  const { announcements } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [selectedAnn, setSelectedAnn] = useState<AnnouncementItem | null>(
    initialAnnouncement || announcements[0] || null
  );

  const activeAnn = selectedAnn || announcements[0] || {
    id: 1,
    title: 'Kebijakan Jam Kerja & Absensi Hibrid 2026',
    content: 'Seluruh karyawan diwajibkan melakukan absen geofencing radius 5 km dari lokasi kantor Jakarta Central.',
    category: 'IMPORTANT',
    author_name: 'HR Department',
    is_pinned: 1,
    created_at: '2026-08-22'
  };

  if (!isOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={isOpen}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={styles.iconBox}>
                <Feather name="volume-2" size={18} color="#6366f1" />
              </View>
              <Text style={[styles.headerTitle, isDark ? styles.textDark : styles.textLight]}>
                Pengumuman Perusahaan (HR)
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Active Announcement Card */}
            <View style={[styles.activeCard, isDark ? styles.activeCardDark : styles.activeCardLight]}>
              <View style={styles.badgeRow}>
                <View style={styles.categoryBadge}>
                  <Feather name="bell" size={10} color="#2563eb" />
                  <Text style={styles.categoryText}>{activeAnn.category || 'IMPORTANT'}</Text>
                </View>
                {activeAnn.is_pinned === 1 && (
                  <View style={styles.pinBadge}>
                    <Feather name="check" size={10} color="#059669" />
                    <Text style={styles.pinText}>Pinned</Text>
                  </View>
                )}
              </View>

              <Text style={[styles.annTitle, isDark ? styles.textDark : styles.textLight]}>
                {activeAnn.title}
              </Text>

              <Text style={styles.metaText}>
                Oleh {activeAnn.author_name || 'Tim HR'} • {activeAnn.created_at || 'Hari ini'}
              </Text>

              <View style={styles.divider} />

              <Text style={[styles.annBody, isDark ? styles.textBodyDark : styles.textBodyLight]}>
                {activeAnn.content}
              </Text>
            </View>

            {/* List of All Other Announcements */}
            {announcements.length > 1 && (
              <View style={styles.otherSection}>
                <Text style={[styles.otherTitle, isDark ? styles.textDark : styles.textLight]}>
                  Pengumuman Lainnya ({announcements.length}):
                </Text>
                {announcements.map((ann) => (
                  <TouchableOpacity
                    key={ann.id}
                    onPress={() => setSelectedAnn(ann)}
                    style={[
                      styles.otherItem,
                      isDark ? styles.otherItemDark : styles.otherItemLight,
                      activeAnn.id === ann.id && styles.activeOtherItem
                    ]}
                  >
                    <View style={styles.otherItemHeader}>
                      <Text
                        style={[styles.otherItemTitle, isDark ? styles.textDark : styles.textLight]}
                        numberOfLines={1}
                      >
                        {ann.title}
                      </Text>
                      <Text style={styles.otherItemCat}>{ann.category}</Text>
                    </View>
                    <Text style={styles.otherItemDesc} numberOfLines={1}>
                      {ann.content}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer Action */}
          <TouchableOpacity onPress={onClose} style={styles.closeActionBtn}>
            <Text style={styles.closeActionText}>Tutup Detail Pengumuman</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', padding: 20 },
  card: { borderRadius: 28, padding: 20, maxHeight: '85%' },
  cardDark: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: 1 },
  cardLight: { backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 15, fontWeight: '800' },
  closeBtn: { padding: 4 },
  scrollContent: { marginBottom: 14 },
  activeCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 16 },
  activeCardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  activeCardLight: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  categoryBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(37, 99, 235, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  categoryText: { color: '#2563eb', fontSize: 10, fontWeight: '800' },
  pinBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(16, 185, 129, 0.1)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  pinText: { color: '#059669', fontSize: 10, fontWeight: '800' },
  annTitle: { fontSize: 16, fontWeight: '800', lineHeight: 22, marginBottom: 6 },
  metaText: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  divider: { height: 1, backgroundColor: 'rgba(148, 163, 184, 0.2)', marginVertical: 12 },
  annBody: { fontSize: 13, lineHeight: 20 },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  textBodyDark: { color: '#cbd5e1' },
  textBodyLight: { color: '#334155' },
  otherSection: { marginTop: 4 },
  otherTitle: { fontSize: 13, fontWeight: '800', marginBottom: 8 },
  otherItem: { padding: 12, borderRadius: 14, borderWidth: 1, marginBottom: 8 },
  otherItemDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  otherItemLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  activeOtherItem: { borderColor: '#2563eb', borderWidth: 2 },
  otherItemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  otherItemTitle: { fontSize: 12, fontWeight: '700', flex: 1, marginRight: 8 },
  otherItemCat: { fontSize: 9, fontWeight: '800', color: '#6366f1' },
  otherItemDesc: { fontSize: 11, color: '#94a3b8' },
  closeActionBtn: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 16, alignItems: 'center' },
  closeActionText: { color: '#ffffff', fontWeight: '800', fontSize: 12 }
});
