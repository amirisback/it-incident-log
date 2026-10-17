# IDDS Government Application Patterns (Pola Desain SPBE)

Panduan tata letak, pola interaksi standar, dan arsitektur antarmuka untuk aplikasi pemerintah berbasis INA Digital Design System.

---

## 1. Banner Nasional & Navbar Utama (Header Pola SPBE)

Setiap portal pemerintah terintegrasi dengan INA Digital wajib menyematkan identitas nasional di bagian paling atas (*Top Banner*), diikuti oleh logo instansi, pencarian global, pemilihan tema, dan profil pengguna.

```tsx
import { useState } from 'react';
import { Button, TextField, Avatar, BasicDropdown, toggleThemeMode } from '@idds/react';
import { IconSearch, IconBell, IconMoon, IconSun, IconChevronDown, IconLogout, IconUser } from '@tabler/icons-react';

export function GovernmentNavbar({ instansiName = 'Kementerian PAN-RB', userName = 'Budi Santoso' }) {
  const [search, setSearch] = useState('');

  return (
    <header className="w-full bg-background-primary border-b border-stroke-primary">
      {/* 1. Top Banner Identitas Resmi Republik Indonesia */}
      <div className="bg-[#BE0000] text-white px-6 py-1.5 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wider">INA DIGITAL</span>
          <span className="opacity-70">|</span>
          <span className="opacity-90">Sistem Pemerintahan Berbasis Elektronik (SPBE)</span>
        </div>
        <div className="hidden sm:block text-[11px] opacity-80">
          Situs Resmi Pemerintah Republik Indonesia
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Identitas Instansi */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-bold text-base text-content-primary leading-tight">{instansiName}</span>
            <span className="text-xs text-content-secondary">Republik Indonesia</span>
          </div>
        </div>

        {/* Global Searchbar */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <TextField
            placeholder="Cari layanan, regulasi, atau nomor tiket..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            prefixIcon={<IconSearch size={16} />}
          />
        </div>

        {/* Aksi & Profil Pengguna */}
        <div className="flex items-center gap-3">
          {/* Toggle Light / Dark Mode */}
          <button
            onClick={() => toggleThemeMode()}
            className="p-2 rounded-lg text-content-secondary hover:bg-background-secondary transition-colors"
            aria-label="Ubah mode tema"
          >
            <IconMoon size={20} />
          </button>

          {/* Notifikasi */}
          <button
            className="relative p-2 rounded-lg text-content-secondary hover:bg-background-secondary transition-colors"
            aria-label="Pemberitahuan"
          >
            <IconBell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          {/* User Profile Dropdown */}
          <BasicDropdown
            trigger={
              <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-background-secondary transition-colors">
                <Avatar name={userName} size="sm" />
                <span className="hidden lg:block text-sm font-medium text-content-primary">{userName}</span>
                <IconChevronDown size={14} className="text-content-secondary" />
              </button>
            }
            content={
              <div className="w-56 p-2 bg-background-primary rounded-xl shadow-lg border border-stroke-primary">
                <div className="px-3 py-2 border-b border-stroke-secondary mb-1">
                  <p className="text-xs text-content-secondary">Masuk sebagai</p>
                  <p className="text-sm font-semibold text-content-primary truncate">{userName}</p>
                  <p className="text-xs text-content-secondary">NIP. 198904122015031002</p>
                </div>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-content-primary rounded-lg hover:bg-background-secondary">
                  <IconUser size={16} /> Profil Saya
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger-600 rounded-lg hover:bg-danger-50">
                  <IconLogout size={16} /> Keluar
                </button>
              </div>
            }
          />
        </div>
      </nav>
    </header>
  );
}
```

---

## 2. Dashboard Layout (Sidebar & Main Panel)

Pola tata letak standar aplikasi operasional aparatur (back-office) dan dasbor pemantauan layanan publik.

