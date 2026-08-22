import React, { useState } from "react";
import { useHRStore } from "../../stores/useHRStore";
import { useLanguageStore } from "../../stores/useLanguageStore";
import {
  Navigation,
  AlertTriangle,
  CheckCircle,
  Crosshair,
} from "lucide-react";

export const LocationSimulator: React.FC = () => {
  const { simulatedDistanceKm, setSimulatedLocation, settings } = useHRStore();
  const { t } = useLanguageStore();
  const maxDistance = parseFloat(settings.max_distance_km || "5.0");
  const isAllowed = simulatedDistanceKm <= maxDistance;

  const [isRealGPS, setIsRealGPS] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
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
    setGpsError(null);

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const officeLat = parseFloat(settings.office_lat || "-6.2088");
          const officeLng = parseFloat(settings.office_lng || "106.8456");
          const distKm = calculateHaversineDistance(
            latitude,
            longitude,
            officeLat,
            officeLng,
          );

          setSimulatedLocation(latitude, longitude, distKm);
          setIsRealGPS(true);
          setGpsLoading(false);
        },
        (error) => {
          setGpsLoading(false);
          setGpsError(
            "Gagal mengambil GPS: " +
              error.message +
              " (Menggunakan lokasi kantor)",
          );
          // Fallback to office location (0.0 km) if geolocation denied or unavailable
          setSimulatedLocation(-6.2088, 106.8456, 0.0);
          setIsRealGPS(true);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    } else {
      setGpsLoading(false);
      setGpsError("Browser Anda tidak mendukung HTML5 Geolocation.");
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsRealGPS(false);
    const dist = parseFloat(e.target.value);
    const latOffset = dist / 111.0;
    const newLat = -6.2088 - latOffset;
    const newLng = 106.8456 + (dist / 111.0) * 0.5;
    setSimulatedLocation(newLat, newLng, dist);
  };

  return (
    <div className="p-4 md:p-5 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm mb-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#2563eb] border border-blue-100 dark:border-blue-900/50">
            <Navigation size={18} />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display flex items-center gap-2">
              {t.geofenceStatusTitle || "Status Geofence Absensi GPS"}
              {isRealGPS && (
                <span className="px-2 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-950 text-[#2563eb] dark:text-blue-400 rounded-full font-extrabold">
                  {t.gpsRealActive || "GPS Real Device Active"}
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {t.geofenceStatusSub || "Deteksi lokasi asli device atau gunakan penguji radius geofence"}
            </p>
          </div>
        </div>

        <div
          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border shrink-0 ${
            isAllowed
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400"
              : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400"
          }`}
        >
          {isAllowed ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
          {isAllowed
            ? `${t.withinRadius} (${simulatedDistanceKm.toFixed(1)} km)`
            : `${t.outRadius.split("(")[0].trim()} (${simulatedDistanceKm.toFixed(1)} km > ${maxDistance} km)`}
        </div>
      </div>

      {gpsError && (
        <div className="mb-3 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-[11px] rounded-xl font-medium">
          {gpsError}
        </div>
      )}

      {/* Button Row: Real GPS vs Test Mode */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <button
          type="button"
          onClick={handleFetchRealDeviceGPS}
          disabled={gpsLoading}
          className="px-3.5 py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
        >
          <Crosshair size={14} />
          {gpsLoading ? (t.fetchingGPS || "Mengambil GPS...") : (t.detectRealGPSBtn || "Deteksi GPS Real Device")}
        </button>

        <span className="text-[11px] font-semibold text-slate-400">
          {t.testingSimulatorMode || "atau Mode Testing Simulator:"}
        </span>

        <button
          type="button"
          onClick={() => {
            setIsRealGPS(false);
            setSimulatedLocation(
              -6.2088 - 1.2 / 111.0,
              106.8456 + 0.6 / 111.0,
              1.2,
            );
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
            !isRealGPS && simulatedDistanceKm === 1.2
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          {t.simInBounds || "Testing: Dalam Radius (1.2 km)"}
        </button>

        <button
          type="button"
          onClick={() => {
            setIsRealGPS(false);
            setSimulatedLocation(
              -6.2088 - 6.5 / 111.0,
              106.8456 + 3.25 / 111.0,
              6.5,
            );
          }}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
            !isRealGPS && simulatedDistanceKm === 6.5
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
          }`}
        >
          {t.simOutOfBounds || "Testing: Di Luar Radius (6.5 km)"}
        </button>
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>
            {t.distFromOffice}{" "}
            <strong className="text-slate-900 dark:text-white">
              {simulatedDistanceKm.toFixed(1)} km
            </strong>
          </span>
          <span className="text-slate-400">
            {t.maxRadius} {maxDistance} km
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="12"
          step="0.5"
          value={simulatedDistanceKm}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#2563eb]"
        />
        <div className="flex justify-between text-[10px] text-slate-400 font-mono">
          <span>0.0 km ({t.atOffice})</span>
          <span>5.0 km ({t.atBound})</span>
          <span>12.0 km ({t.outRange})</span>
        </div>
      </div>
    </div>
  );
};
