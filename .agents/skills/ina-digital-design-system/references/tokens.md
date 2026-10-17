# IDDS Design Tokens Reference

Panduan lengkap token warna, tipografi, tema instansi (brand theme), dan konfigurasi Tailwind CSS untuk INA Digital Design System (IDDS).

---

## 1. Brand Theme & Mode Tampilan

IDDS mendukung multi-brand untuk berbagai kementerian dan lembaga negara:

| Brand Code | Instansi / Entitas | Karakteristik Utama | Primary Tone |
|------------|-------------------|---------------------|--------------|
| `'inagov'` | Layanan Aparatur Negara / INAgov | Biru Nasional Gov | `INAgov/500` |
| `'panrb'`  | Kementerian PAN-RB | Merah KemenPAN-RB | `PANRB/600` |
| `'bkn'`    | Badan Kepegawaian Negara | Magenta BKN | `BKN/400` |
| `'lan'`    | Lembaga Administrasi Negara | Navy LAN | `LAN/500` |
| `'bgn'`    | Badan Gizi Nasional | Hijau/Kuning Gizi | `BGN` |
| `'default'`| INA Digital Default | Merah Merdeka | Red Primary |

### Pengaturan Tema di Kode (React)
```javascript
import { setBrandTheme, setThemeMode, getThemeMode, toggleThemeMode } from '@idds/react';

// Atur tema instansi (panggil sekali saat bootstrap aplikasi, misal di main.jsx)
setBrandTheme('inagov'); // 'inagov' | 'panrb' | 'bkn' | 'lan' | 'bgn' | 'default'

// Atur mode tampilan (light/dark)
setThemeMode('light'); // atau 'dark'
const current = getThemeMode(); // 'light' | 'dark'
toggleThemeMode(); // Beralih otomatis antara light dan dark
```

---

## 2. Token Warna (Tailwind Utility Classes)

### Warna Konten (Teks & Ikon)
- `text-content-primary`: Teks judul, label utama, dan konten prioritas tinggi (hitam pekat/slate gelap di light mode, putih di dark mode).
- `text-content-secondary`: Teks deskripsi, petunjuk form, metadata pendukung.
- `text-content-tertiary`: Placeholder input, timestamp, teks non-kritis.
- `text-content-disabled`: Teks tombol/input nonaktif.

### Warna Latar (Background)
- `bg-background-primary`: Latar belakang kanvas utama halaman (putih di light mode, slate gelap di dark mode).
- `bg-background-secondary`: Latar belakang kartu (Card), sidebar, panel sekunder.
- `bg-background-tertiary`: Latar belakang hover state, badge latar netral, dialog drawer.

### Garis & Batas (Stroke/Border)
- `border-stroke-primary`: Garis pemisah komponen utama, border input normal, batas kartu.
- `border-stroke-secondary`: Garis pemisah halus (divider horizontal/vertical).

### Status & Semantik
- **Positif (Success)**: Keberhasilan transaksi, status terverifikasi, dokumen disetujui.
  - Background: `bg-success-50`, `bg-success-100`, `bg-success-500`
  - Text: `text-success-700`, `text-success-600`
  - Border: `border-success-200`, `border-success-500`
- **Negatif (Error/Destructive)**: Aksi hapus, validasi gagal, penolakan izin, kegagalan sistem.
  - Background: `bg-danger-50`, `bg-danger-100`, `bg-danger-500`
  - Text: `text-danger-700`, `text-danger-600`
  - Border: `border-danger-200`, `border-danger-500`
- **Panduan (Info)**: Informasi edukasi pemohon, pengumuman regulasi, status pengajuan berjalan.
  - Background: `bg-guide-50`, `bg-guide-100`, `bg-guide-500`
  - Text: `text-guide-700`, `text-guide-600`
  - Border: `border-guide-200`, `border-guide-500`
- **Peringatan (Warning)**: Masa berlaku dokumen mendekati habis, butuh tindakan pengguna.
  - Background: `bg-warning-50`, `bg-warning-100`, `bg-warning-500`
  - Text: `text-warning-700`, `text-warning-800`
  - Border: `border-warning-200`, `border-warning-500`

### Aturan Penggunaan Warna
1. Gunakan warna dari keluarga (*color family*) yang sama untuk pasangan teks dan ikon.
2. Gunakan warna solid untuk tipografi. **Dilarang** memakai gradasi (*gradient*) pada teks judul maupun paragraf karena melanggar standar aksesibilitas keterbacaan SPBE.

---

## 3. Tipografi

IDDS menetapkan jenis huruf utama:
- **`Inter`**: Font antarmuka digital utama (navigasi, form, tabel, konten umum).
- **`Peruri Sans`**: Font khusus identitas logo dan headline institusi pemerintah resmi.

### Skala Hierarki Tipografi
| Taraf / Tingkat | Font Size | Line Height | Weight | Rekomendasi Penggunaan |
|-----------------|-----------|-------------|--------|------------------------|
| **Heading H1**  | 48px      | 56px        | Bold (700) | Judul utama beranda, hero title |
| **Heading H2**  | 40px      | 48px        | Bold (700) | Judul halaman modul, section besar |
| **Heading H3**  | 32px      | 40px        | Bold (700) | Judul sub-modul, modal header |
| **Heading H4**  | 28px      | 36px        | Bold (700) | Judul kartu data, drawer header |
| **Heading H5**  | 24px      | 32px        | Bold (700) | Label kategori, widget title |
| **Body Large**  | 20px      | 28px        | Regular (400) | Lead paragraph, intro ringkasan |
| **Body**        | 18px      | 26px        | Regular (400) | Konten utama artikel, instruksi detail |
| **Body Small**  | 16px      | 24px        | Regular (400) | Teks default form input, tabel, tombol |
| **Caption**     | 14px      | 20px        | Regular (400) | Helper text, breadcrumb, subtitle |
| **Caption Sm**  | 12px      | 16px        | Regular (400) | Badge teks, timestamp, hint singkat |
| **Caption XS**  | 10px      | 12px        | Regular (400) | Label micro metadata |

### Standar Kapitalisasi
1. **Title Case (Kapital Awal Kata)**:
   - Digunakan untuk: Judul halaman ("Formulir Permohonan Layanan"), nama modul/fitur ("Manajemen Akun ASN").
2. **Sentence Case (Kapital Awal Kalimat)**:
   - Digunakan untuk: Label tombol ("Simpan perubahan", "Kirim dokumen"), deskripsi formulir, pesan alert, judul kolom tabel.
3. **All Caps (Semua Huruf Kapital)**:
   - **HANYA** untuk singkatan atau akronim resmi negara (NIK, NIP, KTP, SKCK, BKN, SPBE, ASN). Hindari pemakaian All Caps untuk kata umum.

---

## 4. Konfigurasi Tailwind CSS

### Tailwind CSS v4 (Rekomendasi Modern)
Dalam file `src/index.css` atau `src/main.css`:
```css
/* Tailwind CSS v4 */
@import 'tailwindcss';

/* Import token warna dan brand IDDS */
@import '@idds/styles/tailwind/css/idds.css';
@import '@idds/styles/tailwind/css/inagov.css'; /* Atau: panrb.css, bkn.css, lan.css */
```

### Tailwind CSS v3
Dalam file `tailwind.config.js`:
```javascript
import { iddsColorToken, inagovTokens } from '@idds/react';

/** @type {import('tailwindcss').Config} */
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
