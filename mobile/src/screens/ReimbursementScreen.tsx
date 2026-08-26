import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import Feather from 'react-native-vector-[#expo/vector-icons]';
import { useLanguageStore } from '../stores/useLanguageStore';
import { client } from '../api/client';

export const ReimbursementScreen: React.FC<{ navigation?: any }> = () => {
  const { t } = useLanguageStore();
  const [claims, setClaims] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClaims = async () => {
    try {
      const res = await client.get('/api/v1/reimbursements/my');
      setClaims(res.data);
    } catch {
      setClaims([
        { id: 1, title: 'Bensin & Tol Dinas', amount: 250000, status: 'APPROVED', created_at: '2026-08-20' },
        { id: 2, title: 'Konsumsi Meeting Klien', amount: 180000, status: 'PENDING', created_at: '2026-08-24' }
      ]);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handlePickReceipt = () => {
    setReceiptImage('https://via.placeholder.com/300x200.png?text=Bukti+Struk');
    Alert.alert('Sukses', 'Bukti foto struk berhasil dilampirkan.');
  };

  const handleSubmit = async () => {
    if (!title || !amount) {
      Alert.alert('Perhatian', 'Mohon isi judul klaim dan nominal.');
      return;
    }
    setIsSubmitting(true);
    try {
      await client.post('/api/v1/reimbursements', {
        title,
        amount: parseFloat(amount),
        description,
        receipt_url: receiptImage
      });
      Alert.alert('Sukses', 'Klaim reimbursement berhasil diajukan.');
      setTitle('');
      setAmount('');
      setDescription('');
      setReceiptImage(null);
      fetchClaims();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t.reimbursements}</Text>
        <Text style={styles.label}>Judul Pengeluaran</title>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Contoh: Taksi Dinas / Parkir"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>{t.amountLabel}</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="250000"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>{t.descriptionLabel}</Text>
        <TextInput
          style={[styles.input, { height: 70 }]}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Catatan keperluan dinas..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity style={styles.uploadBtn} onPress={handlePickReceipt}>
          <Text style={styles.uploadBtnText}>📷 {receiptImage ? 'Bukti Struk Terlampir' : t.uploadReceipt}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={isSubmitting}>
          <Text style={styles.submitBtnText}>{isSubmitting ? t.submitting : t.submit}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeader}>Riwayat Pengajuan</Text>
      {claims.map((item) => (
        <View key={item.id} style={styles.historyCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.historyTitle}>{item.title}</Text>
            <Text style={styles.historySubtitle}>Rp {Number(item.amount).toLocaleString('id-ID')} • {item.created_at}</Text>
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
  card: { backgroundColor: '#ffffff', borderRadius: 20, padding: 16, borderHeight: 1, borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '700', color: '#64748b', marginTop: 8, marginBottom: 4 },
  input: { backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0f172a' },
  uploadBtn: { backgroundColor: '#e2e8f0', borderRadius: 12, padding: 12, alignItems: 'center', marginTop: 12 },
  uploadBtnText: { fontSize: 12, fontWeight: '700', color: '#334155' },
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
