import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { client } from '../api/client';

export const ShiftSwapScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const [targetName, setTargetName] = useState('');
  const [originalDate, setOriginalDate] = useState('2026-09-01');
  const [targetDate, setTargetDate] = useState('2026-09-02');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!targetName) {
      Alert.alert('Perhatian', 'Mohon isi nama rekan pengganti.');
      return;
    }
    setIsSubmitting(true);
    try {
      await client.post('/api/v1/shifts/swap', {
        target_name: targetName,
        original_date: originalDate,
        target_date: targetDate
      });
      Alert.alert('Sukses', 'Pengajuan tukar shift berhasil dikirim.');
      setTargetName('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Pengajuan Tukar Shift</Text>
        
        <Text style={styles.label}>{t.colleagueName}</Text>
        <TextInput
          style={styles.input}
          value={targetName}
          onChangeText={setTargetName}
          placeholder="Nama rekan kerja..."
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Tanggal Shift Asli Anda</Text>
        <TextInput
          style={styles.input}
          value={originalDate}
          onChangeText={setOriginalDate}
        />

        <Text style={styles.label}>Tanggal Shift Tujuan Swap</Text>
        <TextInput
          style={styles.input}
          value={targetDate}
          onChangeText={setTargetDate}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitBtnText}>{isSubmitting ? t.submitting : t.submit}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 8, marginBottom: 4 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0f172a' },
  submitBtn: { backgroundColor: '#0d9488', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 }
});
