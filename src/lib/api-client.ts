import {
  Incident,
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentQueryParams,
  IncidentStats,
  ApiResponse,
} from '@/types/incident';

const BASE_URL = typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

async function handleResponse<T>(res: Response): Promise<ApiResponse<T>> {
  const json: ApiResponse<T> = await res.json();
  if (!res.ok && !json.error) {
    throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
  }
  return json;
}

export async function fetchIncidents(params: IncidentQueryParams = {}): Promise<ApiResponse<Incident[]>> {
  const searchParams = new URLSearchParams();

  if (params.search) searchParams.set('search', params.search);
  if (params.category && params.category !== 'Semua') searchParams.set('category', params.category);
  if (params.severity && params.severity !== 'Semua') searchParams.set('severity', params.severity);
  if (params.status && params.status !== 'Semua') searchParams.set('status', params.status);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const query = searchParams.toString();
  const url = `${BASE_URL}/api/incidents${query ? `?${query}` : ''}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<Incident[]>(res);
}

export async function fetchIncidentById(idOrTicket: string): Promise<ApiResponse<Incident>> {
  const url = `${BASE_URL}/api/incidents/${encodeURIComponent(idOrTicket)}`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<Incident>(res);
}

export async function fetchIncidentStats(): Promise<ApiResponse<IncidentStats>> {
  const url = `${BASE_URL}/api/incidents/stats`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  return handleResponse<IncidentStats>(res);
}

export async function createIncident(data: CreateIncidentDto): Promise<ApiResponse<Incident>> {
  const url = `${BASE_URL}/api/incidents`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Incident>(res);
}

export async function updateIncident(id: string, data: UpdateIncidentDto): Promise<ApiResponse<Incident>> {
  const url = `${BASE_URL}/api/incidents/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return handleResponse<Incident>(res);
}

export async function deleteIncident(id: string): Promise<ApiResponse<{ message: string; deletedId: string }>> {
  const url = `${BASE_URL}/api/incidents/${encodeURIComponent(id)}`;

  const res = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<{ message: string; deletedId: string }>(res);
}
