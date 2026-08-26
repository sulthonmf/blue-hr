import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { client } from '../api/client';

export const OvertimeScreen: React.FC<{ navigation?: any }> = () => {
  const { t } = useLanguageStore();
  const [overtimes, setOvertimes] = useState<any[]>([]);
  const [date, setDate] = useState('2026-08-26');
  const [hours, setHours] = useState('3');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOvertimes = async () => {
    try {
      const res = await client.get('/api/v1/overtime/my');
      setOvertimes(res.data);
    } catch {
      setOvertimes([
        { id: 1, date: '2026-08-20', hours: 3, reason: 'Rilis fitur baru v2.0', status: 'APPROVED' },
        { id: 2, date: '2026-08-24', hours: 2, reason: 'Maintenance Server DB', status: 'PENDING' }
      ]);
    }
  };

  useEffect(() => {
    fetchOvertimes();
  }, []);

  const handleSubmit = async () => {
    if (!reason) {
      Alert.alert('Perhatian', 'Mohon isi alasan lembur.');
      return;
    }
    setIsSubmitting(true);
    try {
      await client.post('/api/v1/overtime', {
        date,
        hours: parseFloat(hours),
        reason
      });
      Alert.alert('Sukses', 'Pengajuan upah lembur berhasil dikirim.');
      setReason('');
      fetchOvertimes();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.overtime}</Text>
        
        <Text style={styles.label}>Tanggal Lembur</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
        />

        <Text style={styles.label}>{t.overtimeHours}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />

        <Text style={styles.label}>Alasan & Deskripsi Pekerjaan</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          multiline
          value={reason}
          onChangeText={setReason}
          placeholder="Jelaskan tugas lembur..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitBtnText}>{isSubmitting ? t.submitting : t.submit}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Riwayat Pengajuan Lembur</Text>
      {overtimes.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{item.date} • {item.hours} Jam</Text>
            <Text style={styles.historySubtitle}>{item.reason}</Text>
          </View>
          <Text style={[styles.statusBadge, item.status === 'APPROVED' ? styles.statusApproved : styles.statusPending]}>
            {item.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 8, marginBottom: 4 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0f172a' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#334155', marginTop: 8 },
  historyCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#e2e8f0' },
  historyTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  historySubtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  statusBadge: { fontSize: 10, fontWeight: '800', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, overflow: 'hidden' },
  statusApproved: { backgroundColor: '#dcfce7', color: '#166534' },
  statusPending: { backgroundColor: '#fef3c7', color: '#92400e' }
});
