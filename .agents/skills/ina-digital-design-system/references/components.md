# IDDS React Component API & Examples Reference

Katalog komponen resmi dari paket `@idds/react` beserta prop types, variant, dan contoh implementasi interaktif.

---

## 1. Button

Komponen interaktif untuk memicu aksi utama, sekunder, atau navigasi.

### Props:
- `hierarchy`: `'primary' | 'secondary' | 'tertiary' | 'link'` (Default: `'primary'`)
- `size`: `'sm' | 'md' | 'lg' | 'xl' | '2xl'` (Default: `'md'`)
- `prefixIcon`: `ReactNode` (Ikon di sisi kiri label)
- `suffixIcon`: `ReactNode` (Ikon di sisi kanan label)
- `disabled`: `boolean`
- `onClick`: `(e: React.MouseEvent) => void`
- `children`: `ReactNode`

### Contoh Penggunaan:
```tsx
import { Button } from '@idds/react';
import { IconDownload, IconArrowRight, IconTrash } from '@tabler/icons-react';

export function ButtonGroupExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Primary Action - Maksimal 1 per dialog/section */}
      <Button hierarchy="primary" size="md" prefixIcon={<IconDownload size={16} />}>
        Unduh Berkas
      </Button>

      {/* Secondary Action */}
      <Button hierarchy="secondary" size="md" suffixIcon={<IconArrowRight size={16} />}>
        Lanjutkan
      </Button>

      {/* Tertiary Action / Ghost */}
      <Button hierarchy="tertiary" size="md">
        Batal
      </Button>

      {/* Link Action */}
      <Button hierarchy="link" size="md">
        Pelajari Selengkapnya
      </Button>

      {/* Disabled State */}
      <Button hierarchy="primary" size="md" disabled>
        Memproses...
      </Button>
    </div>
  );
}
```

---

## 2. TextField (Text Input)

Field masukan data pengguna dengan dukungan label, helper text, error handling, dan ikon.

### Props:
- `label`: `string`
- `value`: `string`
- `onChange`: `(e: React.ChangeEvent<HTMLInputElement>) => void`
- `placeholder`: `string`
- `type`: `'text' | 'email' | 'password' | 'number' | 'tel'`
- `prefixIcon`: `ReactNode`
- `suffixIcon`: `ReactNode`
- `hint`: `string` (Teks petunjuk di bawah input)
- `error`: `boolean | string` (Status atau pesan kesalahan)
- `disabled`: `boolean`
- `required`: `boolean`

### Contoh Penggunaan:
```tsx
import { TextField } from '@idds/react';
import { IconSearch, IconId, IconMail } from '@tabler/icons-react';
import { useState } from 'react';

export function FormInputsExample() {
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [nikError, setNikError] = useState('');

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ''); // Hanya angka
    setNik(val);
    if (val.length > 0 && val.length !== 16) {
      setNikError('Nomor Induk Kependudukan (NIK) harus berjumlah 16 digit');
    } else {
      setNikError('');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <TextField
        label="Nomor Induk Kependudukan (NIK)"
        placeholder="Masukkan 16 digit NIK"
        value={nik}
        onChange={handleNikChange}
        prefixIcon={<IconId size={18} />}
        hint="Contoh: 3271010101900001"
        error={nikError}
        required
      />

      <TextField
        label="Alamat Pos-el (Email)"
        placeholder="nama@instansi.go.id"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        prefixIcon={<IconMail size={18} />}
        type="email"
      />
    </div>
  );
}
```

---

## 3. Modal

Dialog modal untuk konfirmasi aksi penting atau input formulir terfokus.

### Props:
- `open`: `boolean`
- `onClose`: `() => void`
- `title`: `string`
- `children`: `ReactNode`
- `actions`: `ReactNode` (Tombol aksi di bagian footer modal)

### Contoh Penggunaan:
```tsx
import { Modal, Button } from '@idds/react';
import { useState } from 'react';

export function ConfirmModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setIsOpen(false);
    // Jalankan mutasi data
  };

  return (
    <>
      <Button hierarchy="primary" onClick={() => setIsOpen(true)}>
        Ajukan Verifikasi
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)} title="Konfirmasi Pengajuan Dokumen">
        <div className="space-y-3 py-2 text-content-secondary">
          <p>
            Pastikan seluruh data permohonan yang Anda masukkan telah sesuai dengan dokumen fisik
            resmi. Data yang telah diajukan akan langsung diverifikasi oleh petugas verifikator.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button hierarchy="tertiary" onClick={() => setIsOpen(false)}>
            Periksa Kembali
          </Button>
          <Button hierarchy="primary" onClick={handleConfirm}>
            Ya, Ajukan Sekarang
          </Button>
        </div>
      </Modal>
    </>
  );
}
```

---

## 4. Alert

Pesan umpan balik kontekstual untuk menginformasikan status aksi atau peringatan sistem.

### Props:
- `variant`: `'neutral' | 'info' | 'success' | 'warning' | 'error'`
- `title`: `string`
- `message`: `string | ReactNode`
- `onClose`: `() => void` (Opsional jika alert dapat ditutup)

