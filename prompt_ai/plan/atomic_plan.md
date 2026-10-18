# 📋 ATOMIC EXECUTION PLAN: PORTAL CATATAN GANGGUAN TI (SI-GATI)
**Sistem Informasi Gangguan & Insiden Layanan Teknologi Informasi SPBE**

Dokumen ini memuat panduan eksekusi bertahap (*Atomic Execution Plan*) untuk pengembangan website **Catatan Gangguan TI (SI-GATI)** berbasis **Next.js 16 (App Router)**, **React 19**, **TypeScript (Strict Mode)**, **Tailwind CSS v4**, dan **INA Digital Design System (IDDS)**.

---

## 🏛️ 1. Identity & Architectural Principles

- **Nama Aplikasi:** SI-GATI (Sistem Informasi Gangguan Layanan TI)
- **Brand Subtitle:** Portal Pemantauan & Pencatatan Gangguan Infrastruktur dan Aplikasi SPBE
- **Prinsip Frontend-Backend:**
  - Frontend **DILARANG KERAS** menyentuh layer database/storage secara langsung.
  - Komunikasi data dilakukan 100% melalui **REST API JSON** (`/api/incidents`, `/api/incidents/[id]`, `/api/incidents/stats`).
  - Arsitektur REST API ini siap dikonsumsi langsung oleh Web App maupun Mobile App (Android Jetpack Compose).
- **Standar Desain:** Komponen resmi **INA Digital Design System (IDDS)** (`@idds/react` dan `@idds/styles`).
- **Aksesibilitas & Kualitas:** WCAG 2.1 AA, Mobile-First, Server Components default, Strict TypeScript, Tanpa suppress warning.

---

## 🚀 2. Breakdown Atomic Phases

### 🔹 Fase 1: Fondasi, Desain Sistem & Pembersihan (Design System & Housekeeping)
- [ ] **Task 1.1: Pembersihan Rute Demo**
  - Hapus direktori `src/app/demo-encryption/` sesuai instruksi wajib `GUIDELINE.md` aturan 13.13 agar tidak mengotori build produksi.
  - Hapus referensi demo page dari `src/app/page.tsx`.
- [ ] **Task 1.2: Konfigurasi Design System di `globals.css`**
  - Impor token IDDS (`@idds/react/index.css`, `@idds/styles/tailwind/css/idds.css`, `@idds/styles/tailwind/css/inagov.css`).
  - Konfigurasi variabel tema IDDS (brand `inagov`, banner merah nasional `#BE0000`, warna semantik `content-*`, `background-*`, `stroke-*`, `danger-*`, `warning-*`, `success-*`, `guide-*`).
  - Pastikan kompatibilitas Dark Mode (`.dark` selector di Tailwind v4).
- [ ] **Task 1.3: Lokalisasi & Metadata Terstandar**
  - Perbarui `src/dictionaries/id.json` dan `src/dictionaries/en.json` dengan kamus lengkap terminologi gangguan TI (tiket, status, urgensi, dampak, waktu pemulihan, validasi form).
  - Perbarui Web App Manifest (`src/app/manifest.ts`) dan SEO JSON-LD untuk SI-GATI.

---

### 🔹 Fase 2: Backend Architecture & REST API Endpoints (Pemisahan Total)
- [ ] **Task 2.1: Domain Models & TypeScript Contracts**
  - Buat `src/types/incident.ts` dengan interface data gangguan:
    - `id`: string (UUID)
    - `ticketNumber`: string unik (`INC-YYYYMMDD-XXXX`)
    - `title`: string (ringkasan gangguan)
    - `description`: string (detail kronologi)
    - `category`: union (`Jaringan`, `Server & Cloud`, `Aplikasi Web`, `Database`, `Keamanan Siber`, `Perangkat Keras`)
    - `severity`: union (`Rendah`, `Sedang`, `Tinggi`, `Kritis`)
    - `status`: union (`TERLAPOR`, `DIINVESTIGASI`, `DITANGANI`, `SELESAI`, `DITUTUP`)
    - `reporterName`: string (nama pelapor)
    - `reporterAgency`: string (nama unit kerja / instansi)
    - `affectedService`: string (nama layanan/sistem terdampak)
    - `downtimeMinutes`: number (>= 0)
    - `reportedAt`: string (ISO datetime)
    - `resolvedAt`: string | null (ISO datetime)
    - `resolutionNotes`: string | null
- [ ] **Task 2.2: Backend Validation Engine**
  - Buat `src/lib/incidents/validation.ts` untuk memvalidasi:
    - Field wajib tidak boleh kosong (title, description, category, severity, reporterName, reporterAgency, affectedService).
    - Unik ticket number.
    - Format tanggal valid ISO 8601.
    - `downtimeMinutes` berupa angka dan `>= 0`.
    - Nilai category, severity, dan status berada dalam enum yang valid.
    - Return payload error standar `{ success: false, errors: Record<string, string> }`.
- [ ] **Task 2.3: Data Persistence Store & 20 Data Dummy Awal**
  - Buat `src/lib/incidents/store.ts` sebagai data engine persisten dengan seed 20 data insiden riil layanan SPBE (SIASN, SP4N Lapor, Portal Satu Data, Server Cloud PDNS, dll).
