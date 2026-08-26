import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { client } from '../api/client';

export const HelpdeskScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject || !description) {
      Alert.alert('Perhatian', 'Mohon isi subjek dan deskripsi keluhan.');
      return;
    }
    setIsSubmitting(true);
    try {
      await client.post('/api/v1/tickets', {
        subject,
        description,
        category: 'GENERAL',
        priority: 'NORMAL'
      });
      Alert.alert('Sukses', 'Tiket bantuan HR telah dikirim.');
      setSubject('');
      setDescription('');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.helpdeskTickets}</Text>
        
        <Text style={styles.label}>Subjek Pertanyaan / Kendala</Text>
        <TextInput
          style={styles.input}
          value={subject}
          onChangeText={setSubject}
          placeholder="Subjek keluhan..."
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Deskripsi Detail</Text>
        <TextInput
          style={[styles.input, { height: 90 }]}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Jelaskan pertanyaan atau kendala Anda..."
          placeholderTextColor="#94a3b8"
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
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 16 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 }
});
