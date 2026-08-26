import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { useThemeStore } from '../stores/useThemeStore';
import { apiClient } from '../api/client';

export const FieldVisitScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [clientName, setClientName] = useState('');
  const [location, setLocation] = useState('Jakarta Selatan');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!clientName || !notes) {
      Alert.alert('Perhatian', 'Mohon isi nama klien dan catatan kunjungan.');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post('/field-visits', {
        client_name: clientName,
        location,
        notes
      });
      Alert.alert('Sukses', 'Check-in kunjungan lapangan berhasil dicatat.');
      setClientName('');
      setNotes('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>{t.fieldVisit || 'Kunjungan Lapangan'}</Text>
        
        <Text style={styles.label}>{t.clientName || 'Nama Klien / Perusahaan'}</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={clientName}
          onChangeText={setClientName}
          placeholder="PT Klien Mitra"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Lokasi / Area GPS</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Catatan & Hasil Kunjungan</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Ringkasan hasil rapat..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitBtnText}>{isSubmitting ? (t.submitting || 'Mengirim...') : 'Check-In Kunjungan'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  content: { padding: 16 },
  card: { borderRadius: 20, padding: 16, borderWidth: 1 },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '800', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginTop: 8, marginBottom: 4 },
  input: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  inputDark: { backgroundColor: '#020617', color: '#ffffff' },
  inputLight: { backgroundColor: '#f1f5f9', color: '#0f172a' },
  submitBtn: { backgroundColor: '#0284c7', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 }
});
