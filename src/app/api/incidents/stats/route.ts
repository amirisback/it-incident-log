import { NextResponse } from 'next/server';
import { incidentStore } from '@/lib/incidents/store';
import { ApiResponse, IncidentStats } from '@/types/incident';

// GET /api/incidents/stats — Ambil statistik insiden untuk dasbor & mobile apps
export async function GET(): Promise<NextResponse<ApiResponse<IncidentStats>>> {
  try {
    const stats = incidentStore.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('API Error GET /api/incidents/stats:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil statistik catatan gangguan.',
      },
      { status: 500 }
    );
  }
}
