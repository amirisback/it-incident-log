---
name: ina-digital-design-system
description: Use when building, designing, or refactoring digital government applications (SPBE) in Indonesia using INA Digital Design System (IDDS), including @idds/react, @idds/styles, Tailwind CSS tokens, Indonesian government brand themes (INAgov, PANRB, BKN, LAN, BGN), design tokens, components, and accessibility standards.
---

# INA Digital Design System (IDDS) Skill

Skill ini memandu pengembangan antarmuka aplikasi publik dan sistem internal pemerintahan Republik Indonesia berbasis standar resmi **INA Digital Design System (IDDS)**.

---

## 1. Kapan Menggunakan Skill Ini

Gunakan skill ini ketika:
1. Membangun aplikasi web pemerintah (SPBE - Sistem Pemerintahan Berbasis Elektronik).
2. Mengintegrasikan paket `@idds/react` dan `@idds/styles` ke dalam proyek React (Vite, Next.js, Remix, dsb.).
3. Menerapkan token desain (warna, tipografi `Inter`, grid `4px/8px`, elevasi, mode terang/gelap).
4. Mengkonfigurasi tema instansi/kementerian (`inagov`, `panrb`, `bkn`, `lan`, `bgn`, `default`).
5. Menyusun pola halaman standar SPBE (Header Nasional, Navbar, Dasbor Aparatur, Formulir Multi-Langkah, Tabel Data, Otentikasi OTP/SSO).

---

## 2. Persyaratan & Instalasi Cepat

### Prasyarat Proyek
- Node.js >= 16.x
- React >= 18.0.0 & React DOM >= 18.0.0
- Tailwind CSS (v4 atau v3)

### Perintah Instalasi
```bash
# Instal paket komponen IDDS resmi dan icon pendukung
npm install @idds/react @tabler/icons-react tailwindcss @tailwindcss/vite

# Jika menggunakan TypeScript, pastikan types terpasang
npm install -D @types/react @types/react-dom
```

---

## 3. Konfigurasi Entry Point & Tema

### 3.1 Impor CSS & Inisialisasi Tema (`src/main.jsx` atau `src/index.tsx`)
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 1. Wajib impor CSS IDDS sebelum styling lainnya
import '@idds/react/index.css';

// 2. Inisialisasi Brand Theme instansi & Mode Tampilan
import { setBrandTheme, setThemeMode } from '@idds/react';

// Brand theme: 'inagov' (Layanan Nasional) | 'panrb' | 'bkn' | 'lan' | 'bgn' | 'default'
setBrandTheme('inagov');

// Mode: 'light' (default) | 'dark'
setThemeMode('light');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3.2 Utilitas Pengubah Tema Dinamis
```tsx
import { setThemeMode, getThemeMode, toggleThemeMode, setBrandTheme } from '@idds/react';

// Beralih otomatis antara terang dan gelap (mengubah atribut data-theme di <html>)
toggleThemeMode();

// Ambil mode aktif saat ini
const currentMode = getThemeMode(); // 'light' | 'dark'

// Ganti identitas instansi secara dinamis
setBrandTheme('panrb');
```

---

## 4. Integrasi dengan Tailwind CSS

### 4.1 Tailwind CSS v4 (Rekomendasi Modern)
Tambahkan ke file CSS utama (`src/index.css`):
```css
@import "tailwindcss";

/* Impor token warna dasar IDDS & tema instansi */
@import "@idds/styles/tailwind/css/idds.css";
@import "@idds/styles/tailwind/css/inagov.css"; /* atau: panrb.css, bkn.css, lan.css */
```

