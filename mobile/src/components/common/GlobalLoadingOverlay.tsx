import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native';
import { useHRStore } from '../../stores/useHRStore';
import { useThemeStore } from '../../stores/useThemeStore';

export const GlobalLoadingOverlay: React.FC = () => {
  const { isLoading, loadingMessage } = useHRStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!isLoading) return null;

  return (
    <Modal transparent animationType="fade" visible={isLoading}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={[styles.text, isDark ? styles.textDark : styles.textLight]}>
            {loadingMessage || 'Memuat...'}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    minWidth: 180
  },
  cardDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1
  },
  cardLight: {
    backgroundColor: '#ffffff'
  },
  text: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '700'
  },
  textDark: {
    color: '#f8fafc'
  },
  textLight: {
    color: '#0f172a'
  }
});
