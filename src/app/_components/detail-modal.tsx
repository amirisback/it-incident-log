'use client';

import React, { useState } from 'react';
import {
  Modal,
  Button,
  TextArea,
} from '@idds/react';
import {
  IconCopy,
  IconCheck,
  IconClock,
  IconBuildingCommunity,
  IconUser,
  IconServer,
  IconTrash,
  IconFileText,
} from '@tabler/icons-react';
import { IncidentStatusBadge, IncidentSeverityBadge } from './incident-badge';
import { Incident, IncidentStatus } from '@/types/incident';
import { updateIncident } from '@/lib/api-client';

interface DetailModalProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
  onDeleteRequest: (incident: Incident) => void;
  onIncidentUpdated: (updated: Incident) => void;
}

const STATUS_PROGRESSION: IncidentStatus[] = [
  'TERLAPOR',
  'DIINVESTIGASI',
  'DITANGANI',
  'SELESAI',
  'DITUTUP',
];

export function DetailModal({
  incident,
  open,
  onClose,
  onDeleteRequest,
  onIncidentUpdated,
}: DetailModalProps): React.JSX.Element | null {
  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState('');
  const [showStatusNoteForm, setShowStatusNoteForm] = useState(false);
  const [selectedNextStatus, setSelectedNextStatus] = useState<IncidentStatus | null>(null);

  if (!incident) return null;

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(incident.ticketNumber);
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

  const handleAdvanceStatus = async (nextStatus: IncidentStatus) => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateIncident(incident.id, {
        status: nextStatus,
        resolutionNotes: statusNote.trim() ? statusNote.trim() : incident.resolutionNotes,
      });

      if (res.success && res.data) {
        onIncidentUpdated(res.data);
        setShowStatusNoteForm(false);
        setStatusNote('');
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Detail Catatan Gangguan</span>
        </div>
      }
      size="lg"
      closeLabel="Tutup dialog detail"
    >
      <div className="space-y-6 py-2 text-zinc-900 dark:text-zinc-100">
        {/* Ticket Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {incident.ticketNumber}
            </span>
            <button
              type="button"
              onClick={handleCopyTicket}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              title="Salin nomor tiket"
              aria-label="Salin nomor tiket"
            >
              {copied ? (
                <IconCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <IconCopy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <IncidentSeverityBadge severity={incident.severity} />
            <IncidentStatusBadge status={incident.status} />
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {incident.title}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1">
              <IconServer className="w-3.5 h-3.5" />
              {incident.affectedService}
            </span>
            <span>•</span>
            <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {incident.category}
            </span>
          </div>
        </div>

        {/* Grid Informasi Detail */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-3 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-start gap-2">
              <IconUser className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-400">Pelapor</p>
                <p className="text-zinc-900 dark:text-zinc-100 font-semibold">{incident.reporterName}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <IconBuildingCommunity className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-400">Instansi / Unit Kerja</p>
                <p className="text-zinc-900 dark:text-zinc-100">{incident.reporterAgency}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <div className="flex items-start gap-2">
              <IconClock className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-400">Waktu Dilaporkan</p>
                <p className="text-zinc-900 dark:text-zinc-100">{formatDate(incident.reportedAt)}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <IconCheck className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-zinc-400">Waktu Diselesaikan</p>
                <p className="text-zinc-900 dark:text-zinc-100">{formatDate(incident.resolvedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deskripsi Kronologi */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <IconFileText className="w-4 h-4" />
            Deskripsi Kronologi Gangguan
          </h3>
          <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
            {incident.description}
          </div>
        </div>

        {/* Catatan Penyelesaian Teknis */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Catatan Tindak Lanjut Teknis (NOC / CSIRT)
          </h3>
          <div className="p-3.5 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/50 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {incident.resolutionNotes || 'Belum ada catatan tindak lanjut teknis yang dicatatkan.'}
          </div>
        </div>

        {/* Update Status Workflow */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Perbarui Status Penanganan Insiden
          </h4>

          <div className="flex flex-wrap items-center gap-2">
            {STATUS_PROGRESSION.map((st) => {
              const isCurrent = incident.status === st;
              return (
                <button
                  key={st}
                  type="button"
                  disabled={isCurrent || isUpdatingStatus}
                  onClick={() => {
                    setSelectedNextStatus(st);
                    setShowStatusNoteForm(true);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                    isCurrent
                      ? 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold border-zinc-400 dark:border-zinc-600'
                      : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  }`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {showStatusNoteForm && selectedNextStatus && (
            <div className="p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-300 dark:border-zinc-700 space-y-2 mt-2">
              <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                Pembaruan status ke <strong>{selectedNextStatus}</strong>
              </p>
              <TextArea
                label="Tambahkan Catatan Teknis (Opsional)"
                placeholder="Tuliskan tindakan yang telah dilakukan..."
                value={statusNote}
                onChange={(val) => setStatusNote(val)}
                minRows={2}
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  hierarchy="tertiary"
                  size="sm"
                  onClick={() => setShowStatusNoteForm(false)}
                >
                  Batal
                </Button>
                <Button
                  hierarchy="primary"
                  size="sm"
                  disabled={isUpdatingStatus}
                  onClick={() => handleAdvanceStatus(selectedNextStatus)}
                >
                  {isUpdatingStatus ? 'Menyimpan...' : 'Terapkan Status'}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            type="button"
            hierarchy="tertiary"
            size="sm"
            onClick={() => onDeleteRequest(incident)}
            prefixIcon={<IconTrash className="w-4 h-4 text-red-500" />}
            className="text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            Hapus Catatan
          </Button>

          <Button
            type="button"
            hierarchy="secondary"
            size="md"
            onClick={onClose}
            className="!rounded-lg"
          >
            Tutup
          </Button>
        </div>
      </div>
    </Modal>
  );
}
