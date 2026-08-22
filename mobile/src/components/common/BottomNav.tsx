import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { useThemeStore } from '../../stores/useThemeStore';
import { useLanguageStore } from '../../stores/useLanguageStore';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === 'dark';

  const isHR = user?.permissions?.includes('approve_leave') || user?.role_name === 'Admin' || user?.role_name === 'HR Manager';

  const tabs = [
    { key: 'home', label: t.home, icon: 'grid' },
    { key: 'attendance', label: t.attendance, icon: 'clock' },
    { key: 'leave', label: t.leave, icon: 'calendar' },
    ...(isHR ? [{ key: 'approval', label: 'Approval', icon: 'check-square' }] : []),
    { key: 'profile', label: t.profile, icon: 'user' }
  ];

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onSelectTab(tab.key)}
            style={[styles.tabItem, isActive && styles.activeTabItem]}
          >
            <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
              <Feather
                name={tab.icon as any}
                size={18}
                color={isActive ? '#ffffff' : isDark ? '#64748b' : '#94a3b8'}
              />
            </View>
            <Text
              style={[
                styles.tabLabel,
                isActive
                  ? styles.activeLabel
                  : isDark
                  ? styles.inactiveDark
                  : styles.inactiveLight
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  bgDark: { backgroundColor: '#0f172a', borderTopColor: '#1e293b' },
  bgLight: { backgroundColor: '#ffffff', borderTopColor: '#f1f5f9' },
  tabItem: { alignItems: 'center', justifyContent: 'center', flex: 1, height: '100%' },
  activeTabItem: {},
  iconWrapper: { padding: 4, borderRadius: 12 },
  activeIconWrapper: { backgroundColor: '#2563eb' },
  tabLabel: { fontSize: 10, fontWeight: '700', marginTop: 2 },
  activeLabel: { color: '#2563eb', fontWeight: '900' },
  inactiveDark: { color: '#64748b' },
  inactiveLight: { color: '#94a3b8' }
});
