// src/app/api/admin/kampus/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const kampus = await prisma.masterKampus.findUnique({
      where: { id: id },
      include: {
        jurusan: {
          orderBy: { namaJurusan: 'asc' }
        }
      }
    });

    if (!kampus) {
      return NextResponse.json({ error: 'Kampus tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(kampus);
  } catch (error) {
    console.error('Error fetching kampus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Accept all editable fields coming from the form
    const {
      kodeKampus,
      namaKampus,
      jenisKampus,
      kategoriJalur,
      akreditasi,
      kota,
      provinsi,
      website,
      logoUrl,
      isActive,
    } = body as Record<string, any>;

    const data: Record<string, any> = {};
    if (kodeKampus !== undefined) data.kodeKampus = kodeKampus;
    if (namaKampus !== undefined) data.namaKampus = namaKampus;
    if (jenisKampus !== undefined) data.jenisKampus = jenisKampus;
    if (kategoriJalur !== undefined) data.kategoriJalur = kategoriJalur;
    if (akreditasi !== undefined) data.akreditasi = akreditasi;
    if (kota !== undefined) data.kota = kota;
    if (provinsi !== undefined) data.provinsi = provinsi;
    if (website !== undefined) data.website = website;
    if (logoUrl !== undefined) data.logoUrl = logoUrl;
    if (isActive !== undefined) data.isActive = isActive;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'No updatable fields provided' }, { status: 400 });
    }

    try {
      const updated = await prisma.masterKampus.update({
        where: { id },
        data,
      });
      return NextResponse.json(updated);
    } catch (e: any) {
      // Prisma will throw when record not found (P2025)
      console.error('Prisma update error:', e);
      return NextResponse.json({ error: 'Kampus not found or update failed' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating kampus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}