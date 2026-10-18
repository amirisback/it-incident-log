import React from 'react';
import { Badge, type BadgeVariant } from '@idds/react';
import { IncidentSeverity, IncidentStatus } from '@/types/incident';

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: 'sm' | 'md' | 'lg';
}

interface SeverityBadgeProps {
  severity: IncidentSeverity;
  size?: 'sm' | 'md' | 'lg';
}

export function IncidentStatusBadge({ status, size = 'sm' }: StatusBadgeProps): React.JSX.Element {
  let variant: BadgeVariant = 'neutral';
  let label: string = status;

  switch (status) {
    case 'TERLAPOR':
      variant = 'info';
      label = 'Terlapor';
      break;
    case 'DIINVESTIGASI':
      variant = 'warning';
      label = 'Investigasi';
      break;
    case 'DITANGANI':
      variant = 'brand';
      label = 'Ditangani';
      break;
    case 'SELESAI':
      variant = 'success';
      label = 'Selesai';
      break;
    case 'DITUTUP':
      variant = 'neutral';
      label = 'Ditutup';
      break;
  }

  return (
    <Badge type="soft" variant={variant} size={size} rounded="full">
      {label}
    </Badge>
  );
}

export function IncidentSeverityBadge({ severity, size = 'sm' }: SeverityBadgeProps): React.JSX.Element {
  let variant: BadgeVariant = 'neutral';

  switch (severity) {
    case 'Rendah':
      variant = 'info';
      break;
    case 'Sedang':
      variant = 'warning';
      break;
    case 'Tinggi':
      variant = 'error';
      break;
    case 'Kritis':
      variant = 'error';
      break;
  }

  const isCritical = severity === 'Kritis';

  return (
    <Badge
      type={isCritical ? 'fill' : 'soft'}
      variant={variant}
      size={size}
      rounded="md"
      className={isCritical ? 'font-bold tracking-wide animate-pulse' : ''}
    >
      {severity}
    </Badge>
  );
}
