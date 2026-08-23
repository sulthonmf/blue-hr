import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';

export const OrgChartScreen: React.FC = () => {
  const { orgTree } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <ScrollView style={[styles.container, isDark ? styles.bgDark : styles.bgLight]} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Feather name="share-2" size={20} color="#2563eb" />
        <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>Struktur Organisasi (Org Chart)</Text>
      </View>

      <ScrollView horizontal contentContainerStyle={{ paddingVertical: 10, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', minWidth: 350 }}>
          {orgTree.length === 0 ? (
            <Text style={{ color: '#94a3b8', fontSize: 12 }}>Memuat pohon struktur organisasi...</Text>
          ) : (
            orgTree.map((root) => <TreeNode key={root.id} node={root} isDark={isDark} />)
          )}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const TreeNode: React.FC<{ node: any; isDark: boolean }> = ({ node, isDark }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={[styles.nodeBox, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{node.name ? node.name.substring(0, 1) : 'U'}</Text>
        </View>
        <Text style={[styles.nodeName, isDark ? styles.textDark : styles.textLight]}>{node.name}</Text>
        <Text style={styles.nodePos}>{node.position}</Text>
        <View style={styles.deptBadge}>
          <Text style={styles.deptText}>{node.department}</Text>
        </View>
      </View>

      {node.subordinates && node.subordinates.length > 0 && (
        <View style={{ alignItems: 'center', marginTop: 4 }}>
          <View style={styles.vLine} />
          <View style={styles.hLine} />
          <View style={{ flexDirection: 'row', gap: 16, paddingTop: 4 }}>
            {node.subordinates.map((sub: any) => (
              <TreeNode key={sub.id} node={sub} isDark={isDark} />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '900' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  nodeBox: { padding: 12, borderRadius: 18, borderWidth: 1, alignItems: 'center', minWidth: 160 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  avatarText: { color: '#ffffff', fontWeight: '900', fontSize: 14 },
  nodeName: { fontSize: 11, fontWeight: '800' },
  nodePos: { fontSize: 9, color: '#2563eb', fontWeight: '700', marginTop: 1 },
  deptBadge: { backgroundColor: 'rgba(37, 99, 235, 0.1)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  deptText: { fontSize: 8, fontWeight: '800', color: '#2563eb' },
  vLine: { width: 2, height: 16, backgroundColor: '#94a3b8' },
  hLine: { height: 2, backgroundColor: '#94a3b8', width: '80%' }
});