### Contoh Penggunaan:
```tsx
import { Alert } from '@idds/react';

export function AlertStatusExample() {
  return (
    <div className="space-y-3">
      <Alert
        variant="info"
        title="Pemeliharaan Sistem Terjadwal"
        message="Portal layanan akan melakukan pemeliharaan pada hari Minggu pukul 01.00 - 04.00 WIB."
      />
      <Alert
        variant="success"
        title="Dokumen Berhasil Dikirim"
        message="Nomor tiket permohonan Anda: #SPBE-2026-98124."
      />
      <Alert
        variant="warning"
        title="Berkas Belum Lengkap"
        message="Surat Keputusan Pengangkatan wajib dilampirkan sebelum permohonan dapat diproses."
      />
      <Alert
        variant="error"
        title="Gagal Terhubung ke Pusat Data"
        message="Koneksi ke server gateway instansi terputus. Silakan coba kembali dalam beberapa saat."
      />
    </div>
  );
}
```

---

## 5. Table & TableCell

Tabel data terstruktur dengan header, accessor kustom, dan sel interaktif.

### Props Table:
- `columns`: `Column[]` (Setiap kolom memuat `header: string`, `accessor: string`, `render?: (row: any) => ReactNode`)
- `data`: `any[]`
- `className`: `string`

### Contoh Penggunaan:
```tsx
import { Table, Button, Badge, type Column } from '@idds/react';
import { IconEye, IconDownload } from '@tabler/icons-react';

interface Permohonan {
  id: string;
  nomor: string;
  pemohon: string;
  layanan: string;
  status: 'pending' | 'approved' | 'rejected';
  tanggal: string;
}

const columns: Column[] = [
  { header: 'No. Tiket', accessor: 'nomor' },
  { header: 'Nama Pemohon', accessor: 'pemohon' },
  { header: 'Jenis Layanan', accessor: 'layanan' },
  {
    header: 'Status',
    accessor: 'status',
    render: (row: Permohonan) => {
      const map = {
        pending: { label: 'Menunggu', variant: 'warning' as const },
        approved: { label: 'Disetujui', variant: 'success' as const },
        rejected: { label: 'Ditolak', variant: 'error' as const },
      };
      const cur = map[row.status];
      return <Badge variant={cur.variant} type="soft">{cur.label}</Badge>;
    },
  },
  { header: 'Tanggal Pengajuan', accessor: 'tanggal' },
  {
    header: 'Aksi',
    accessor: 'id',
    render: (row: Permohonan) => (
      <div className="flex gap-2">
        <Button hierarchy="secondary" size="sm" prefixIcon={<IconEye size={14} />}>
          Lihat
        </Button>
      </div>
    ),
  },
];

export function DataPermohonanTable({ data }: { data: Permohonan[] }) {
  return <Table columns={columns} data={data} />;
}
```

---

## 6. SelectDropdown & BasicDropdown

Menu dropdown pilihan tunggal atau wadah menu kustom.

```tsx
import { SelectDropdown, BasicDropdown, Button } from '@idds/react';
import { useState } from 'react';
import { IconFilter } from '@tabler/icons-react';

export function DropdownExample() {
  const [selectedInstansi, setSelectedInstansi] = useState('panrb');

  const instansiOptions = [
    { label: 'Kementerian PAN-RB', value: 'panrb' },
    { label: 'Badan Kepegawaian Negara (BKN)', value: 'bkn' },
    { label: 'Lembaga Administrasi Negara (LAN)', value: 'lan' },
    { label: 'Kementerian Kominfo', value: 'kominfo' },
  ];

  return (
    <div className="flex items-center gap-4">
      {/* Select Dropdown */}
      <SelectDropdown
        options={instansiOptions}
        selected={selectedInstansi}
        onSelect={(val) => setSelectedInstansi(val)}
      />

      {/* Basic Dropdown Custom Trigger */}
      <BasicDropdown
        trigger={
          <Button hierarchy="secondary" size="md" prefixIcon={<IconFilter size={16} />}>
            Filter Lanjutan
          </Button>
        }
        content={
          <div className="p-4 bg-background-primary shadow-lg rounded-lg border border-stroke-primary min-w-[240px]">
            <h4 className="font-semibold text-sm mb-2 text-content-primary">Kategori Layanan</h4>
            <div className="space-y-2 text-sm text-content-secondary">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" /> Layanan Publik
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" /> Layanan Aparatur
              </label>
            </div>
          </div>
        }
      />
    </div>
  );
}
```

---

## 7. Card & Card Content

Wadah pengelompokan data atau ringkasan metrik statistik.

```tsx
import { Card, Badge, Button } from '@idds/react';

export function StatCardExample() {
  return (
    <Card variant="basic" className="p-6 bg-background-primary border border-stroke-primary rounded-xl shadow-xs">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-content-secondary text-sm font-medium">Total Permohonan Masuk</p>
          <h3 className="text-3xl font-bold text-content-primary mt-1">14.820</h3>
        </div>
        <Badge variant="brand" type="soft">+12.4%</Badge>
      </div>
      <p className="text-xs text-content-secondary mt-3">Dibandingkan periode bulan lalu</p>
    </Card>
  );
}
```

---

## 8. Stepper (Alur Multi-Langkah Layanan)

Navigasi panduan tahap pendaftaran atau pengisian perizinan bertahap.

```tsx
import { Stepper } from '@idds/react';

export function RegistrationStepperExample({ currentStep }: { currentStep: number }) {
  const steps = [
    { title: 'Identitas Diri', description: 'Pengisian NIK & Data Pokok' },
    { title: 'Unggah Berkas', description: 'KTP, SK, & Dokumen Pendukung' },
    { title: 'Review & Konfirmasi', description: 'Pemeriksaan kebenaran data' },
    { title: 'Selesai', description: 'Penerbitan nomor tanda terima' },
  ];

  return <Stepper steps={steps} activeStep={currentStep} />;
}
```
