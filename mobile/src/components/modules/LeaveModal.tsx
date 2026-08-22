import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../../stores/useHRStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeaveModal: React.FC<LeaveModalProps> = ({ isOpen, onClose }) => {
  const { requestLeave } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === 'dark';

  const [leaveType, setLeaveType] = useState<'ANNUAL' | 'SICK' | 'UNPAID'>('ANNUAL');
  const [duration, setDuration] = useState('1');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      await requestLeave({
        leave_type: leaveType,
        start_date: todayStr,
        end_date: todayStr,
        duration_days: parseInt(duration, 10) || 1,
        reason
      });
      onClose();
    } catch (e) {
      // Error handled by store
    }
  };

  if (!isOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={isOpen}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.header}>
            <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
              {t.requestLeave}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={20} color={isDark ? '#94a3b8' : '#64748b'} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
            {t.leaveTypeLabel}
          </Text>
          <View style={styles.typeRow}>
            {(['ANNUAL', 'SICK', 'UNPAID'] as const).map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setLeaveType(type)}
                style={[
                  styles.typeBtn,
                  leaveType === type ? styles.typeBtnActive : isDark ? styles.typeBtnDark : styles.typeBtnLight
                ]}
              >
                <Text style={[styles.typeText, leaveType === type && styles.textWhite]}>
                  {type === 'ANNUAL' ? 'Tahunan' : type === 'SICK' ? 'Sakit' : 'Izin'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
            Jumlah Hari
          </Text>
          <TextInput
            keyboardType="numeric"
            value={duration}
            onChangeText={setDuration}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          />

          <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
            {t.reasonLabel}
          </Text>
          <TextInput
            placeholder="Alasan pengajuan cuti..."
            placeholderTextColor="#94a3b8"
            value={reason}
            onChangeText={setReason}
            style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnCancel]}>
              <Text style={styles.btnCancelText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={[styles.btn, styles.btnSubmit]}>
              <Text style={styles.btnSubmitText}>{t.submit}</Text>
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
  textWhite: { color: '#ffffff' },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 6 },
  typeRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  typeBtn: { flex: 1, paddingVertical: 10, borderRadius: 14, alignItems: 'center', borderWidth: 1 },
  typeBtnDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  typeBtnLight: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0' },
  typeBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  typeText: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  input: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 1, fontSize: 12, marginBottom: 10 },
  inputDark: { backgroundColor: '#1e293b', borderColor: '#334155', color: '#ffffff' },
  inputLight: { backgroundColor: '#f8fafc', borderColor: '#e2e8f0', color: '#0f172a' },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  btnCancel: { backgroundColor: '#94a3b8' },
  btnCancelText: { color: '#ffffff', fontWeight: '700', fontSize: 12 },
  btnSubmit: { backgroundColor: '#2563eb' },
  btnSubmitText: { color: '#ffffff', fontWeight: '800', fontSize: 12 }
});
