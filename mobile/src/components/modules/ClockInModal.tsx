import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../../stores/useHRStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

import { authenticateMobileBiometric } from '../../services/biometrics';
import { checkMobileSecurity } from '../../services/security';

interface ClockInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClockInModal: React.FC<ClockInModalProps> = ({ isOpen, onClose }) => {
  const { clockIn, simulatedDistanceKm } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === 'dark';

  const [notes, setNotes] = useState('');
  const inRadius = simulatedDistanceKm <= 5.0;

  const handleSubmit = async () => {
    try {
      const sec = checkMobileSecurity();
      if (!sec.isSecure) {
        alert(`⚠️ Keamanan Perangkat: ${sec.warnings.join(', ')}`);
      }

      const bioRes = await authenticateMobileBiometric('Clock In Presensi Geofencing');
      if (!bioRes.success) {
        alert(`❌ Biometrik Gagal: ${bioRes.message}`);
        return;
      }

      await clockIn('https://via.placeholder.com/150', notes || 'Presensi Mobile (Biometric Verified)');
      onClose();
    } catch (e) {
      // Error is handled via store error popup
    }
  };

  if (!isOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={isOpen}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              Clock In Presensi
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <View style={[styles.statusBox, inRadius ? styles.bgGreen : styles.bgRose]}>
            <Feather name={inRadius ? 'check-circle' : 'alert-circle'} size={18} color={inRadius ? '#22c55e' : '#f43f5e'} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.statusTitle, inRadius ? styles.textGreen : styles.textRose]}>
                {inRadius ? 'Radius Valid' : 'Di Luar Radius (Tolak/Flag)'}
              </Text>
              <Text style={styles.statusDesc}>
                Jarak GPS: {simulatedDistanceKm.toFixed(1)} km dari titik kantor.
              </Text>
            </View>
          </View>

          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
            Catatan Presensi (Opsional)
          </Text>
          <TextInput
            placeholder="Contoh: Kerja dari cabang/site..."
            placeholderTextColor="#94a3b8"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
              <Text style={styles.btnCancelText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.btn, styles.btnSubmit]}>
              <Text style={styles.btnSubmitText}>Konfirmasi Clock In</Text>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '800' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  statusBox: { padding: 14, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  bgGreen: { backgroundColor: 'rgba(34, 197, 94, 0.12)' },
  bgRose: { backgroundColor: 'rgba(244, 63, 94, 0.12)' },
  statusTitle: { fontSize: 12, fontWeight: '800' },
  statusDesc: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  textGreen: { color: '#22c55e' },
  textRose: { color: '#f43f5e' },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6 },
  input: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, fontSize: 12, marginBottom: 20 },
  inputDark: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#ffffff' },
  inputLight: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  btnCancel: { backgroundColor: '#94a3b8' },
  btnCancelText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  btnSubmit: { backgroundColor: '#2563eb' },
  btnSubmitText: { color: '#ffffff', fontWeight: '800', fontSize: 12 }
});
