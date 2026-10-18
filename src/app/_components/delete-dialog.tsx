'use client';

import React, { useState } from 'react';
import { Modal, Button, Alert } from '@idds/react';
import { IconAlertTriangle, IconTrash } from '@tabler/icons-react';
import { Incident } from '@/types/incident';
import { deleteIncident } from '@/lib/api-client';

interface DeleteDialogProps {
  incident: Incident | null;
  open: boolean;
  onClose: () => void;
  onSuccess: (deletedId: string) => void;
}

export function DeleteDialog({
  incident,
  open,
  onClose,
  onSuccess,
}: DeleteDialogProps): React.JSX.Element | null {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!incident) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    try {
      const res = await deleteIncident(incident.id);
      if (!res.success) {
        setError(res.error || 'Gagal menghapus data insiden.');
        setIsDeleting(false);
        return;
      }
      onSuccess(incident.id);
      onClose();
    } catch {
      setError('Gagal menghubungi backend REST API.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Konfirmasi Penghapusan Insiden"
      size="sm"
      closeLabel="Tutup dialog konfirmasi"
    >
      <div className="space-y-4 py-2 text-zinc-900 dark:text-zinc-100">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200">
          <IconAlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold">Tindakan ini bersifat permanen!</p>
            <p className="opacity-90">
              Catatan gangguan nomor <strong>{incident.ticketNumber}</strong> ({incident.title}) akan dihapus dari sistem dan tidak dapat dipulihkan kembali.
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="critical" title="Gagal Menghapus" message={error} />
        )}

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <Button
            type="button"
            hierarchy="tertiary"
            size="md"
            onClick={onClose}
            disabled={isDeleting}
          >
            Batal
          </Button>

          <Button
            type="button"
            hierarchy="primary"
            size="md"
            disabled={isDeleting}
            onClick={handleDelete}
            prefixIcon={<IconTrash className="w-4 h-4" />}
            className="!bg-red-600 hover:!bg-red-700 !text-white font-semibold"
          >
            {isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
