import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { useLanguageStore } from "../stores/useLanguageStore";
import { useThemeStore } from "../stores/useThemeStore";
import { apiClient } from "../api/client";

export const ShiftSwapScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [swaps, setSwaps] = useState<any[]>([]);
  const [targetUserId, setTargetUserId] = useState("");
  const [shiftDate, setShiftDate] = useState("2026-08-28");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSwaps = async () => {
    try {
      const res = await apiClient.get("/shifts/swap");
      setSwaps(res.data || []);
    } catch {
      setSwaps([
        {
          id: 1,
          target_user_name: "Budi Santoso",
          shift_date: "2026-08-28",
          status: "PENDING",
          reason: "Acara Keluarga",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleSubmit = async () => {
    if (!targetUserId || !reason) {
      Alert.alert(
        "Perhatian",
        "Mohon isi ID rekan kerja pengganti dan alasan.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/shifts/swap", {
        target_user_id: parseInt(targetUserId, 10),
        shift_date: shiftDate,
        reason,
      });
      Alert.alert("Sukses", "Pengajuan tukar shift berhasil dikirim.");
      setReason("");
      fetchSwaps();
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
        <Text
          style={[
            styles.cardTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}
        >
          {t.shiftSwap || "Tukar Shift"}
        </Text>

        <Text style={styles.label}>ID Rekan Pengganti (User ID)</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          keyboardType="numeric"
          value={targetUserId}
          onChangeText={setTargetUserId}
          placeholder="Contoh: 3"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Tanggal Shift Yang Ditukar</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={shiftDate}
          onChangeText={setShiftDate}
        />

        <Text style={styles.label}>Alasan Tukar Shift</Text>
        <TextInput
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            { height: 70 },
          ]}
          multiline
          value={reason}
          onChangeText={setReason}
          placeholder="Catatan keperluan..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting
              ? t.submitting || "Mengirim..."
              : "Kirim Permohonan Tukar Shift"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.sectionHeader,
          isDark ? styles.textDark : styles.textLight,
        ]}
      >
        Riwayat Permohonan Tukar Shift
      </Text>
      {swaps.map((item) => (
        <View
          key={item.id}
          style={[
            styles.historyCard,
            isDark ? styles.cardDark : styles.cardLight,
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.historyTitle,
                isDark ? styles.textDark : styles.textLight,
              ]}
            >
              Shift {item.shift_date} • Rekan:{" "}
              {item.target_user_name || item.target_user_id}
            </Text>
            <Text style={styles.historySubtitle}>{item.reason}</Text>
          </View>
          <Text
            style={[
              styles.statusBadge,
              item.status === "APPROVED"
                ? styles.statusApproved
                : styles.statusPending,
            ]}
          >
            {item.status}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bgDark: { backgroundColor: "#0f172a" },
  bgLight: { backgroundColor: "#f8fafc" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  content: { padding: 16, gap: 16 },
  card: { borderRadius: 50, padding: 16, borderWidth: 1 },
  cardDark: { backgroundColor: "#1e293b", borderColor: "#334155" },
  cardLight: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
  cardTitle: { fontSize: 16, fontWeight: "800", marginBottom: 12 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94a3b8",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },
  inputDark: { backgroundColor: "#020617", color: "#ffffff" },
  inputLight: { backgroundColor: "#f1f5f9", color: "#0f172a" },
  submitBtn: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 16,
  },
  submitBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 14 },
  sectionHeader: { fontSize: 14, fontWeight: "800", marginTop: 8 },
  historyCard: {
    borderRadius: 5,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },
  historyTitle: { fontSize: 13, fontWeight: "700" },
  historySubtitle: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  statusBadge: {
    fontSize: 10,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  statusApproved: { backgroundColor: "#dcfce7", color: "#166534" },
  statusPending: { backgroundColor: "#fef3c7", color: "#92400e" },
});
