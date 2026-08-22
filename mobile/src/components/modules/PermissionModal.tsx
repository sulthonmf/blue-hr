import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useThemeStore } from '../../stores/useThemeStore';

interface PermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantPermissions: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({
  isOpen,
  onClose,
  onGrantPermissions
}) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={isOpen}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Feather name="shield" size={24} color="#2563eb" />
            </View>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              Izin Akses Kamera & GPS Geofence
            </Text>
            <Text style={styles.desc}>
              Untuk memastikan validitas presensi, aplikasi memerlukan izin akses Kamera (Foto Selfie Presensi) dan Lokasi GPS Perangkat.
            </Text>
          </View>

          <View style={styles.permissionList}>
            <View style={styles.permRow}>
              <Feather name="map-pin" size={16} color="#2563eb" />
              <View>
                <Text style={[styles.permTitle, isDark ? styles.textDark : styles.textLight]}>Lokasi GPS Geofence</Text>
                <Text style={styles.permDesc}>Memverifikasi posisi Anda dalam radius lokasi kantor</Text>
              </View>
            </View>
            <View style={styles.permRow}>
              <Feather name="camera" size={16} color="#2563eb" />
              <View>
                <Text style={[styles.permTitle, isDark ? styles.textDark : styles.textLight]}>Kamera Perangkat</Text>
                <Text style={styles.permDesc}>Mengambil foto selfie verifikasi saat presensi</Text>
              </View>
            </View>
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
              <Text style={styles.btnCancelText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onGrantPermissions} style={[styles.btn, styles.btnSubmit]}>
              <Text style={styles.btnSubmitText}>Izinkan Akses</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.7)', justifyContent: 'center', padding: 20 },
  card: { padding: 24, borderRadius: 28 },
  cardDark: { backgroundColor: '#0f172a', borderColor: '#1e293b', borderWidth: 1 },
  cardLight: { backgroundColor: '#ffffff' },
  header: { alignItems: 'center', marginBottom: 16 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(37, 99, 235, 0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  desc: { fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 16 },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  permissionList: { gap: 12, marginVertical: 12, backgroundColor: 'rgba(148, 163, 184, 0.08)', padding: 14, borderRadius: 18 },
  permRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  permTitle: { fontSize: 12, fontWeight: '800' },
  permDesc: { fontSize: 10, color: '#94a3b8' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  btnCancel: { backgroundColor: '#94a3b8' },
  btnCancelText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  btnSubmit: { backgroundColor: '#2563eb' },
  btnSubmitText: { color: '#ffffff', fontWeight: '800', fontSize: 12 }
});
