# 📘 Dokumen Outline Proyek: BlueHR Enterprise Architecture & Specification

## 1. Ringkasan Eksekutif (Executive Summary)
BlueHR Enterprise adalah platform Human Resource Information System (HRIS) modern berbasis Web dan Mobile yang mengintegrasikan pengelolaan karyawan, presensi berbasis Geofencing GPS Real Device, otentikasi biometrik (FaceID / Sidik Jari), sistem pengajuan cuti bertingkat (Multi-Level Approval), hirarki struktur organisasi 4-tingkat, serta pelaporan unit test interaktif berbasis HTML.

---

## 2. Arsitektur Modul & Spesifikasi Teknis

### A. Backend Architecture (`backend/`)
- **Framework**: Node.js & Express.js dengan TypeScript.
- **Database**: SQLite3 relational database (`backend/blue_hr.db`).
- **Keamanan & Autentikasi**: JWT (JSON Web Token) dengan session persistence & RBAC (Role-Based Access Control) granular.
- **Service & Repository Pattern**:
  - `AuthService` & `UserRepository`: Otentikasi, enkripsi password bcryptjs, dan manajemen data karyawan.
  - `AttendanceService` & `AttendanceRepository`: Verifikasi Haversine Distance Geofencing GPS, pembatasan radius kantor, dan pencatatan status `ON_TIME`, `LATE`, `OUT_OF_BOUNDS`.
  - `LeaveService` & `LeaveRepository`: Alur persetujuan L1 Manager (`APPROVED_L1`) dan L2 Final HR (`APPROVED`).

### B. Web Dashboard Application (`web/`)
- **Framework**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons.
- **Fitur Utama**:
  - Dashboard statistik presensi & visualisasi jam kerja.
  - Manajemen data karyawan lengkap (NIP: `EMP-XXXX`, Kontak Darurat, Alamat Domisili, Upload Foto Avatar Local Device, Dropdown Direksi & Divisi).
  - Manajemen Pengumuman Perusahaan yang langsung tersiar ke aplikasi Mobile.

### C. Mobile Application (`mobile/`)
- **Framework**: React Native, Expo SDK 51, Feather Icons, Zustand State Store.
- **Fitur Utama**:
  - Presensi Geofencing GPS Real Device dengan visualisasi jarak radius kantor.
  - Verifikasi Otentikasi Biometrik (FaceID/Fingerprint) saat presensi.
  - Deteksi Keamanan Perangkat (Rooted Android / Jailbroken iOS).
  - Widget Dashboard: `AttendanceTimelineWidget`, `WorkingHoursBarChartCard`, `LeaveDonutSummaryCard`, `TravelOnDutyBanner`, dan `TeamMembersRibbon`.

---

## 3. Skema Database (Database Schema ERD)

### Tabel `users`
- `id` (INTEGER PRIMARY KEY)
- `name` (TEXT)
- `email` (TEXT UNIQUE)
- `position` (TEXT)
- `department` (TEXT)
- `division` (TEXT)
- `directorate` (TEXT)
- `address` (TEXT)
- `phone` (TEXT)
- `emergency_contact_name` (TEXT)
- `emergency_contact_phone` (TEXT)
- `emergency_contact_relation` (TEXT)
- `avatar` (TEXT)
- `leave_quota` (INTEGER DEFAULT 12)

### Tabel `attendance_records`
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER)
- `check_in` (DATETIME)
- `check_out` (DATETIME)
- `latitude` (REAL)
- `longitude` (REAL)
- `distance_km` (REAL)
- `status` (TEXT: `ON_TIME` | `LATE` | `OUT_OF_BOUNDS`)

### Tabel `leaves`
- `id` (INTEGER PRIMARY KEY)
- `user_id` (INTEGER)
- `leave_type` (TEXT)
- `start_date` (TEXT)
- `end_date` (TEXT)
- `duration_days` (INTEGER)
- `status` (TEXT: `PENDING` | `APPROVED_L1` | `APPROVED` | `REJECTED`)

---

## 4. Rincian Pengujian & Test Coverage

Semua modul dilengkapi dengan Unit Tests otomatis berbasis Vitest:
- **Backend API Unit Tests**: 20/20 Tests Passed (`leave_quota`, `geofencing`, `rbac`, `notification`).
- **Web App Unit Tests**: 2/2 Tests Passed (`useLanguageStore`).
- **Mobile App Unit Tests**: 4/4 Tests Passed (`mobileStore`).
- **HTML Report Generator**: Perintah `npm run test:report` menghasilkan visualisasi laporan test interaktif di browser.
