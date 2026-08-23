import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';

export const TrainingsScreen: React.FC = () => {
  const { trainings } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Feather name="award" size={20} color="#2563eb" />
        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>Pelatihan & Sertifikat</Text>
      </View>

      <View style={styles.list}>
        {trainings.length === 0 ? (
          <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight, { padding: 20, alignItems: 'center' }]}>
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Belum ada data pelatihan terdaftar.</Text>
          </View>
        ) : (
          trainings.map((t) => (
            <View key={t.id} style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.itemTitle, isDark ? styles.textDark : styles.textLight]}>{t.title}</Text>
                  <Text style={styles.provider}>{t.provider}</Text>
                </View>
                <View style={styles.catBadge}>
                  <Text style={styles.catText}>{t.category}</Text>
                </View>
              </View>

              <Text style={{ fontSize: 10, color: '#94a3b8', marginTop: 6 }}>
                Periode: {t.start_date} s.d. {t.end_date}
              </Text>

              {t.expiry_date && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Feather name="clock" size={12} color="#10b981" />
                  <Text style={{ fontSize: 10, fontWeight: '800', color: '#10b981' }}>
                    Sertifikat Aktif s.d. {t.expiry_date}
                  </Text>
                </View>
              )}

              {t.certification_url && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(t.certification_url)}
                  style={styles.certBtn}
                >
                  <Feather name="check-circle" size={12} color="#2563eb" />
                  <Text style={styles.certBtnText}>Lihat Sertifikat Digital</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '900' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  list: { gap: 12 },
  card: { padding: 14, borderRadius: 20, borderWidth: 1 },
  itemTitle: { fontSize: 13, fontWeight: '900' },
  provider: { fontSize: 10, color: '#2563eb', fontWeight: '800', marginTop: 2 },
  catBadge: { backgroundColor: 'rgba(37, 99, 235, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  catText: { fontSize: 9, fontWeight: '800', color: '#2563eb' },
  certBtn: { marginTop: 10, backgroundColor: 'rgba(37, 99, 235, 0.1)', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' },
  certBtnText: { fontSize: 10, fontWeight: '800', color: '#2563eb' }
});
