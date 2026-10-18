import fs from 'node:fs';
import path from 'node:path';
import {
  Incident,
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentQueryParams,
  IncidentStats,
} from '@/types/incident';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DATA_FILE = path.join(DATA_DIR, 'incidents.json');

const INITIAL_INCIDENTS: Incident[] = [];

// In-Memory cache with filesystem persistence
class IncidentStore {
  private incidents: Incident[] = [];
  private initialized = false;

  constructor() {
    this.ensureInitialized();
  }

  private ensureInitialized() {
    if (this.initialized) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DATA_FILE)) {
        const content = fs.readFileSync(DATA_FILE, 'utf-8');
        this.incidents = JSON.parse(content);
      } else {
        this.incidents = [...INITIAL_INCIDENTS];
        this.saveToFile();
      }
    } catch {
      this.incidents = [...INITIAL_INCIDENTS];
    }

    this.initialized = true;
  }

  private saveToFile() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.incidents, null, 2), 'utf-8');
    } catch (err) {
      console.error('Gagal menyimpan incidents ke file:', err);
    }
  }

  public getAll(params: IncidentQueryParams = {}): {
    incidents: Incident[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    this.ensureInitialized();
    let result = [...this.incidents];

    // Search
    if (params.search && params.search.trim().length > 0) {
      const q = params.search.trim().toLowerCase();
      result = result.filter(
        (i) =>
          i.ticketNumber.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.affectedService.toLowerCase().includes(q) ||
          i.reporterAgency.toLowerCase().includes(q) ||
          i.reporterName.toLowerCase().includes(q)
      );
    }

    // Category
    if (params.category && params.category !== 'Semua') {
      result = result.filter((i) => i.category === params.category);
    }

    // Severity
    if (params.severity && params.severity !== 'Semua') {
      result = result.filter((i) => i.severity === params.severity);
    }

    // Status
    if (params.status && params.status !== 'Semua') {
      result = result.filter((i) => i.status === params.status);
    }

    // Sort: newest first
    result.sort(
      (a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );

    const total = result.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.max(1, params.limit || 20);
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = result.slice(offset, offset + limit);

    return {
      incidents: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  public getByIdOrTicket(identifier: string): Incident | null {
    this.ensureInitialized();
    const cleanId = identifier.trim().toLowerCase();
    const found = this.incidents.find(
      (i) =>
        i.id.toLowerCase() === cleanId ||
        i.ticketNumber.toLowerCase() === cleanId
    );
    return found || null;
  }

  public create(dto: CreateIncidentDto): Incident {
    this.ensureInitialized();
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `INC-${dateStr}-${randomSuffix}`;
    const id = `inc-${Date.now()}`;

    const newIncident: Incident = {
      id,
      ticketNumber,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category,
      severity: dto.severity,
      status: 'TERLAPOR',
      reporterName: dto.reporterName.trim(),
      reporterAgency: dto.reporterAgency.trim(),
      affectedService: dto.affectedService.trim(),
      downtimeMinutes: Number(dto.downtimeMinutes) || 0,
      reportedAt: dto.reportedAt || now.toISOString(),
      resolvedAt: null,
      resolutionNotes: null,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    this.incidents.unshift(newIncident);
    this.saveToFile();
    return newIncident;
  }

  public update(id: string, dto: UpdateIncidentDto): Incident | null {
    this.ensureInitialized();
    const index = this.incidents.findIndex((i) => i.id === id || i.ticketNumber === id);
    if (index === -1) return null;

    const existing = this.incidents[index];
    const now = new Date().toISOString();

    const updatedStatus = dto.status || existing.status;
    let resolvedAt = existing.resolvedAt;

    if (updatedStatus === 'SELESAI' || updatedStatus === 'DITUTUP') {
      resolvedAt = dto.resolvedAt || existing.resolvedAt || now;
    } else if (dto.resolvedAt !== undefined) {
      resolvedAt = dto.resolvedAt;
    }

    const updated: Incident = {
      ...existing,
      title: dto.title !== undefined ? dto.title.trim() : existing.title,
      description: dto.description !== undefined ? dto.description.trim() : existing.description,
      category: dto.category || existing.category,
      severity: dto.severity || existing.severity,
      status: updatedStatus,
      reporterName: dto.reporterName !== undefined ? dto.reporterName.trim() : existing.reporterName,
      reporterAgency: dto.reporterAgency !== undefined ? dto.reporterAgency.trim() : existing.reporterAgency,
      affectedService: dto.affectedService !== undefined ? dto.affectedService.trim() : existing.affectedService,
      downtimeMinutes: dto.downtimeMinutes !== undefined ? Number(dto.downtimeMinutes) : existing.downtimeMinutes,
      resolvedAt,
      resolutionNotes: dto.resolutionNotes !== undefined ? dto.resolutionNotes : existing.resolutionNotes,
      updatedAt: now,
    };

    this.incidents[index] = updated;
    this.saveToFile();
    return updated;
  }

  public delete(id: string): boolean {
    this.ensureInitialized();
    const index = this.incidents.findIndex((i) => i.id === id || i.ticketNumber === id);
    if (index === -1) return false;

    this.incidents.splice(index, 1);
    this.saveToFile();
    return true;
  }

  public getStats(): IncidentStats {
    this.ensureInitialized();
    const total = this.incidents.length;
    const critical = this.incidents.filter(
      (i) => i.severity === 'Kritis' && i.status !== 'DITUTUP' && i.status !== 'SELESAI'
    ).length;
    const inProgress = this.incidents.filter(
      (i) => i.status === 'DIINVESTIGASI' || i.status === 'DITANGANI' || i.status === 'TERLAPOR'
    ).length;
    const resolved = this.incidents.filter(
      (i) => i.status === 'SELESAI' || i.status === 'DITUTUP'
    ).length;

    const downtimeSum = this.incidents.reduce((acc, curr) => acc + (curr.downtimeMinutes || 0), 0);
    const avgDowntimeMinutes = total > 0 ? Math.round(downtimeSum / total) : 0;

    return {
      total,
      critical,
      inProgress,
      resolved,
      avgDowntimeMinutes,
    };
  }
}

// Singleton instance
export const incidentStore = new IncidentStore();
