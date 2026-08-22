import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/useAuthStore";
import { useHRStore } from "../../stores/useHRStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";

interface HeaderProps {
  activeTab?: string;
  onOpenNotif: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = "home",
  onOpenNotif,
}) => {
  const { user } = useAuthStore();
  const { notifications } = useHRStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLanguage, t } = useLanguageStore();

  const isDark = theme === "dark";
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getScreenTitleInfo = () => {
    switch (activeTab) {
      case "attendance":
        return { title: "Presensi Geofence", icon: "navigation" as const };
      case "leave":
        return { title: "Pengajuan Cuti", icon: "calendar" as const };
      case "approval":
        return { title: "Persetujuan Cuti HR", icon: "check-square" as const };
      case "profile":
        return { title: "Profil Saya", icon: "user" as const };
      case "home":
      default:
        return null;
    }
  };

  const titleInfo = getScreenTitleInfo();

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      {activeTab === "home" || !titleInfo ? (
        /* Welcome Header ONLY for Beranda (Home) */
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name?.substring(0, 1) || "U"}
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.welcomeText,
                isDark ? styles.textSubDark : styles.textSubLight,
              ]}
            >
              {t.welcome}
            </Text>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <Text
                style={[
                  styles.nameText,
                  isDark ? styles.textDark : styles.textLight,
                ]}
              >
                {user?.name || "Karyawan BlueHR"}
              </Text>
              {/* <View style={styles.nipBadge}>
                <Text style={styles.nipBadgeText}>
                  {String(user?.id || 1).padStart(4, "0")}
                </Text>
              </View> */}
            </View>
          </View>
        </View>
      ) : (
        /* Clean Dedicated Screen Title for Other Tabs */
        <View style={styles.titleRow}>
          <View style={styles.titleIconBox}>
            <Feather name={titleInfo.icon} size={18} color="#2563eb" />
          </View>
          <Text
            style={[
              styles.screenTitleText,
              isDark ? styles.textDark : styles.textLight,
            ]}
          >
            {titleInfo.title}
          </Text>
        </View>
      )}

      <View style={styles.controlsRow}>
        {/* Language Toggle */}
        <TouchableOpacity
          onPress={toggleLanguage}
          style={[styles.iconBtn, isDark ? styles.btnDark : styles.btnLight]}
        >
          <Text style={styles.langText}>{lang}</Text>
        </TouchableOpacity>

        {/* Theme Toggle */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconBtn, isDark ? styles.btnDark : styles.btnLight]}
        >
          <Feather
            name={isDark ? "sun" : "moon"}
            size={16}
            color={isDark ? "#fbbf24" : "#475569"}
          />
        </TouchableOpacity>

        {/* Notification Bell */}
        <TouchableOpacity
          onPress={onOpenNotif}
          style={[styles.iconBtn, isDark ? styles.btnDark : styles.btnLight]}
        >
          <Feather
            name="bell"
            size={16}
            color={isDark ? "#f8fafc" : "#475569"}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(226, 232, 240, 0.6)",
  },
  bgDark: { backgroundColor: "#0f172a", borderBottomColor: "#1e293b" },
  bgLight: { backgroundColor: "#ffffff" },
  userRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#ffffff", fontWeight: "800", fontSize: 16 },
  welcomeText: { fontSize: 11, fontWeight: "500" },
  nameText: { fontSize: 15, fontWeight: "800" },
  nipBadge: {
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  nipBadgeText: { color: "#2563eb", fontSize: 9, fontWeight: "900" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  titleIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(37, 99, 235, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  screenTitleText: { fontSize: 16, fontWeight: "800" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  textSubDark: { color: "#94a3b8" },
  textSubLight: { color: "#64748b" },
  controlsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  btnDark: { backgroundColor: "#1e293b" },
  btnLight: { backgroundColor: "#f1f5f9" },
  langText: { fontSize: 11, fontWeight: "800", color: "#2563eb" },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#ef4444",
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#ffffff", fontSize: 9, fontWeight: "900" },
});