- [ ] **Task 2.4: Implementasi Route Handlers REST API**
  - `GET /api/incidents`: Query parameters (`search`, `category`, `status`, `severity`, `page`, `limit`).
  - `POST /api/incidents`: Validasi input, persistensi data baru, return status `201 Created` atau `400 Bad Request`.
  - `GET /api/incidents/[id]`: Ambil detail satu insiden berdasarkan ID atau ticket number.
  - `PUT /api/incidents/[id]`: Perbarui data insiden / status penanganan dengan validasi penuh.
  - `DELETE /api/incidents/[id]`: Hapus insiden dengan return response status `200`.
  - `GET /api/incidents/stats`: Ringkasan metrik KPI (Total Insiden, Kritis Aktif, Sedang Ditangani, Selesai, Rata-rata Pemulihan).
- [ ] **Task 2.5: REST API Client Abstraction**
  - Buat `src/lib/api-client.ts` untuk konsumsi data dari Frontend melalui `fetch` standar REST JSON.

---

### 🔹 Fase 3: Shared Components & IDDS Integration
- [ ] **Task 3.1: Banner Nasional & Header SPBE**
  - Buat `src/app/_components/spbe-banner.tsx`: Pita merah `#BE0000` resmi "INA DIGITAL | Sistem Pemerintahan Berbasis Elektronik (SPBE)".
  - Buat `src/app/_components/spbe-header.tsx`: Navbar responsif dengan logo Garuda/INAgov, navigasi utama (Dasbor, Pelaporan, Lacak Tiket, Katalog Layanan), status konektivitas, dan drawer menu mobile.
- [ ] **Task 3.2: Footer Terstandar SPBE**
  - Buat `src/app/_components/spbe-footer.tsx`: Informasi legalitas SPBE, kontak penanganan darurat CSIRT/NOC, dan atribusi resmi.
- [ ] **Task 3.3: Komponen Status & Feedback IDDS**
  - Buat `src/app/_components/incident-badge.tsx`: Mapping badge resmi IDDS untuk Status (`Badge`) dan Urgensi.
  - Buat `src/app/_components/stat-card.tsx`: Kartu metrik berlatar `bg-background-secondary` dengan indikator tren.
  - Buat `src/app/_components/empty-state.tsx`: Tampilan data kosong dengan ikon dan instruksi solutif.
  - Buat `src/app/_components/loading-state.tsx`: Skeleton loading terstruktur.

---

### 🔹 Fase 4: Halaman Utama & Fitur Interaktif (CRUD Prepared & Full UI)
- [ ] **Task 4.1: Dasbor Utama (`src/app/page.tsx`)**
  - **Banner & Ringkasan KPI**: 4 metrik utama (Total Insiden, Kritis, Sedang Ditangani, Tingkat Penyelesaian).
  - **Tabel Pemantauan Gangguan**: Menampilkan daftar insiden dengan pencarian real-time, filter kategori, filter urgensi, filter status, dan pagination.
  - **Modal Detail Gangguan**: Menampilkan timeline kejadian, dampak layanan, unit pelapor, dan catatan resolusi teknis.
  - **Modal Lapor Gangguan Baru**: Form pelaporan lengkap (menggunakan komponen `@idds/react`: `TextField`, `TextArea`, `SelectDropdown`, `Button`) dengan validasi real-time dan pesan error dari backend.
  - **Dialog Konfirmasi Hapus**: Dialog konfirmasi sebelum penghapusan data dengan proteksi ketidaksengajaan.
- [ ] **Task 4.2: Halaman Lacak Gangguan (`src/app/lacak/page.tsx`)**
  - Fitur pencarian cepat nomor tiket untuk pengecekan progres oleh unit kerja pelapor.
- [ ] **Task 4.3: Halaman Katalog Layanan Terpantau (`src/app/layanan/page.tsx`)**
  - Informasi daftar layanan SPBE yang dipantau (Sistem Kepegawaian, Jaringan Intra Pemerintah, Cloud PDN, Pusat Data).

---

### 🔹 Fase 5: Polish, Transisi, Aksesibilitas & Responsivitas
- [ ] **Task 5.1: Dark Mode & Kontras Warna**
  - Verifikasi seluruh komponen di tema Terang dan Gelap memenuhi rasio kontras 4.5:1.
- [ ] **Task 5.2: Dukungan Keyboard & Screen Reader**
  - Navigasi tab, focus ring terlihat jelas, dan atribut ARIA pada modal dan dialog.
- [ ] **Task 5.3: Responsivitas Mobile**
  - Viewport mobile (< 640px) beralih dari tabel lebar menjadi Card View yang mudah dibaca dengan target sentuh minimal 44x44px.

---

### 🔹 Fase 6: Quality Gate & Verifikasi Produksi
- [ ] **Task 6.1: Validasi Linting** (`bun run lint` tanpa error dan tanpa warning).
- [ ] **Task 6.2: Validasi Build Produksi** (`bun run build` sukses 100% dan PWA Serwist terbundel rapi).
- [ ] **Task 6.3: Uji REST API Endpoints** (verifikasi respon JSON untuk `GET`, `POST`, `PUT`, `DELETE`, `stats`).
