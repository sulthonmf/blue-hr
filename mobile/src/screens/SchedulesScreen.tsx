import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useLanguageStore } from '../stores/useLanguageStore';
import { useThemeStore } from '../stores/useThemeStore';
import { apiClient } from '../api/client';

export const SchedulesScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [schedules, setSchedules] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(false);

  const [title, setTitle] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [date, setDate] = useState('2026-08-26');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('11:30');

  const fetchData = async () => {
    try {
      const [schedRes, roomRes] = await Promise.all([
        apiClient.get('/schedules'),
        apiClient.get('/meeting-rooms')
      ]);
      setSchedules(schedRes.data || []);
      setRooms(roomRes.data || []);
    } catch {
      setRooms([
        { id: 1, name: 'Ruang Rapat Utama (Executive)', capacity: 16, location: 'Lantai 3 - Gedung A' },
        { id: 2, name: 'Ruang Diskusi Alpha', capacity: 8, location: 'Lantai 2 - Gedung A' }
      ]);
      setSchedules([
        { id: 1, title: 'Sprint Planning & Sync UI/UX', room_name: 'Ruang Rapat Utama (Executive)', date: '2026-08-26', start_time: '09:00', end_time: '10:30', meeting_link: 'https://meet.google.com/abc-defg-hij' }
      ]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBookRoom = async () => {
    if (!title) {
      Alert.alert('Perhatian', 'Mohon isi judul rapat.');
      return;
    }
    try {
      await apiClient.post('/schedules', {
        title,
        room_id: selectedRoom || rooms[0]?.id || 1,
        date,
        start_time: startTime,
        end_time: endTime
      });
      Alert.alert('Sukses', 'Reservasi ruang rapat berhasil dibuat!');
      setIsBooking(false);
      setTitle('');
      fetchData();
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, isDark ? styles.textDark : styles.textLight]}>{t.schedules || 'Agenda & Ruang Rapat'}</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setIsBooking(!isBooking)}>
          <Text style={styles.addBtnText}>{isBooking ? t.cancel : '+ Pesan Ruangan'}</Text>
        </TouchableOpacity>
      </View>

      {isBooking && (
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.cardTitle, isDark ? styles.textDark : styles.textLight]}>Form Reservasi Ruang Rapat</Text>
          
          <Text style={styles.label}>Judul Agenda / Rapat</Text>
          <TextInput style={[styles.input, isDark ? styles.inputDark : styles.inputLight]} value={title} onChangeText={setTitle} placeholder="Sprint Sync / Meeting Klien..." placeholderTextColor="#94a3b8" />

          <Text style={styles.label}>Pilih Ruang Rapat</Text>
          {rooms.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => setSelectedRoom(r.id)}
              style={[styles.roomPill, isDark ? styles.roomPillDark : styles.roomPillLight, selectedRoom === r.id && styles.roomPillActive]}
            >
              <Text style={[styles.roomPillText, isDark ? styles.textDark : styles.textLight, selectedRoom === r.id && styles.textWhite]}>{r.name} ({r.capacity} Orang)</Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Tanggal Rapat</Text>
          <TextInput style={[styles.input, isDark ? styles.inputDark : styles.inputLight]} value={date} onChangeText={setDate} />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Mulai</Text>
              <TextInput style={[styles.input, isDark ? styles.inputDark : styles.inputLight]} value={startTime} onChangeText={setStartTime} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Selesai</Text>
              <TextInput style={[styles.input, isDark ? styles.inputDark : styles.inputLight]} value={endTime} onChangeText={setEndTime} />
            </View>
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleBookRoom}>
            <Text style={styles.submitBtnText}>{t.submit || 'Konfirmasi Reservasi'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.sectionHeader}>Jadwal Rapat Terkonfirmasi</Text>
      {schedules.map((s) => (
        <View key={s.id} style={[styles.schedCard, isDark ? styles.cardDark : styles.cardLight]}>
          <Text style={[styles.schedTitle, isDark ? styles.textDark : styles.textLight]}>{s.title}</Text>
          <Text style={styles.schedRoom}>{s.room_name || 'Virtual Meeting'}</Text>
          <Text style={styles.schedTime}>{s.date} • {s.start_time} - {s.end_time} WIB</Text>
          {s.meeting_link && <Text style={styles.linkText}>🔗 {s.meeting_link}</Text>}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  content: { padding: 16, gap: 14 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  screenTitle: { fontSize: 18, fontWeight: '900' },
  addBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  addBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  card: { borderRadius: 20, padding: 16, borderWidth: 1 },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  cardTitle: { fontSize: 15, fontWeight: '800', marginBottom: 8 },
  label: { fontSize: 12, fontWeight: '700', color: '#94a3b8', marginTop: 8, marginBottom: 4 },
  input: { borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13 },
  inputDark: { backgroundColor: '#020617', color: '#ffffff' },
  inputLight: { backgroundColor: '#f1f5f9', color: '#0f172a' },
  roomPill: { borderRadius: 10, padding: 10, marginBottom: 6, borderWidth: 1 },
  roomPillDark: { backgroundColor: '#020617', borderColor: '#334155' },
  roomPillLight: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  roomPillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  roomPillText: { fontSize: 12, fontWeight: '700' },
  textWhite: { color: '#ffffff' },
  submitBtn: { backgroundColor: '#2563eb', borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 14 },
  submitBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 13 },
  sectionHeader: { fontSize: 14, fontWeight: '800', color: '#64748b', marginTop: 8 },
  schedCard: { borderRadius: 18, padding: 14, borderWidth: 1 },
  schedTitle: { fontSize: 14, fontWeight: '800' },
  schedRoom: { fontSize: 12, color: '#2563eb', fontWeight: '700', marginTop: 2 },
  schedTime: { fontSize: 11, color: '#94a3b8', marginTop: 4 },
  linkText: { fontSize: 11, color: '#38bdf8', marginTop: 6, fontWeight: '600' }
});
