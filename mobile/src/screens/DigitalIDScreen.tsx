import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useAuthStore } from '../stores/useAuthStore';
import { useLanguageStore } from '../stores/useLanguageStore';

export const DigitalIDScreen: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.brandTitle}>BlueHR Enterprise</Text>
          <Text style={styles.cardBadge}>OFFICIAL ID</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{user?.name?.substring(0, 2).toUpperCase() || 'EMP'}</Text>
          </View>
          <Text style={styles.name}>{user?.name || 'Budi Santoso'}</Text>
          <Text style={styles.position}>{user?.role_name || 'Software Engineer'}</Text>
          <Text style={styles.nip}>NIP: EMP-2026-8809</Text>
        </View>

        <View style={styles.qrContainer}>
          <View style={styles.qrBox}>
            <Text style={styles.qrPlaceholder}>[ QR CODE DIGITAL ]</Text>
          </View>
          <Text style={styles.qrHint}>{t.qrScanHint}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  content: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#1e293b', borderRadius: 28, padding: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#334155', elevation: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 24 },
  brandTitle: { fontSize: 16, fontWeight: '900', color: '#38bdf8' },
  cardBadge: { fontSize: 10, fontWeight: '800', backgroundColor: '#0284c7', color: '#ffffff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  profileSection: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 24, fontWeight: '900', color: '#ffffff' },
  name: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  position: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  nip: { fontSize: 11, fontWeight: '700', color: '#38bdf8', marginTop: 6, backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  qrContainer: { alignItems: 'center', width: '100%', paddingTop: 16, borderTopWidth: 1, borderTopColor: '#334155' },
  qrBox: { width: 160, height: 160, backgroundColor: '#ffffff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  qrPlaceholder: { fontSize: 11, fontWeight: '800', color: '#0f172a' },
  qrHint: { fontSize: 11, color: '#94a3b8', textAlign: 'center' }
});
