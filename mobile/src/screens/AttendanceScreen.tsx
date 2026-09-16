import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useHRStore } from "../stores/useHRStore";
import { useThemeStore } from "../stores/useThemeStore";
import { useLanguageStore } from "../stores/useLanguageStore";

export const AttendanceScreen: React.FC = () => {
  const { attendanceLogs } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();

  const isDark = theme === "dark";

  return (
    <ScrollView
      style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Feather name="clock" size={20} color="#2563eb" />
        <Text
          style={[styles.title, isDark ? styles.textDark : styles.textLight]}
        >
          Riwayat Presensi Karyawan
        </Text>
      </View>

      <View style={styles.offlineBanner}>
        <Feather name="wifi-off" size={14} color="#0284c7" />
        <Text style={styles.offlineText}>
          {t.offlineSync}: 0 {t.records} (Synced)
        </Text>
      </View>

      {attendanceLogs.length === 0 ? (
        <Text style={styles.empty}>Belum ada catatan presensi terdaftar.</Text>
      ) : (
        attendanceLogs.map((item) => (
          <View
            key={item.id}
            style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
          >
            <View style={styles.row}>
              <View style={styles.leftGroup}>
                <View style={styles.iconBox}>
                  <Feather name="map-pin" size={16} color="#2563eb" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.name,
                      isDark ? styles.textDark : styles.textLight,
                    ]}
                  >
                    {item.user_name || "Karyawan"}
                  </Text>
                  <Text style={styles.date}>{item.check_in}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.badge,
                  item.status === "ON_TIME" ? styles.bgGreen : styles.bgRose,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    item.status === "ON_TIME"
                      ? styles.textGreen
                      : styles.textRose,
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.distText}>
                Jarak: {item.distance_km ?? 1.2} km
              </Text>
              <Text style={styles.notesText}>
                {item.notes || "Validated Geofence"}
              </Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  bgDark: { backgroundColor: "#0f172a" },
  bgLight: { backgroundColor: "#f8fafc" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  title: { fontSize: 16, fontWeight: "800" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    marginVertical: 40,
  },
  card: { padding: 14, borderRadius: 50, marginBottom: 10, borderWidth: 1 },
  cardDark: { backgroundColor: "#1e293b", borderColor: "#334155" },
  cardLight: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftGroup: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  name: { fontSize: 13, fontWeight: "700" },
  date: { fontSize: 10, color: "#94a3b8" },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  bgGreen: { backgroundColor: "rgba(34, 197, 94, 0.15)" },
  bgRose: { backgroundColor: "rgba(244, 63, 94, 0.15)" },
  badgeText: { fontSize: 9, fontWeight: "800" },
  textGreen: { color: "#22c55e" },
  textRose: { color: "#f43f5e" },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.1)",
  },
  distText: { fontSize: 10, fontWeight: "700", color: "#2563eb" },
  notesText: { fontSize: 10, color: "#94a3b8" },
  offlineBanner: {
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  offlineText: { fontSize: 11, fontWeight: "700", color: "#0369a1" },
});
