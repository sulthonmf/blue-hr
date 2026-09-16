import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useHRStore } from "../../stores/useHRStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<
  NotificationCenterModalProps
> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationsRead } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === "dark";

  if (!isOpen) return null;

  return (
    <Modal transparent animationType="fade" visible={isOpen}>
      <View style={styles.overlay}>
        <View
          style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}
        >
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Text
                style={[
                  styles.title,
                  isDark ? styles.textDark : styles.textLight,
                ]}
              >
                {t.notifications}
              </Text>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity onPress={markNotificationsRead}>
                <Text style={styles.markReadText}>{t.markAllRead}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={{ marginLeft: 12 }}>
                <Feather
                  name="x"
                  size={20}
                  color={isDark ? "#94a3b8" : "#64748b"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.listContainer}>
            {notifications.length === 0 ? (
              <Text style={styles.emptyText}>{t.noNotif}</Text>
            ) : (
              notifications.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.notifItem,
                    item.read
                      ? isDark
                        ? styles.readDark
                        : styles.readLight
                      : isDark
                        ? styles.unreadDark
                        : styles.unreadLight,
                  ]}
                >
                  <View style={styles.iconBox}>
                    <Feather
                      name={
                        item.type === "LEAVE"
                          ? "calendar"
                          : item.type === "ATTENDANCE"
                            ? "clock"
                            : "bell"
                      }
                      size={16}
                      color="#2563eb"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.notifTitle,
                        isDark ? styles.textDark : styles.textLight,
                      ]}
                    >
                      {item.title}
                    </Text>
                    <Text style={styles.notifDesc}>{item.desc}</Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
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
  card: { padding: 20, borderRadius: 5, maxHeight: 420 },
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
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 10,
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 15, fontWeight: "800" },
  actionsRow: { flexDirection: "row", alignItems: "center" },
  markReadText: { fontSize: 11, fontWeight: "700", color: "#2563eb" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  listContainer: { maxHeight: 320 },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: 12,
    marginVertical: 30,
  },
  notifItem: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 5,
    marginBottom: 8,
    borderWidth: 1,
  },
  unreadDark: {
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    borderColor: "#2563eb",
  },
  unreadLight: { backgroundColor: "#eff6ff", borderColor: "#bfdbfe" },
  readDark: {
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    opacity: 0.7,
  },
  readLight: {
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
    opacity: 0.7,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 5,
    backgroundColor: "rgba(37, 99, 235, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  notifTitle: { fontSize: 12, fontWeight: "700" },
  notifDesc: { fontSize: 10, color: "#94a3b8", marginTop: 2 },
});
