import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface PasswordRulesStatus {
  minLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export function checkPasswordRules(password: string): PasswordRulesStatus {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  return {
    minLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial,
    isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
  };
}

export const PasswordStrengthChecklist: React.FC<{
  password: string;
  isDark?: boolean;
}> = ({ password, isDark = false }) => {
  const rules = checkPasswordRules(password);

  const ruleItems = [
    { label: "Minimal 8 karakter", met: rules.minLength },
    { label: "Minimal 1 huruf besar (A-Z)", met: rules.hasUpper },
    { label: "Minimal 1 huruf kecil (a-z)", met: rules.hasLower },
    { label: "Minimal 1 angka (0-9)", met: rules.hasNumber },
    { label: "Minimal 1 simbol (!@#$%)", met: rules.hasSpecial },
  ];

  return (
    <View style={[styles.container, isDark ? styles.bgDark : styles.bgLight]}>
      <View style={styles.headerRow}>
        <Feather
          name="shield"
          size={14}
          color={rules.isValid ? "#10b981" : "#f59e0b"}
        />
        <Text
          style={[
            styles.headerTitle,
            isDark ? styles.textDark : styles.textLight,
          ]}
        >
          Kriteria Keamanan Password
        </Text>
        <View
          style={[
            styles.badge,
            rules.isValid ? styles.badgeGreen : styles.badgeAmber,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              rules.isValid ? styles.badgeTextGreen : styles.badgeTextAmber,
            ]}
          >
            {rules.isValid ? "TERPENUHI" : "BELUM SESUAI"}
          </Text>
        </View>
      </View>

      {ruleItems.map((item, idx) => (
        <View key={idx} style={styles.itemRow}>
          <View
            style={[
              styles.iconCircle,
              item.met ? styles.iconCircleGreen : styles.iconCircleGrey,
            ]}
          >
            <Feather
              name={item.met ? "check" : "x"}
              size={10}
              color="#ffffff"
            />
          </View>
          <Text
            style={[
              styles.itemText,
              item.met ? styles.itemTextGreen : styles.itemTextGrey,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 5,
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 8,
  },
  bgDark: { backgroundColor: "#020617", borderColor: "#1e293b" },
  bgLight: { backgroundColor: "#f8fafc", borderColor: "#e2e8f0" },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 11, fontWeight: "800" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  badgeGreen: { backgroundColor: "rgba(16, 185, 129, 0.2)" },
  badgeAmber: { backgroundColor: "rgba(245, 158, 11, 0.2)" },
  badgeText: { fontSize: 8, fontWeight: "900" },
  badgeTextGreen: { color: "#10b981" },
  badgeTextAmber: { color: "#f59e0b" },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginVertical: 2,
  },
  iconCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircleGreen: { backgroundColor: "#10b981" },
  iconCircleGrey: { backgroundColor: "#94a3b8" },
  itemText: { fontSize: 10 },
  itemTextGreen: { color: "#10b981", fontWeight: "700" },
  itemTextGrey: { color: "#94a3b8" },
});
