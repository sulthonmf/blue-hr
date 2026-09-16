import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../stores/useAuthStore";
import { useHRStore } from "../stores/useHRStore";
import { useThemeStore } from "../stores/useThemeStore";
import { useLanguageStore } from "../stores/useLanguageStore";
import { PasswordStrengthChecklist } from "../components/modules/PasswordStrengthChecklist";
import { PayslipModal } from "../components/modules/PayslipModal";
import { apiClient } from "../api/client";

export const ProfileScreen: React.FC<{
  onOpenAvatarUploadModal: () => void;
  onNavigate?: (tab: string) => void;
}> = ({ onOpenAvatarUploadModal, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { lang, toggleLanguage, t } = useLanguageStore();

  const { requestResignation } = useHRStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isResignModalOpen, setIsResignModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [resignReason, setResignReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword)
      return Alert.alert("Peringatan", "Password baru harus diisi");
    setLoading(true);
    try {
      await apiClient.post("/auth/change-password", { newPassword });
      Alert.alert("Sukses", "Password Anda berhasil diperbarui!");
      setIsPasswordModalOpen(false);
      setNewPassword("");
    } catch (err: any) {
      Alert.alert("Gagal", err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResignSubmit = async () => {
    if (!resignReason)
      return Alert.alert("Peringatan", "Alasan resign harus diisi");
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const effective = new Date(Date.now() + 30 * 86400000)
        .toISOString()
        .split("T")[0];
      await requestResignation({
        reason: resignReason,
        notice_date: today,
        effective_date: effective,
        exit_clearance_notes: "Pengembalian Laptop & Akses",
      });
      Alert.alert(
        "Sukses",
        "Pengajuan resign & exit clearance berhasil dikirim ke HR",
      );
      setIsResignModalOpen(false);
      setResignReason("");
    } catch (err: any) {
      Alert.alert("Gagal", err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

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
            Cabang: {user?.branch_name || "Kantor Pusat Jakarta"}
          </Text>
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
          <Feather name="briefcase" size={16} color="#2563eb" />
          <View>
            <Text style={styles.infoLabel}>Cabang Penempatan</Text>
            <Text
              style={[
                styles.infoVal,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {user?.branch_name || "Kantor Pusat Jakarta"}
            </Text>
          </View>
        </View>
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

        {onNavigate && (
          <TouchableOpacity
            style={styles.menuRow}
            onPress={() => onNavigate("digitalId")}
          >
            <View style={styles.menuLeft}>
              <Feather name="credit-card" size={18} color="#0284c7" />
              <Text
                style={[
                  styles.menuText,
                  isDark ? styles.textDark : styles.textLight,
                ]}
              >
                {t.digitalId || "Digital ID Card"}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setIsPayslipModalOpen(true)}
        >
          <View style={styles.menuLeft}>
            <Feather name="file-text" size={18} color="#2563eb" />
            <Text
              style={[
                styles.menuText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {t.viewPayslipPdf}
            </Text>
          </View>
          <Feather name="download" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() =>
            Alert.alert(
              "2FA Security",
              "Autentikasi Dua Langkah (2FA) telah diaktifkan.",
            )
          }
        >
          <View style={styles.menuLeft}>
            <Feather name="shield" size={18} color="#059669" />
            <Text
              style={[
                styles.menuText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {t.enable2fa}
            </Text>
          </View>
          <Feather name="check-circle" size={16} color="#059669" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRow} onPress={toggleTheme}>
          <View style={styles.menuLeft}>
            <Feather
              name={isDark ? "sun" : "moon"}
              size={18}
              color={isDark ? "#f59e0b" : "#64748b"}
            />
            <Text
              style={[
                styles.menuText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {t.themeMode}: {isDark ? t.dark : t.light}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setIsPasswordModalOpen(true)}
        >
          <View style={styles.menuLeft}>
            <Feather name="lock" size={18} color="#2563eb" />
            <Text
              style={[
                styles.menuText,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              {t.securityChangePassword || "Keamanan: Ganti Password"}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setIsResignModalOpen(true)}
        >
          <View style={styles.menuLeft}>
            <Feather name="log-out" size={18} color="#f43f5e" />
            <Text style={[styles.menuText, { color: "#f43f5e" }]}>
              {t.offboarding || "Offboarding: Pengajuan Resign"}
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
              {t.languageSetting || "Bahasa / Language"} ({lang})
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

      {/* Password Change Modal with Realtime Checklist */}
      <Modal visible={isPasswordModalOpen} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={[
              { padding: 20, borderRadius: 54, borderWidth: 1 },
              isDark ? styles.cardDark : styles.cardLight,
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={[
                  { fontSize: 14, fontWeight: "900" },
                  isDark ? styles.textDark : styles.textLight,
                ]}
              >
                Ganti Password Akun
              </Text>
              <TouchableOpacity onPress={() => setIsPasswordModalOpen(false)}>
                <Feather name="x" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 10, color: "#94a3b8", marginBottom: 10 }}>
              Masukkan kata sandi baru yang memenuhi kriteria standar keamanan
              perusahaan.
            </Text>

            <TextInput
              secureTextEntry
              placeholder="Masukkan password baru..."
              placeholderTextColor="#94a3b8"
              value={newPassword}
              onChangeText={setNewPassword}
              style={{
                borderWidth: 1,
                borderColor: isDark ? "#334155" : "#cbd5e1",
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                color: isDark ? "#ffffff" : "#0f172a",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                fontSize: 12,
                marginBottom: 8,
              }}
            />

            <PasswordStrengthChecklist password={newPassword} isDark={isDark} />

            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                onPress={() => setIsPasswordModalOpen(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#cbd5e1",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "800", color: "#64748b" }}
                >
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handlePasswordChange}
                disabled={loading}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: "#2563eb",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "900", color: "#ffffff" }}
                >
                  {loading ? "Simpan..." : "Simpan Password"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Resignation / Offboarding Request Modal */}
      <Modal visible={isResignModalOpen} animationType="slide" transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.75)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={[
              { padding: 20, borderRadius: 54, borderWidth: 1 },
              isDark ? styles.cardDark : styles.cardLight,
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text
                style={[{ fontSize: 14, fontWeight: "900", color: "#f43f5e" }]}
              >
                Pengajuan Resign Karyawan
              </Text>
              <TouchableOpacity onPress={() => setIsResignModalOpen(false)}>
                <Feather name="x" size={20} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 10, color: "#94a3b8", marginBottom: 10 }}>
              Sampaikan alasan pengajuan resign Anda ke Tim HR (Pemberitahuan 1
              Bulan / 1 Month Notice).
            </Text>

            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Alasan pengajuan resign..."
              placeholderTextColor="#94a3b8"
              value={resignReason}
              onChangeText={setResignReason}
              style={{
                borderWidth: 1,
                borderColor: isDark ? "#334155" : "#cbd5e1",
                backgroundColor: isDark ? "#020617" : "#f8fafc",
                color: isDark ? "#ffffff" : "#0f172a",
                paddingHorizontal: 12,
                paddingVertical: 10,
                borderRadius: 12,
                fontSize: 12,
                marginBottom: 14,
              }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setIsResignModalOpen(false)}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: "#cbd5e1",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "800", color: "#64748b" }}
                >
                  Batal
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleResignSubmit}
                disabled={loading}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: "#f43f5e",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "900", color: "#ffffff" }}
                >
                  {loading ? "Kirim..." : "Kirim Resign"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payslip PDF View / Download Modal */}
      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
      />
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
    borderRadius: 5,
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
    borderRadius: 54,
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
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  logoutBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 14 },
});