### 4.2 Tailwind CSS v3
Tambahkan ke `tailwind.config.js`:
```javascript
import { iddsColorToken, inagovTokens } from '@idds/react';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ...iddsColorToken,
        ...inagovTokens,
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        peruri: ['Peruri Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

---

## 5. Ringkasan Token Desain IDDS

Detail token dapat dilihat pada [tokens.md](references/tokens.md).

### 5.1 Token Warna Utama
- **Teks/Konten**: `text-content-primary` (judul/utama), `text-content-secondary` (deskripsi/hint), `text-content-tertiary` (sub-info), `text-content-disabled`.
- **Latar (Background)**: `bg-background-primary` (kanvas utama), `bg-background-secondary` (kartu/sidebar), `bg-background-tertiary`.
- **Garis (Stroke/Border)**: `border-stroke-primary` (border kartu/input), `border-stroke-secondary` (garis pemisah halus).
- **Semantik Status**:
  - `success`: `bg-success-50`, `text-success-700`, `border-success-200` (Persetujuan, sukses).
  - `danger`: `bg-danger-50`, `text-danger-700`, `border-danger-200` (Penolakan, hapus, error).
  - `warning`: `bg-warning-50`, `text-warning-800`, `border-warning-200` (Perhatian, batas waktu).
  - `guide`: `bg-guide-50`, `text-guide-700`, `border-guide-200` (Informasi panduan).

### 5.2 Standar Tipografi
- **Font Face**: Wajib gunakan `Inter` untuk seluruh elemen UI teks. Font `Peruri Sans` hanya untuk display/logo institusi.
- **Skala Ukuran**:
  - `H1` (48px / 56px), `H2` (40px / 48px), `H3` (32px / 40px), `H4` (28px / 36px), `H5` (24px / 32px) - Semua Bold (700).
  - `Body Large` (20px / 28px), `Body` (18px / 26px), `Body Small` (16px / 24px) - Regular (400).
  - `Caption` (14px / 20px), `Caption Small` (12px / 16px), `Caption XS` (10px / 12px) - Regular (400).
- **Aturan Kapitalisasi**:
  - **Sentence Case**: Tombol, label input, dialog, teks pesan, judul kolom.
  - **Title Case**: Judul halaman utama, modul besar.
  - **All Caps**: Hanya singkatan resmi negara (NIK, NIP, SPBE, ASN, KTP).

---

## 6. Katalog Komponen & Pola Praktis

Detail lengkap props & kode per komponen ada di [components.md](references/components.md).

```tsx
import {
  Button,
  TextField,
  Modal,
  Alert,
  Card,
  Badge,
  Table,
  SelectDropdown,
  Stepper,
  type Column,
} from '@idds/react';
import { IconDownload, IconPlus, IconSearch } from '@tabler/icons-react';
```

### 6.1 Button Hierarchy Rule
- **Primary Button**: Hanya boleh ada **maksimal satu** tombol utama pada satu area fokus/dialog (contoh: "Kirim Permohonan").
- **Secondary Button**: Untuk tindakan alternatif (contoh: "Simpan Draf", "Unduh PDF").
- **Tertiary / Ghost**: Untuk pembatalan atau tindakan netral (contoh: "Batal", "Tutup").
- **Link**: Untuk navigasi ke halaman detail tanpa efek samping mutasi.

### 6.2 Pola Input Formulir yang Valid
```tsx
<TextField
  label="Nomor Induk Kependudukan (NIK)"
  placeholder="Masukkan 16 digit NIK"
  value={nik}
  onChange={(e) => setNik(e.target.value)}
  hint="Sesuai dengan e-KTP pemohon"
  error={nikError}
  required
/>
```

### 6.3 Pola Tabel Data SPBE
Gunakan konfigurasi kolom terstandar dengan render kustom untuk status badge dan tombol aksi (lihat [patterns.md](references/patterns.md)).

---

## 7. Pola Desain Antarmuka SPBE (Pola Desain)

Detail tata letak ada di [patterns.md](references/patterns.md):
1. **Banner Nasional & Top Navbar**:
   - Bar merah `#BE0000` di puncak halaman dengan tulisan "INA DIGITAL | Sistem Pemerintahan Berbasis Elektronik (SPBE)".
   - Navbar utama memuat identitas instansi resmi ("Republik Indonesia"), pencarian global, notifikasi, dan profil aparatur/warga.
2. **Dasbor Back-Office Aparatur**:
   - Tata letak Sidebar kolapsibel + Area konten utama berlatar `bg-background-secondary`.
   - Kartu metrik KPI (Total berkas, menanti verifikasi, selesai).
3. **Alur Pelayanan Multi-Tahap**:
   - Memakai `Stepper` (1. Identitas -> 2. Dokumen -> 3. Konfirmasi -> 4. Tanda Terima).
4. **Verifikasi Keamanan (OTP / SSO)**:
   - Formulir 6-digit OTP terpisah untuk autentikasi warga atau login ASN via INAgov SSO.
5. **Kondisi Kosong (Empty State)**:
   - Ilustrasi terpusat, penjelasan ramah, dan 1 tombol Call-to-Action utama.

---

## 8. Panduan Penulisan (UX Writing) & Aksesibilitas

1. **Bahasa Indonesia Baku & Jelas**:
   - Gunakan kata kerja imperatif yang spesifik: "Ajukan Permohonan" bukan "Submit", "Unduh Dokumen" bukan "Download", "Perbarui Profil" bukan "Update".
2. **Pesan Kesalahan Solutif**:
   - Jelaskan letak kesalahan dan langkah perbaikan (contoh: *"Format NIK tidak valid. Pastikan NIK terdiri dari 16 angka"*).
3. **Aksesibilitas (WCAG 2.1 AA)**:
   - Kontras warna teks minimal 4.5:1 terhadap latar.
   - Semua input wajib memiliki `<label>` yang terhubung.
   - Hindari tombol hanya berupa ikon tanpa atribut `aria-label`.
   - Dilarang keras memakai gradasi warna (*gradients*) pada teks tipografi.

---

## 9. Struktur Berkas Referensi Terkait

- **Design Tokens**: [references/tokens.md](references/tokens.md)
- **Komponen & Props API**: [references/components.md](references/components.md)
- **Pola Desain SPBE**: [references/patterns.md](references/patterns.md)
