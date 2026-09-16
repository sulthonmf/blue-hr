import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useHRStore } from "../../stores/useHRStore";
import { useThemeStore } from "../../stores/useThemeStore";
import { useLanguageStore } from "../../stores/useLanguageStore";

export const LocationSimulator: React.FC = () => {
  const { simulatedDistanceKm, setSimulatedDistance, settings } = useHRStore();
  const { theme } = useThemeStore();
  const { t } = useLanguageStore();
  const isDark = theme === "dark";

  const maxDistance = parseFloat(settings?.max_distance_km || "5.0");
  const inRadius = simulatedDistanceKm <= maxDistance;

  const [isRealGPS, setIsRealGPS] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);

  // Haversine formula for real GPS distance calculation
  const calculateHaversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Number((R * c).toFixed(2));
  };

  const handleFetchRealDeviceGPS = () => {
    setGpsLoading(true);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const officeLat = parseFloat(settings?.office_lat || "-6.2088");
          const officeLng = parseFloat(settings?.office_lng || "106.8456");
          const distKm = calculateHaversineDistance(
            latitude,
            longitude,
            officeLat,
            officeLng,
          );

          setSimulatedDistance(distKm);
          setIsRealGPS(true);
          setGpsLoading(false);
        },
        (error) => {
          setGpsLoading(false);
          // Fallback to office location (0.0 km) if device location fails or denied
          setSimulatedDistance(0.0);
          setIsRealGPS(true);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setGpsLoading(false);
      setSimulatedDistance(0.0);
      setIsRealGPS(true);
    }
  };

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Feather name="navigation" size={16} color="#2563eb" />
          <Text
            style={[styles.title, isDark ? styles.textDark : styles.textLight]}
          >
            {t.geofenceStatus}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            inRadius ? styles.badgeGreen : styles.badgeRose,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              inRadius ? styles.textGreen : styles.textRose,
            ]}
          >
            {inRadius ? t.inRadius : t.outRadius}
          </Text>
        </View>
      </View>

      <Text style={styles.distanceText}>
        {t.distanceFromOffice}:{" "}
        <Text style={{ fontWeight: "900", color: "#2563eb" }}>
          {simulatedDistanceKm.toFixed(1)} km
        </Text>
        {isRealGPS && (
          <Text style={styles.realTag}> (GPS Real Device Active)</Text>
        )}
      </Text>

      {/* Button: Real GPS Detection */}
      <TouchableOpacity
        onPress={handleFetchRealDeviceGPS}
        disabled={gpsLoading}
        style={styles.realGpsBtn}
      >
        {gpsLoading ? (
          <ActivityIndicator color="#ffffff" size="small" />
        ) : (
          <Feather name="crosshair" size={14} color="#ffffff" />
        )}
        <Text style={styles.realGpsBtnText}>
          {gpsLoading ? "Mengambil Lokasi..." : "Deteksi GPS Real Device"}
        </Text>
      </TouchableOpacity>

      <Text
        style={[styles.subLabel, isDark ? styles.textDark : styles.textLight]}
      >
        Atau Pilih Mode Testing Simulator:
      </Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={() => {
            setIsRealGPS(false);
            setSimulatedDistance(1.2);
          }}
          style={[
            styles.simBtn,
            !isRealGPS && simulatedDistanceKm === 1.2
              ? styles.activeSim
              : isDark
                ? styles.btnDark
                : styles.btnLight,
          ]}
        >
          <Text
            style={[
              styles.simBtnText,
              !isRealGPS && simulatedDistanceKm === 1.2
                ? styles.activeSimText
                : isDark
                  ? styles.textSubDark
                  : styles.textSubLight,
            ]}
          >
            Testing: Dalam Radius (1.2 km)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setIsRealGPS(false);
            setSimulatedDistance(6.5);
          }}
          style={[
            styles.simBtn,
            !isRealGPS && simulatedDistanceKm === 6.5
              ? styles.activeSim
              : isDark
                ? styles.btnDark
                : styles.btnLight,
          ]}
        >
          <Text
            style={[
              styles.simBtnText,
              !isRealGPS && simulatedDistanceKm === 6.5
                ? styles.activeSimText
                : isDark
                  ? styles.textSubDark
                  : styles.textSubLight,
            ]}
          >
            Testing: Di Luar Radius (6.5 km)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 5,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardDark: { backgroundColor: "#0f172a", borderColor: "#1e293b" },
  cardLight: { backgroundColor: "#ffffff", borderColor: "#e2e8f0" },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  title: { fontSize: 13, fontWeight: "800" },
  textDark: { color: "#ffffff" },
  textLight: { color: "#0f172a" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 5 },
  badgeGreen: { backgroundColor: "rgba(107, 203, 119, 0.15)" },
  badgeRose: { backgroundColor: "rgba(244, 63, 94, 0.15)" },
  statusText: { fontSize: 10, fontWeight: "800" },
  textGreen: { color: "#22c55e" },
  textRose: { color: "#f43f5e" },
  distanceText: { fontSize: 11, color: "#94a3b8", marginBottom: 10 },
  distanceVal: { fontWeight: "800", color: "#2563eb" },
  realTag: { fontSize: 10, color: "#3b82f6", fontWeight: "700" },
  realGpsBtn: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  realGpsBtnText: { color: "#ffffff", fontWeight: "800", fontSize: 11 },
  subLabel: { fontSize: 10, fontWeight: "700", marginBottom: 8, opacity: 0.7 },
  buttonsRow: { flexDirection: "row", gap: 8 },
  simBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: "center",
  },
  btnDark: { backgroundColor: "#1e293b" },
  btnLight: { backgroundColor: "#f1f5f9" },
  activeSim: { backgroundColor: "#2563eb" },
  simBtnText: { fontSize: 10, fontWeight: "700" },
  activeSimText: { color: "#ffffff" },
  textSubDark: { color: "#cbd5e1" },
  textSubLight: { color: "#475569" },
});
