'use client';

import React, { useState } from 'react';
import {
  Modal,
  TextField,
  TextArea,
  Button,
  Alert,
} from '@idds/react';
import { IconSend } from '@tabler/icons-react';
import { createIncident } from '@/lib/api-client';
import {
  CreateIncidentDto,
  IncidentCategory,
  IncidentSeverity,
  Incident,
} from '@/types/incident';

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newIncident: Incident) => void;
}

const CATEGORY_OPTIONS: IncidentCategory[] = [
  'Jaringan',
  'Server & Cloud',
  'Aplikasi Web',
  'Database',
  'Keamanan Siber',
  'Perangkat Keras',
];

const SEVERITY_OPTIONS: IncidentSeverity[] = [
  'Rendah',
  'Sedang',
  'Tinggi',
  'Kritis',
];

export function ReportModal({ open, onClose, onSuccess }: ReportModalProps): React.JSX.Element | null {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('Aplikasi Web');
  const [severity, setSeverity] = useState<IncidentSeverity>('Sedang');
  const [reporterName, setReporterName] = useState('');
  const [reporterAgency, setReporterAgency] = useState('');
  const [affectedService, setAffectedService] = useState('');
  const [downtimeMinutes, setDowntimeMinutes] = useState('0');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('Aplikasi Web');
    setSeverity('Sedang');
    setReporterName('');
    setReporterAgency('');
    setAffectedService('');
    setDowntimeMinutes('0');
    setFieldErrors({});
    setGeneralError(null);
    setSuccessMessage(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const payload: CreateIncidentDto = {
      title,
      description,
      category,
      severity,
      reporterName,
      reporterAgency,
      affectedService,
      downtimeMinutes: parseInt(downtimeMinutes, 10) || 0,
    };

    setIsSubmitting(true);

    try {
      const res = await createIncident(payload);

      if (!res.success) {
        if (res.errors) {
          setFieldErrors(res.errors);
        }
        setGeneralError(res.error || 'Terjadi kesalahan saat memproses laporan gangguan.');
        setIsSubmitting(false);
        return;
      }

      if (res.data) {
        setSuccessMessage(`Laporan gangguan berhasil didaftarkan dengan nomor tiket: ${res.data.ticketNumber}`);
        setTimeout(() => {
          onSuccess(res.data!);
          handleClose();
        }, 1200);
      }
    } catch {
      setGeneralError('Gagal menghubungi backend REST API. Pastikan jaringan terhubung.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Formulir Lapor Gangguan Layanan TI"
      size="lg"
      closeLabel="Tutup formulir"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2 text-zinc-900 dark:text-zinc-100">
        {/* Banner Instruksi */}
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Isi detail gangguan sistem secara akurat. Data yang dikirimkan akan langsung masuk ke antrean investigasi tim teknis NOC & CSIRT SPBE.
        </p>

        {/* Notifikasi Sukses / Error Umum */}
        {successMessage && (
          <Alert
            variant="success"
            title="Laporan Terkirim"
            message={successMessage}
          />
        )}

        {generalError && (
          <Alert
            variant="critical"
            title="Gagal Mengirim Laporan"
            message={generalError}
          />
        )}

        {/* Judul Gangguan */}
        <div>
          <TextField
            label="Judul Gangguan"
            placeholder="Contoh: Latensi Tinggi pada Endpoint Login SIASN"
            value={title}
            onChange={(val) => setTitle(val)}
            status={fieldErrors.title ? 'error' : 'neutral'}
            statusMessage={fieldErrors.title}
            maxLength={150}
            showCharCount
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Layanan Terdampak */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <TextField
              label="Layanan / Sistem Terdampak"
              placeholder="Contoh: Portal SIASN, PDN Cloud"
              value={affectedService}
              onChange={(val) => setAffectedService(val)}
              status={fieldErrors.affectedService ? 'error' : 'neutral'}
              statusMessage={fieldErrors.affectedService}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <TextField
              label="Estimasi Durasi Dampak (Menit)"
              placeholder="0"
              type="number"
              value={downtimeMinutes}
              onChange={(val) => setDowntimeMinutes(val)}
              status={fieldErrors.downtimeMinutes ? 'error' : 'neutral'}
              statusMessage={fieldErrors.downtimeMinutes}
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Kategori dan Tingkat Urgensi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Kategori Sistem <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as IncidentCategory)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#196bcd]"
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldErrors.category && (
              <span className="text-xs text-red-500">{fieldErrors.category}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Tingkat Urgensi / Keparahan <span className="text-red-500">*</span>
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
              disabled={isSubmitting}
              className="w-full px-3 py-2 text-sm rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#196bcd]"
            >
              {SEVERITY_OPTIONS.map((sev) => (
                <option key={sev} value={sev}>
                  {sev}
                </option>
              ))}
            </select>
            {fieldErrors.severity && (
              <span className="text-xs text-red-500">{fieldErrors.severity}</span>
            )}
          </div>
        </div>

        {/* Data Pelapor: Nama & Unit Kerja */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <TextField
              label="Nama Lengkap Pelapor"
              placeholder="Contoh: Budi Prasetyo"
              value={reporterName}
              onChange={(val) => setReporterName(val)}
              status={fieldErrors.reporterName ? 'error' : 'neutral'}
              statusMessage={fieldErrors.reporterName}
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <TextField
              label="Unit Kerja / Instansi Pemerintah"
              placeholder="Contoh: Diskominfo / Ditjen Aptika"
              value={reporterAgency}
              onChange={(val) => setReporterAgency(val)}
              status={fieldErrors.reporterAgency ? 'error' : 'neutral'}
              statusMessage={fieldErrors.reporterAgency}
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        {/* Deskripsi Kronologi */}
        <div>
          <TextArea
            label="Deskripsi Kronologi & Dampak Gangguan"
            placeholder="Jelaskan indikasi awal, pesan error, serta perkiraan sistem/pengguna yang terdampak..."
            value={description}
            onChange={(val) => setDescription(val)}
            status={fieldErrors.description ? 'error' : 'neutral'}
            statusMessage={fieldErrors.description}
            minRows={3}
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            type="button"
            hierarchy="tertiary"
            size="md"
            onClick={handleClose}
            disabled={isSubmitting}
            className="!rounded-lg"
          >
            Batal
          </Button>

          <Button
            type="submit"
            hierarchy="primary"
            size="md"
            disabled={isSubmitting}
            prefixIcon={<IconSend className="w-4 h-4" />}
            className="!rounded-lg font-semibold"
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Laporan Gangguan'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
