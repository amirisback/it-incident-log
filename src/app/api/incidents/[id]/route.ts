import { NextRequest, NextResponse } from 'next/server';
import { incidentStore } from '@/lib/incidents/store';
import { validateUpdateIncident } from '@/lib/incidents/validation';
import { ApiResponse, Incident } from '@/types/incident';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/incidents/[id] — Ambil detail 1 insiden berdasarkan ID atau Nomor Tiket
export async function GET(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Incident>>> {
  try {
    const { id } = await context.params;
    const incident = incidentStore.getByIdOrTicket(id);

    if (!incident) {
      return NextResponse.json(
        {
          success: false,
          error: `Catatan gangguan dengan ID atau nomor tiket '${id}' tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: incident,
    });
  } catch (error) {
    console.error('API Error GET /api/incidents/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Terjadi kesalahan internal saat mengambil detail gangguan.',
      },
      { status: 500 }
    );
  }
}

// PUT /api/incidents/[id] — Perbarui catatan insiden dengan validasi
export async function PUT(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<Incident>>> {
  try {
    const { id } = await context.params;
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

    const validation = validateUpdateIncident(body);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validasi pembaruan insiden gagal.',
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const updated = incidentStore.update(id, body as Parameters<typeof incidentStore.update>[1]);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: `Insiden dengan referensi '${id}' tidak ditemukan untuk diperbarui.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error('API Error PUT /api/incidents/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal memperbarui catatan gangguan pada server.',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/incidents/[id] — Hapus catatan insiden
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ApiResponse<{ message: string; deletedId: string }>>> {
  try {
    const { id } = await context.params;
    const deleted = incidentStore.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: `Catatan gangguan dengan referensi '${id}' tidak ditemukan.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Catatan gangguan berhasil dihapus secara permanen.',
        deletedId: id,
      },
    });
  } catch (error) {
    console.error('API Error DELETE /api/incidents/[id]:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Gagal menghapus catatan gangguan dari server.',
      },
      { status: 500 }
    );
  }
}
