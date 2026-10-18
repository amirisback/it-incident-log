export type IncidentCategory =
  | 'Jaringan'
  | 'Server & Cloud'
  | 'Aplikasi Web'
  | 'Database'
  | 'Keamanan Siber'
  | 'Perangkat Keras';

export type IncidentSeverity = 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';

export type IncidentStatus =
  | 'TERLAPOR'
  | 'DIINVESTIGASI'
  | 'DITANGANI'
  | 'SELESAI'
  | 'DITUTUP';

export interface Incident {
  id: string;
  ticketNumber: string; // e.g. INC-20261018-0012
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  status: IncidentStatus;
  reporterName: string;
  reporterAgency: string;
  affectedService: string;
  downtimeMinutes: number;
  reportedAt: string; // ISO 8601
  resolvedAt: string | null;
  resolutionNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  category: IncidentCategory;
  severity: IncidentSeverity;
  reporterName: string;
  reporterAgency: string;
  affectedService: string;
  downtimeMinutes?: number;
  reportedAt?: string;
}

export interface UpdateIncidentDto {
  title?: string;
  description?: string;
  category?: IncidentCategory;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  reporterName?: string;
  reporterAgency?: string;
  affectedService?: string;
  downtimeMinutes?: number;
  resolvedAt?: string | null;
  resolutionNotes?: string | null;
}

export interface IncidentQueryParams {
  search?: string;
  category?: string;
  severity?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface IncidentStats {
  total: number;
  critical: number;
  inProgress: number;
  resolved: number;
  avgDowntimeMinutes: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string>;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
