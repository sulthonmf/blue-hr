import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { client } from '../api/client';

export const FieldVisitScreen: React.FC<{ navigation?: any }> = () => {
  const { t } = useLanguageStore();
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
      await client.post('/api/v1/field-visits', {
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.fieldVisit}</Text>
        
        <Text style={styles.label}>{t.clientName}</Text>
        <TextInput
          style={styles.input}
          value={clientName}
          onChangeText={setClientName}
          placeholder="PT Klien Mitra"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Lokasi / Area GPS</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
        />

        <Text style={styles.label}>Catatan & Hasil Kunjungan</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Ringkasan hasil rapat..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitBtnText}>{isSubmitting ? t.submitting : 'Check-In Kunjungan'}</Text>
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
  submitBtn: { backgroundColor: '#0284c7', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 }
});
