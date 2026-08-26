import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';

export const EmployeesScreen: React.FC = () => {
  const { employees = [], teamMembers = [] } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');

  const isDark = theme === 'dark';

  const rawList = employees && employees.length > 0 ? employees : teamMembers;
  const empList = Array.isArray(rawList) ? rawList : [];

  const departments = ['ALL', ...Array.from(new Set(empList.map((e) => e?.department).filter(Boolean)))];

  const filtered = empList.filter((emp) => {
    if (!emp) return false;
    const matchSearch =
      (emp.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.position || '').toLowerCase().includes(search.toLowerCase()) ||
      (emp.department || '').toLowerCase().includes(search.toLowerCase());
    const matchDept = filterDept === 'ALL' || emp.department === filterDept;
    return matchSearch && matchDept;
  });

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      {/* Header Info */}
      <View style={styles.headerBox}>
        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
          {t.employees || 'Direktori Karyawan'}
        </Text>
        <Text style={styles.subtitle}>
          Total {empList.length} Karyawan Terdaftar Perusahaan
        </Text>
      </View>

      {/* Search & Filter Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, isDark ? styles.cardDark : styles.cardLight]}>
          <Feather name="search" size={16} color="#94a3b8" />
          <TextInput
            placeholder="Cari nama, email, jabatan..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
            style={[styles.searchInput, isDark ? styles.textDark : styles.textLight]}
          />
        </View>
      </View>

      {/* Department Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4, gap: 8, alignItems: 'center' }}>
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept}
            onPress={() => setFilterDept(dept)}
            style={[
              styles.deptPill,
              filterDept === dept ? styles.deptPillActive : (isDark ? styles.cardDark : styles.cardLight)
            ]}
          >
            <Text style={[styles.deptPillText, filterDept === dept ? styles.textWhite : (isDark ? styles.textDark : styles.textLight)]}>
              {dept === 'ALL' ? 'Semua Dept' : dept}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Employee List */}
      <ScrollView contentContainerStyle={styles.listContent}>
        {filtered.length === 0 ? (
          <View style={styles.emptyBox}>
            <Feather name="users" size={32} color="#94a3b8" />
            <Text style={styles.emptyText}>Tidak ada karyawan ditemukan</Text>
          </View>
        ) : (
          filtered.map((emp) => (
            <View key={emp.id} style={[styles.empCard, isDark ? styles.cardDark : styles.cardLight]}>
              <View style={styles.empRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarChar}>{emp.name?.substring(0, 1) || 'K'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.empName, isDark ? styles.textDark : styles.textLight]}>{emp.name}</Text>
                  <Text style={styles.empPos}>{emp.position} • <Text style={{ color: '#2563eb', fontWeight: '800' }}>{emp.department}</Text></Text>
                  <Text style={styles.empEmail}>{emp.email}</Text>
                </View>
                <View style={[styles.statusPill, emp.status === 'ACTIVE' ? styles.statusActive : styles.statusInactive]}>
                  <Text style={styles.statusText}>{emp.status || 'ACTIVE'}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  textWhite: { color: '#ffffff' },

  headerBox: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 18, fontWeight: '900' },
  subtitle: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  searchContainer: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 16, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 12 },

  deptScroll: { marginBottom: 10, flexGrow: 0 },
  deptPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center', minHeight: 34 },
  deptPillActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  deptPillText: { fontSize: 11, fontWeight: '800', lineHeight: 15 },

  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 10 },
  empCard: { padding: 14, borderRadius: 20, borderWidth: 1 },
  empRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarCircle: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center' },
  avatarChar: { color: '#ffffff', fontWeight: '900', fontSize: 16 },
  empName: { fontSize: 13, fontWeight: '800' },
  empPos: { fontSize: 11, color: '#64748b', marginTop: 1 },
  empEmail: { fontSize: 10, color: '#94a3b8', marginTop: 2 },
  statusPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  statusActive: { backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  statusInactive: { backgroundColor: 'rgba(244, 63, 94, 0.15)' },
  statusText: { fontSize: 9, fontWeight: '900', color: '#16a3a4' },

  emptyBox: { padding: 40, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 12, color: '#94a3b8', marginTop: 8 }
});