```tsx
import { useState } from 'react';
import {
  IconLayoutDashboard,
  IconFileText,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconMenu2,
} from '@tabler/icons-react';

interface SidebarItem {
  key: string;
  label: string;
  icon: any;
  badgeCount?: number;
}

const menuItems: SidebarItem[] = [
  { key: 'dashboard', label: 'Ringkasan', icon: IconLayoutDashboard },
  { key: 'permohonan', label: 'Daftar Permohonan', icon: IconFileText, badgeCount: 5 },
  { key: 'pemohon', label: 'Data Pengguna', icon: IconUsers },
  { key: 'laporan', label: 'Laporan & Analitik', icon: IconChartBar },
  { key: 'pengaturan', label: 'Pengaturan Sistem', icon: IconSettings },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background-secondary">
      {/* Sidebar Panel */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-background-primary border-r border-stroke-primary transition-all duration-200 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-stroke-primary">
          {!isCollapsed && <span className="font-bold text-content-primary">Layanan ASN</span>}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-background-secondary text-content-secondary"
          >
            <IconMenu2 size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-content-secondary hover:bg-background-secondary hover:text-content-primary'
                }`}
              >
                <Icon size={20} />
                {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
                {!isCollapsed && item.badgeCount && (
                  <span className="bg-primary-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
```

---

## 3. Empty State (Kondisi Kosong Terstandar)

Pola ketika tabel data belum memiliki isi atau pencarian tidak menghasilkan data.

```tsx
import { Button } from '@idds/react';
import { IconFileSearch, IconPlus } from '@tabler/icons-react';

export function EmptyPermohonanState({ onAction }: { onAction: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-background-primary border border-dashed border-stroke-primary rounded-2xl text-center max-w-lg mx-auto my-8">
      <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 mb-4">
        <IconFileSearch size={32} />
      </div>
      <h3 className="text-xl font-bold text-content-primary mb-2">Belum Ada Permohonan Masuk</h3>
      <p className="text-sm text-content-secondary mb-6 leading-relaxed">
        Saat ini belum ada berkas permohonan baru yang perlu diverifikasi. Anda dapat membuat
        tiket manual jika ada pengajuan langsung di loket fisik.
      </p>
      <Button hierarchy="primary" size="md" prefixIcon={<IconPlus size={16} />} onClick={onAction}>
        Buat Permohonan Baru
      </Button>
    </div>
  );
}
```

---

## 4. Single Sign-On (SSO) & OTP Verification Pattern

Autentikasi standar portal digital pemerintah menggunakan verifikasi kode OTP atau Identitas Kependudukan Digital (IKD).

```tsx
import { useState, useRef } from 'react';
import { Button, Alert } from '@idds/react';

export function OtpVerificationSection({ phone = '0812****8899', onVerify }: { phone?: string; onVerify: (otp: string) => void }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newDigits = [...digits];
    newDigits[index] = val;
    setDigits(newDigits);

    // Auto focus next input
    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const fullOtp = digits.join('');

  return (
    <div className="max-w-md mx-auto p-6 bg-background-primary border border-stroke-primary rounded-2xl shadow-sm text-center">
      <h2 className="text-2xl font-bold text-content-primary mb-2">Verifikasi Keamanan (OTP)</h2>
      <p className="text-sm text-content-secondary mb-6">
        Masukkan 6 digit kode verifikasi yang telah dikirimkan ke nomor WhatsApp terdaftar{' '}
        <span className="font-semibold text-content-primary">{phone}</span>.
      </p>

      {/* 6 Digit Input Group */}
      <div className="flex justify-center gap-2 mb-6">
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-12 h-14 text-2xl font-bold text-center border-2 border-stroke-primary rounded-xl focus:border-primary-500 focus:outline-none bg-background-secondary"
          />
        ))}
      </div>

      <Button
        hierarchy="primary"
        size="lg"
        disabled={fullOtp.length !== 6}
        onClick={() => onVerify(fullOtp)}
        className="w-full justify-center"
      >
        Verifikasi & Lanjutkan
      </Button>

      <p className="text-xs text-content-secondary mt-4">
        Tidak menerima kode?{' '}
        <button className="text-primary-600 font-semibold hover:underline">
          Kirim Ulang (58s)
        </button>
      </p>
    </div>
  );
}
```
