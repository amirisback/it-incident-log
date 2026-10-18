import {
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentCategory,
  IncidentSeverity,
  IncidentStatus,
} from '@/types/incident';

export const VALID_CATEGORIES: IncidentCategory[] = [
  'Jaringan',
  'Server & Cloud',
  'Aplikasi Web',
  'Database',
  'Keamanan Siber',
  'Perangkat Keras',
];

export const VALID_SEVERITIES: IncidentSeverity[] = [
  'Rendah',
  'Sedang',
  'Tinggi',
  'Kritis',
];

export const VALID_STATUSES: IncidentStatus[] = [
  'TERLAPOR',
  'DIINVESTIGASI',
  'DITANGANI',
  'SELESAI',
  'DITUTUP',
];

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateCreateIncident(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: { body: 'Data permintaan (body) harus berupa objek JSON yang valid.' },
    };
  }

  const dto = data as Partial<CreateIncidentDto>;

  // Judul
  if (!dto.title || typeof dto.title !== 'string' || dto.title.trim().length === 0) {
    errors.title = 'Judul gangguan wajib diisi.';
  } else if (dto.title.trim().length < 5) {
    errors.title = 'Judul gangguan minimal 5 karakter.';
  } else if (dto.title.trim().length > 150) {
    errors.title = 'Judul gangguan maksimal 150 karakter.';
  }

  // Deskripsi
  if (!dto.description || typeof dto.description !== 'string' || dto.description.trim().length === 0) {
    errors.description = 'Deskripsi kronologi gangguan wajib diisi.';
  } else if (dto.description.trim().length < 10) {
    errors.description = 'Deskripsi minimal 10 karakter agar informatif bagi tim teknis.';
  }

  // Kategori
  if (!dto.category) {
    errors.category = 'Kategori sistem wajib dipilih.';
  } else if (!VALID_CATEGORIES.includes(dto.category as IncidentCategory)) {
    errors.category = `Kategori tidak valid. Pilihan yang valid: ${VALID_CATEGORIES.join(', ')}.`;
  }

  // Tingkat Urgensi / Keparahan
  if (!dto.severity) {
    errors.severity = 'Tingkat urgensi gangguan wajib dipilih.';
  } else if (!VALID_SEVERITIES.includes(dto.severity as IncidentSeverity)) {
    errors.severity = `Tingkat urgensi tidak valid. Pilihan: ${VALID_SEVERITIES.join(', ')}.`;
  }

  // Nama Pelapor
  if (!dto.reporterName || typeof dto.reporterName !== 'string' || dto.reporterName.trim().length === 0) {
    errors.reporterName = 'Nama pelapor wajib diisi.';
  } else if (dto.reporterName.trim().length < 3) {
    errors.reporterName = 'Nama pelapor minimal 3 karakter.';
  }

  // Unit Kerja / Instansi
  if (!dto.reporterAgency || typeof dto.reporterAgency !== 'string' || dto.reporterAgency.trim().length === 0) {
    errors.reporterAgency = 'Unit kerja atau nama instansi pelapor wajib diisi.';
  } else if (dto.reporterAgency.trim().length < 3) {
    errors.reporterAgency = 'Nama instansi minimal 3 karakter.';
  }

  // Layanan Terdampak
  if (!dto.affectedService || typeof dto.affectedService !== 'string' || dto.affectedService.trim().length === 0) {
    errors.affectedService = 'Nama layanan/sistem terdampak wajib diisi.';
  } else if (dto.affectedService.trim().length < 3) {
    errors.affectedService = 'Nama layanan minimal 3 karakter.';
  }

  // Durasi Dampak (Downtime)
  if (dto.downtimeMinutes !== undefined && dto.downtimeMinutes !== null) {
    const num = Number(dto.downtimeMinutes);
    if (isNaN(num) || num < 0) {
      errors.downtimeMinutes = 'Durasi gangguan (menit) harus berupa angka lebih besar atau sama dengan 0.';
    }
  }

  // Format tanggal jika diberikan
  if (dto.reportedAt) {
    const parsedDate = Date.parse(dto.reportedAt);
    if (isNaN(parsedDate)) {
      errors.reportedAt = 'Format waktu pelaporan tidak valid. Gunakan format ISO 8601.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateUpdateIncident(data: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data || typeof data !== 'object') {
    return {
      isValid: false,
      errors: { body: 'Data permintaan (body) harus berupa objek JSON.' },
    };
  }

  const dto = data as Partial<UpdateIncidentDto>;

  if (dto.title !== undefined) {
    if (typeof dto.title !== 'string' || dto.title.trim().length < 5) {
      errors.title = 'Judul gangguan minimal 5 karakter.';
    }
  }

  if (dto.description !== undefined) {
    if (typeof dto.description !== 'string' || dto.description.trim().length < 10) {
      errors.description = 'Deskripsi kronologi minimal 10 karakter.';
    }
  }

  if (dto.category !== undefined) {
    if (!VALID_CATEGORIES.includes(dto.category as IncidentCategory)) {
      errors.category = `Kategori tidak valid. Pilihan: ${VALID_CATEGORIES.join(', ')}.`;
    }
  }

  if (dto.severity !== undefined) {
    if (!VALID_SEVERITIES.includes(dto.severity as IncidentSeverity)) {
      errors.severity = `Tingkat urgensi tidak valid. Pilihan: ${VALID_SEVERITIES.join(', ')}.`;
    }
  }

  if (dto.status !== undefined) {
    if (!VALID_STATUSES.includes(dto.status as IncidentStatus)) {
      errors.status = `Status tidak valid. Pilihan: ${VALID_STATUSES.join(', ')}.`;
    }
  }

  if (dto.downtimeMinutes !== undefined && dto.downtimeMinutes !== null) {
    const num = Number(dto.downtimeMinutes);
    if (isNaN(num) || num < 0) {
      errors.downtimeMinutes = 'Durasi gangguan harus berupa angka >= 0.';
    }
  }

  if (dto.resolvedAt) {
    const parsedDate = Date.parse(dto.resolvedAt);
    if (isNaN(parsedDate)) {
      errors.resolvedAt = 'Format waktu penyelesaian tidak valid. Gunakan format ISO 8601.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
