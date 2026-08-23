import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../stores/useAuthStore';
import { useHRStore } from '../stores/useHRStore';
import { useThemeStore } from '../stores/useThemeStore';
import { useLanguageStore } from '../stores/useLanguageStore';
import { apiClient } from '../api/client';

export const LoginScreen: React.FC = () => {
  const { setAuth } = useAuthStore();
  const { setLoading, setError, fetchData } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();

  const isDark = theme === 'dark';

  const [email, setEmail] = useState('employee@bluehr.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Harap isi email dan password');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      setAuth(res.data.token, res.data.user);
      await fetchData();
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'Gagal login';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBox}>
            <Feather name="shield" size={24} color="#ffffff" />
          </View>
          <Text style={[styles.brandName, isDark ? styles.textDark : styles.textLight]}>
            BlueHR Mobile
          </Text>
          <Text style={styles.subText}>{t.loginSub || 'Enterprise HR Mobile Portal'}</Text>
        </View>

        <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
          {t.emailLabel}
        </Text>
        <TextInput
          placeholder={t.enterEmailPlaceholder || "user@company.com"}
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          autoCapitalize="none"
        />

        <Text style={[styles.label, isDark ? styles.textDark : styles.textLight]}>
          {t.passwordLabel}
        </Text>
        <TextInput
          placeholder="••••••••"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
        />

        <TouchableOpacity
          onPress={handleLogin}
          disabled={isSubmitting}
          style={styles.loginBtn}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.loginBtnText}>{t.loginBtn}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hintText}>
          Demo Email: employee@bluehr.com / password123
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  bgDark: { backgroundColor: '#0f172a' },
  bgLight: { backgroundColor: '#f8fafc' },
  card: { width: '100%', maxWidth: 360, padding: 24, borderRadius: 28, borderWidth: 1 },
  cardDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  cardLight: { backgroundColor: '#ffffff', borderColor: '#e2e8f0' },
  brandGroup: { alignItems: 'center', marginBottom: 24 },
  logoBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  brandName: { fontSize: 20, fontWeight: '900' },
  textDark: { color: '#ffffff' },
  textLight: { color: '#0f172a' },
  subText: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  label: { fontSize: 12, fontWeight: '700', marginBottom: 6, marginTop: 8 },
  input: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1, fontSize: 13, marginBottom: 10 },
  inputDark: { backgroundColor: '#0f172a', borderColor: '#334155', color: '#ffffff' },
  inputLight: { backgroundColor: '#f1f5f9', borderColor: '#cbd5e1', color: '#0f172a' },
  loginBtn: { backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 16, alignItems: 'center', marginTop: 16 },
  loginBtnText: { color: '#ffffff', fontWeight: '800', fontSize: 14 },
  hintText: { textAlign: 'center', fontSize: 10, color: '#94a3b8', marginTop: 16 }
});
