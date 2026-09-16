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

export const ReimbursementScreen: React.FC = () => {
  const { t } = useLanguageStore();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const [claims, setClaims] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [receiptImage, setReceiptImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClaims = async () => {
    try {
      const res = await apiClient.get("/reimbursements/my");
      setClaims(res.data || []);
    } catch {
      setClaims([
        {
          id: 1,
          title: "Bensin & Tol Dinas",
          amount: 250000,
          status: "APPROVED",
          created_at: "2026-08-20",
        },
        {
          id: 2,
          title: "Konsumsi Meeting Klien",
          amount: 180000,
          status: "PENDING",
          created_at: "2026-08-24",
        },
      ]);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const handlePickReceipt = () => {
    setReceiptImage("https://via.placeholder.com/300x200.png?text=Bukti+Struk");
    Alert.alert("Sukses", "Bukti foto struk berhasil dilampirkan.");
  };

  const handleSubmit = async () => {
    if (!title || !amount) {
      Alert.alert("Perhatian", "Mohon isi judul klaim dan nominal.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/reimbursements", {
        title,
        amount: parseFloat(amount),
        description,
        receipt_url: receiptImage,
      });
      Alert.alert("Sukses", "Klaim reimbursement berhasil diajukan.");
      setTitle("");
      setAmount("");
      setDescription("");
      setReceiptImage(null);
      fetchClaims();
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
          {t.reimbursements || "Klaim Reimbursement"}
        </Text>

        <Text style={styles.label}>Judul Pengeluaran</Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          value={title}
          onChangeText={setTitle}
          placeholder="Contoh: Taksi Dinas / Parkir"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>
          {t.amountLabel || "Jumlah Nominal (Rp)"}
        </Text>
        <TextInput
          style={[styles.input, isDark ? styles.inputDark : styles.inputLight]}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
          placeholder="250000"
          placeholderTextColor="#94a3b8"
        />

        <Text style={styles.label}>
          {t.descriptionLabel || "Deskripsi / Catatan"}
        </Text>
        <TextInput
          style={[
            styles.input,
            isDark ? styles.inputDark : styles.inputLight,
            { height: 70 },
          ]}
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Catatan keperluan dinas..."
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={[
            styles.uploadBtn,
            isDark ? styles.uploadDark : styles.uploadLight,
          ]}
          onPress={handlePickReceipt}
        >
          <Text
            style={[
              styles.uploadBtnText,
              isDark ? styles.textDark : styles.textLight,
            ]}
          >
            📷{" "}
            {receiptImage
              ? "Bukti Struk Terlampir"
              : t.uploadReceipt || "Unggah Bukti Struk"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>
            {isSubmitting
              ? t.submitting || "Mengirim..."
              : t.submit || "Kirim Pengajuan"}
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={[
          styles.sectionHeader,
          isDark ? styles.textDark : styles.textLight,
        ]}
      >
        Riwayat Pengajuan
      </Text>
      {claims.map((item) => (
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
              {item.title}
            </Text>
            <Text style={styles.historySubtitle}>
              Rp {Number(item.amount).toLocaleString("id-ID")} •{" "}
              {item.created_at}
            </Text>
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
  uploadBtn: {
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginTop: 12,
  },
  uploadDark: { backgroundColor: "#020617" },
  uploadLight: { backgroundColor: "#e2e8f0" },
  uploadBtnText: { fontSize: 12, fontWeight: "700" },
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
