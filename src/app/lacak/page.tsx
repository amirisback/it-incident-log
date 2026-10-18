'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  IconSearch,
  IconArrowLeft,
  IconCheck,
  IconClock,
  IconCopy,
  IconBuildingCommunity,
  IconUser,
} from '@tabler/icons-react';
import { Button, Alert } from '@idds/react';
import { SpbeBanner } from '../_components/spbe-banner';
import { SpbeHeader } from '../_components/spbe-header';
import { SpbeFooter } from '../_components/spbe-footer';
import { IncidentStatusBadge, IncidentSeverityBadge } from '../_components/incident-badge';
import { fetchIncidentById } from '@/lib/api-client';
import { Incident, IncidentStatus } from '@/types/incident';

function TicketTrackerContent(): React.JSX.Element {
  const searchParams = useSearchParams();
  const initialTicketParam = searchParams.get('ticket') || '';

  const [ticketInput, setTicketInput] = useState(initialTicketParam);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const searchTicket = async (ticketNumber: string) => {
    if (!ticketNumber.trim()) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetchIncidentById(ticketNumber.trim());
      if (!res.success || !res.data) {
        setError(res.error || `Tiket '${ticketNumber}' tidak ditemukan pada basis data.`);
        setIncident(null);
        return;
      }
      setIncident(res.data);
    } catch {
      setError('Gagal menghubungi backend REST API.');
      setIncident(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    if (initialTicketParam) {
      fetchIncidentById(initialTicketParam.trim())
        .then((res) => {
          if (!ignore) {
            if (res.success && res.data) {
              setIncident(res.data);
            } else {
              setError(res.error || `Tiket '${initialTicketParam}' tidak ditemukan.`);
            }
          }
        })
        .catch(() => {
          if (!ignore) {
            setError('Gagal menghubungi backend REST API.');
          }
        });
    }
    return () => {
      ignore = true;
    };
  }, [initialTicketParam]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchTicket(ticketInput);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString: string | null) => {
    if (!isoString) return '-';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    } catch {
      return isoString;
    }
  };

  // Status index for progress steps
  const steps: { key: IncidentStatus; label: string; desc: string }[] = [
    { key: 'TERLAPOR', label: '1. Terlapor', desc: 'Laporan diterima sistem NOC' },
    { key: 'DIINVESTIGASI', label: '2. Investigasi', desc: 'Analisis akar masalah teknis' },
    { key: 'DITANGANI', label: '3. Penanganan', desc: 'Mitigasi & pemulihan layanan' },
    { key: 'SELESAI', label: '4. Selesai', desc: 'Layanan normal kembali' },
  ];

  const getStepStatus = (stepKey: IncidentStatus) => {
    if (!incident) return 'upcoming';

    const order: IncidentStatus[] = ['TERLAPOR', 'DIINVESTIGASI', 'DITANGANI', 'SELESAI', 'DITUTUP'];
    const currentIdx = order.indexOf(incident.status);
    const stepIdx = order.indexOf(stepKey);

    if (incident.status === 'DITUTUP') return 'completed';
    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#196bcd] hover:underline"
        >
          <IconArrowLeft className="w-3.5 h-3.5" />
          Kembali ke Dasbor Pemantauan
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
          Lacak Progres Tiket Gangguan TI
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Masukkan nomor tiket resmi (contoh: <code>INC-20261018-0001</code>) untuk memantau status tindak lanjut penanganan oleh tim NOC & CSIRT SPBE.
        </p>
      </div>

      {/* Form Pencarian Tiket */}
      <form
        onSubmit={handleSubmit}
        className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
            <IconSearch className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Masukkan nomor tiket (misal: INC-20261018-0001)"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-sm rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#196bcd]"
            required
          />
        </div>
        <Button
          type="submit"
          hierarchy="primary"
          size="lg"
          disabled={isLoading}
          className="!rounded-xl font-semibold shrink-0"
        >
          {isLoading ? 'Mencari...' : 'Lacak Status'}
        </Button>
      </form>

      {/* Error Message */}
      {error && (
        <Alert
          variant="critical"
          title="Pencarian Tidak Ditemukan"
          message={error}
        />
      )}

      {/* Ticket Details & Timeline */}
      {incident && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs p-6 space-y-8 animate-in fade-in duration-200">
          {/* Header Tiket */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {incident.ticketNumber}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(incident.ticketNumber)}
                  className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                  title="Salin nomor tiket"
                >
                  {copied ? (
                    <IconCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <IconCopy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-zinc-500">
                Dilaporkan pada {formatDate(incident.reportedAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <IncidentSeverityBadge severity={incident.severity} size="md" />
              <IncidentStatusBadge status={incident.status} size="md" />
            </div>
          </div>

          {/* Stepper Progres Penanganan */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Alur Progres Penanganan Insiden
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              {steps.map((st) => {
                const state = getStepStatus(st.key);
                const isCompleted = state === 'completed';
                const isCurrent = state === 'current';

                return (
                  <div
                    key={st.key}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-50/80 dark:bg-blue-950/40 border-[#196bcd] shadow-xs ring-1 ring-[#196bcd]'
                        : isCompleted
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold">{st.label}</span>
                      {isCompleted ? (
                        <IconCheck className="w-4 h-4 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-[#196bcd] animate-ping" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {st.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Judul & Detail Informasi */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                {incident.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Kategori: <strong className="text-zinc-700 dark:text-zinc-300">{incident.category}</strong> • Layanan: <strong className="text-zinc-700 dark:text-zinc-300">{incident.affectedService}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <IconUser className="w-4 h-4 text-zinc-400" />
                  <span>Pelapor: <strong>{incident.reporterName}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <IconBuildingCommunity className="w-4 h-4 text-zinc-400" />
                  <span>Instansi: <strong>{incident.reporterAgency}</strong></span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 space-y-2">
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <IconClock className="w-4 h-4 text-zinc-400" />
                  <span>Durasi Gangguan: <strong>{incident.downtimeMinutes} Menit</strong></span>
                </div>
                <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-300">
                  <IconCheck className="w-4 h-4 text-zinc-400" />
                  <span>Diselesaikan: <strong>{formatDate(incident.resolvedAt)}</strong></span>
                </div>
              </div>
            </div>

            {/* Kronologi */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Deskripsi Kronologi Gangguan
              </h3>
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                {incident.description}
              </div>
            </div>

            {/* Tindak Lanjut Teknis */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Catatan Penanganan Teknis
              </h3>
              <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {incident.resolutionNotes || 'Belum ada catatan tindak lanjut yang dimasukkan oleh teknisi NOC.'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black font-sans text-zinc-900 dark:text-zinc-50 transition-colors">
      <SpbeBanner />
      <SpbeHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Suspense fallback={<div className="text-center py-12 text-sm text-zinc-500">Memuat modul lacak tiket...</div>}>
          <TicketTrackerContent />
        </Suspense>
      </main>
      <SpbeFooter />
    </div>
  );
}
