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

export const HelpdeskScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [tickets, setTickets] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("PAYROLL");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await apiClient.get("/tickets");
      setTickets(res.data || []);
    } catch {
      setTickets([
        {
          id: 1,
          subject: "Pertanyaan Potongan PPh21 Slip Gaji",
          category: "PAYROLL",
          status: "OPEN",
          created_at: "2026-08-22",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async () => {
    if (!subject || !message) {
      Alert.alert("Perhatian", "Mohon isi subjek dan keluhan.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/tickets", {
        subject,
        category,
        message,
      });
      Alert.alert("Sukses", "Tiket bantuan HR berhasil dibuat.");
      setSubject("");
      setMessage("");
      fetchTickets();
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
          {t.helpdeskTitle || "Bantuan & Tiket HR"}
        </Text>

        <Text style={styles.label}>Subjek Kendala</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={subject}
          onChangeText={setSubject}
          placeholder="Kendala slip gaji / BPJS..."
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>Rincian Kendala / Pertanyaan</Text>
        <TextInput
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            { height: 80 },
          ]}
          multiline
          value={message}
          onChangeText={setMessage}
          placeholder="Jelaskan secara singkat..."
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
              : "Buat Tiket Bantuan"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.sectionHeader,
          isDark ? styles.textDark : styles.textLight,
        ]}
      >
        Tiket Bantuan Saya
      </Text>
      {tickets.map((item) => (
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
              {item.subject}
            </Text>
            <Text style={styles.historySubtitle}>
              {item.category} • {item.created_at}
            </Text>
          </View>
          <Text
            style={[
              styles.statusBadge,
              item.status === "OPEN" ? styles.statusOpen : styles.statusClosed,
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
  statusOpen: { backgroundColor: "#dbeafe", color: "#1e40af" },
  statusClosed: { backgroundColor: "#f3f4f6", color: "#374151" },
});
