import { NextRequest, NextResponse } from 'next/server';
import { incidentStore } from '@/lib/incidents/store';
import { validateCreateIncident } from '@/lib/incidents/validation';
import { ApiResponse, Incident } from '@/types/incident';

// GET /api/incidents — Ambil daftar insiden dengan filter & pagination
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Incident[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const severity = searchParams.get('severity') || undefined;
    const status = searchParams.get('status') || undefined;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;

    const result = incidentStore.getAll({
      search,
      category,
      severity,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.incidents,
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error('API Error GET /api/incidents:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal mengambil daftar catatan gangguan dari server.',
      },
      { status: 500 }
    );
  }
}

// POST /api/incidents — Tambah catatan insiden baru dengan validasi ketat
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<Incident>>> {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Format payload tidak valid. Harap kirimkan data JSON.',
        },
        { status: 400 }
      );
    }

    const validation = validateCreateIncident(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validasi form pelaporan gagal. Periksa kolom yang ditandai.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const newIncident = incidentStore.create(body as Parameters<typeof incidentStore.create>[0]);

    return NextResponse.json(
      {
        success: true,
        data: newIncident,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('API Error POST /api/incidents:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menyimpan laporan gangguan ke sistem.',
      },
      { status: 500 }
    );
  }
}
