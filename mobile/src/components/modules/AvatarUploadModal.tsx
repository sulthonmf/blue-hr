import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuthStore } from "../../stores/useAuthStore";
import { useHRStore } from "../../stores/useHRStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { apiClient } from "../../api/client";

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, setAuth, token } = useAuthStore();
  const { setLoading, setError } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === "dark";

  const avatarPresets = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  ];

  const [customUrl, setCustomUrl] = useState(user?.avatar || avatarPresets[0]);

  const handleSaveAvatar = async (selectedUrl: string) => {
    setLoading(true, "Updating Avatar...");
    try {
      await apiClient.patch("/auth/avatar", { avatar: selectedUrl });
      if (user && token) {
        setAuth(token, { ...user, avatar: selectedUrl });
      }
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePickLocalDevicePhoto = () => {
    // Pick a high-res sample avatar from local gallery simulation
    const sampleLocalPhotos = [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    ];
    const picked =
      sampleLocalPhotos[Math.floor(Math.random() * sampleLocalPhotos.length)];
    setCustomUrl(picked);
    handleSaveAvatar(picked);
  };

  if (!isOpen) return null;

  return (
    <Modal transparent animationType="slide" visible={isOpen}>
      <View style={styles.overlay}>
        <View
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
        >
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              Upload / Ganti Foto Profil Avatar
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather
                name="x"
                size={20}
                color={isDark ? "#94a3b8" : "#64748b"}
              />
            </TouchableOpacity>
          </View>

          {/* Device Upload Button */}
          <TouchableOpacity
            onPress={handlePickLocalDevicePhoto}
            style={styles.uploadDeviceBtn}
          >
            <Feather name="upload" size={16} color="#ffffff" />
            <Text style={styles.uploadDeviceBtnText}>
              Pilih Foto dari Device / Gallery
            </Text>
          </TouchableOpacity>

          <Text
            style={[
              styles.sub,
              isDark ? styles.textDark : styles.textLight,
              { marginTop: 14 },
            ]}
          >
            Atau Pilih Preset Avatar:
          </Text>
          <View style={styles.presetsRow}>
            {avatarPresets.map((url, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => {
                  setCustomUrl(url);
                  handleSaveAvatar(url);
                }}
                style={[
                  styles.presetCircle,
                  customUrl === url && styles.activePreset,
                ]}
              >
                <Image source={{ uri: url }} style={styles.presetImg} />
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={[
              styles.sub,
              isDark ? styles.textDark : styles.textLight,
              { marginTop: 12 },
            ]}
          >
            Atau Input URL Foto:
          </Text>
          <TextInput
            placeholder="https://..."
            placeholderTextColor="#94a3b8"
            value={customUrl}
            onChangeText={setCustomUrl}
            style={[
              styles.input,
              isDark ? styles.inputDark : styles.inputLight,
            ]}
          />

          <View style={styles.btnRow}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.btn, styles.btnCancel]}
            >
              <Text style={styles.btnCancelText}>{t.cancel}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleSaveAvatar(customUrl)}
              style={[styles.btn, styles.btnSubmit]}
            >
              <Text style={styles.btnSubmitText}>Simpan Foto</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    justifyContent: "center",
    padding: 20,
  },
  card: { padding: 24, borderRadius: 28 },
  cardDark: {
    backgroundColor: "#0f172a",
    borderColor: "#1e293b",
    borderWidth: 1,
  },
  cardLight: { backgroundColor: "#ffffff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: { fontSize: 15, fontWeight: "800" },
  sub: { fontSize: 12, fontWeight: "700", marginBottom: 8 },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  uploadDeviceBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  uploadDeviceBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 12 },
  presetsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 4,
  },
  presetCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 2,
  },
  activePreset: { borderColor: "#2563eb" },
  presetImg: { width: "100%", height: "100%", borderRadius: 25 },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    fontSize: 12,
    marginBottom: 16,
  },
  inputDark: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    color: "#ffffff",
  },
  inputLight: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    color: "#0f172a",
  },
  btnRow: { flexDirection: "row", gap: 10 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: "center" },
  btnCancel: { backgroundColor: "#94a3b8" },
  btnCancelText: { color: "#ffffff", fontWeight: "700", fontSize: 12 },
  btnSubmit: { backgroundColor: "#2563eb" },
  btnSubmitText: { color: "#ffffff", fontWeight: "800", fontSize: 12 },
});
