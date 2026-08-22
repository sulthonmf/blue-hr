import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../stores/useAuthStore";
import { useThemeStore } from "../stores/useThemeStore";
import { useLanguageStore } from "../stores/useLanguageStore";

export const ProfileScreen: React.FC<{
  onOpenAvatarUploadModal: () => void;
}> = ({ onOpenAvatarUploadModal }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLanguage, t } = useLanguageStore();

  const isDark = theme === "dark";

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}
      contentContainerStyle={styles.content}
    >
      {/* Profile Card with Photo Upload */}
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <View style={styles.avatarWrapper}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user?.name?.substring(0, 1) || "U"}
              </Text>
            </View>
          )}

          {/* Camera Upload Badge */}
          <TouchableOpacity
            onPress={onOpenAvatarUploadModal}
            style={styles.cameraBadge}
          >
            <Feather name="camera" size={12} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.name, isDark ? styles.textDark : styles.textLight]}
        >
          {user?.name || "Karyawan BlueHR"}
        </Text>
        <Text
          style={{
            fontSize: 11,
            fontWeight: "800",
            color: "#2563eb",
            marginTop: 2,
            marginBottom: 2,
          }}
        >
          NIP / Employee ID: EMP-{String(user?.id || 1).padStart(4, "0")}
        </Text>
        <Text style={styles.email}>{user?.email || "user@company.com"}</Text>

        {/* Structure Hierarchy Badges */}
        <View style={styles.pillRow}>
          <View style={styles.pill}>
            <Text style={styles.pillText}>{user?.position || "Employee"}</Text>
          </View>
          <View style={styles.pill}>
            <Text style={styles.pillText}>
              {user?.department || "Dept Engineering"}
            </Text>
          </View>
        </View>

        <View style={styles.orgDetailBox}>
          <Text style={styles.orgDetailText}>
            {user?.directorate || "Direktorat Utama"}
          </Text>
          <Text style={styles.orgDetailText}>
            {user?.division || "Divisi Teknologi & Informasi"}
          </Text>
        </View>
      </View>

      {/* Emergency Contact & Profile Details Card */}
      <View
        style={[
          styles.menuSection,
          isDark ? styles.cardDark : styles.cardLight,
        ]}
      >
        <Text
          style={[
            styles.menuTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}
        >
          Kontak & Informasi Darurat
        </Text>
        <View style={styles.infoRow}>
          <Feather name="phone-call" size={16} color="#2563eb" />
          <View>
            <Text style={styles.infoLabel}>No. Telepon / WhatsApp</Text>
            <Text
              style={[
                styles.infoVal,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {user?.phone || "+628123456789"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Feather name="map-pin" size={16} color="#2563eb" />
          <View>
            <Text style={styles.infoLabel}>Alamat Domisili</Text>
            <Text
              style={[
                styles.infoVal,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {user?.address || "Jl. Jend. Sudirman No. 45, Jakarta Pusat"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <Feather name="alert-circle" size={16} color="#f43f5e" />
          <View>
            <Text style={styles.infoLabel}>Kontak Darurat</Text>
            <Text
              style={[
                styles.infoVal,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {user?.emergency_contact_name || "Budi Santoso"} (
              {user?.emergency_contact_relation || "Keluarga"}) •{" "}
              {user?.emergency_contact_phone || "+628198765432"}
            </Text>
          </View>
        </View>
      </View>

      {/* Preferences Settings */}
      <View
        style={[
          styles.menuSection,
          isDark ? styles.cardDark : styles.cardLight,
        ]}
      >
        <Text
          style={[
            styles.menuTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}
        >
          Pengaturan Aplikasi
        </Text>

        <TouchableOpacity onPress={toggleTheme} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Feather name={isDark ? "sun" : "moon"} size={18} color="#2563eb" />
            <Text
              style={[
                styles.menuText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              Tema Tampilan ({theme === "dark" ? "Gelap" : "Terang"})
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleLanguage} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Feather name="globe" size={18} color="#2563eb" />
            <Text
              style={[
                styles.menuText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              Bahasa / Language ({lang})
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Logout Action */}
      <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
        <Feather name="log-out" size={18} color="#ffffff" />
        <Text style={styles.logoutBtnText}>{t.logout}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  bgDark: { backgroundColor: "#0f172a" },
  bgLight: { backgroundColor: "#f8fafc" },
  cardDark: { backgroundColor: "#1e293b", borderColor: "#334155" },
  cardLight: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
  card: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 16,
  },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatarImg: { width: 68, height: 68, borderRadius: 34 },
  avatarPlaceholder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 26, fontWeight: "900", color: "#ffffff" },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  name: { fontSize: 18, fontWeight: "900" },
  email: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  uploadPhotoBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    backgroundColor: "rgba(37, 99, 235, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  uploadPhotoText: { color: "#2563eb", fontSize: 11, fontWeight: "800" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  pillRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  pill: {
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pillText: { color: "#2563eb", fontSize: 11, fontWeight: "800" },
  orgDetailBox: { marginTop: 10, alignItems: "center", gap: 2 },
  orgDetailText: { fontSize: 10, color: "#94a3b8", fontWeight: "600" },
  menuSection: {
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
  },
  menuTitle: { fontSize: 13, fontWeight: "800", marginBottom: 12 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoLabel: { fontSize: 9, color: "#94a3b8", fontWeight: "700" },
  infoVal: { fontSize: 12, fontWeight: "800", marginTop: 1 },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(148, 163, 184, 0.1)",
  },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  menuText: { fontSize: 13, fontWeight: "700" },
  logoutBtn: {
    backgroundColor: "#f43f5e",
    paddingVertical: 14,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logoutBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 14 },
});
