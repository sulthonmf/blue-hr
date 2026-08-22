import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useHRStore } from '../../stores/useHRStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

export const ErrorPopupModal: React.FC = () => {
  const { errorMessage, setError } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === 'dark';

  if (!errorMessage) return null;

  return (
    <Modal transparent animationType="slide" visible={!!errorMessage}>
      <View style={styles.overlay}>
        <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
          <View style={styles.iconBox}>
            <Feather name="alert-triangle" size={24} color="#e11d48" />
          </View>
          <Text style={[styles.title, isDark ? styles.textDark : styles.textLight]}>
            {t.errorTitle}
          </Text>
          <Text style={styles.desc}>{errorMessage}</Text>
          
          <TouchableOpacity
            onPress={() => setError(null)}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{t.close}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  card: {
    width: '100%',
    maxWidth: 340,
    padding: 24,
    borderRadius: 28,
    alignItems: 'center',
    elevation: 10
  },
  cardDark: {
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1
  },
  cardLight: {
    backgroundColor: '#ffffff'
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(225, 29, 72, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6
  },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  desc: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20
  },
  button: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13
  }
});
