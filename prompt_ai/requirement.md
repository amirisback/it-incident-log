## 🧠 Context

- **Nama Website** Diserahkan ke Ai
- **Objective:** Membangun website **Catatan Gangguan TI** Proyek Aplikasi CRUD Untuk Mencatat Gangguan TI
- **Project Base:** Repository ini (`Init-nextjs-app`) — sudah ter-setup dengan Next.js 16, Tailwind CSS v4, TypeScript strict, Serwist PWA
- **Target Audience:** Dewasa
- **Tujuan Bisnis:** Menjangkau pasar, memperkenalkan produk dan brand, memudahkan pelanggan melakukan pemesanan.

## 📋 Requirements

### Fitur Utama

- Pisahkan FrontEnd dan Backend
- Backend membuat fungsi REST API Json, jadi sewaktu waktu bisa di akses untuk mobile apps
- Frontend harus clear di larang langsung akses Database, harus lewat backend berupa REST API Json
- Validasi backend: field wajib, unik, format tanggal valid, angka >=0, kategori/status valid. Munculkan error di form.
- UI responsif (desktop & mobile).
- Feedback state lengkap: loading, berhasil, gagal, data kosong. Input berlabel, tombol dukung navigasi keyboard.

### Fitur Hold

Beberapa fitur di bawah ini jangan di kerjakan dulu tapi menunggu perintah selanjutnya cuman persiapkan saja structurnya.

- Tampilkan list (20 data) dan halaman/modal detail.
- Tambah, ubah, dan hapus data (wajib ada konfirmasi dialog sebelum hapus; data persisten).

### Desain & UI

- **Style:** Komponen INA Digital Design System (IDDS) (design.inadigital.go.id). Wajib pakai komponen UI IDDS (bukan hanya logo/warna).
- **Color Palette:** Serahkan ke AI sesuaikan dengan Thema Website
- **Typography:** [Gunakan Geist (sudah setup) / font lain dari Google Fonts]
- **Layout:** Mobile-first, responsive
- **Dark Mode:** Wajib support

### Referensi Web
