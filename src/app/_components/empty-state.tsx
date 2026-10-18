import React from 'react';
import { IconFolderOff } from '@tabler/icons-react';
import { Button } from '@idds/react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = 'Tidak Ada Data Gangguan',
  description = 'Tidak ada catatan insiden yang sesuai dengan filter atau kata kunci pencarian Anda.',
  actionLabel,
  onAction,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white dark:bg-zinc-900 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700">
      <div className="w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mb-4">
        <IconFolderOff className="w-8 h-8" stroke={1.5} />
      </div>
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mb-5">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          hierarchy="secondary"
          size="sm"
          onClick={onAction}
          className="font-medium !rounded-lg"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
