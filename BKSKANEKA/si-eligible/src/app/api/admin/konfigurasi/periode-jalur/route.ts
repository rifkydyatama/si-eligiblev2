// src/app/api/admin/konfigurasi/periode-jalur/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Ambil semua periode jalur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tahunAkademikId = searchParams.get('tahunAkademikId');

    const where = tahunAkademikId ? { tahunAkademikId } : {};

    const periodeJalur = await prisma.periodeJalur.findMany({
      where,
      orderBy: {
        tanggalBukaPendaftaran: 'asc'
      },
      include: {
        tahunAkademik: true
      }
    });

    return NextResponse.json(periodeJalur);
  } catch (error) {
    console.error('Error fetching periode jalur:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Tambah periode jalur baru
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      tahunAkademikId,
      jalur,
      namaJalur,
      tanggalBukaPendaftaran,
      tanggalTutupPendaftaran,
      tanggalPengumuman,
      isActive
    } = body;

    // Validasi
    if (!tahunAkademikId || !jalur || !namaJalur || !tanggalBukaPendaftaran || !tanggalTutupPendaftaran || !tanggalPengumuman) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    // Validasi urutan tanggal
    const tglBuka = new Date(tanggalBukaPendaftaran);
    const tglTutup = new Date(tanggalTutupPendaftaran);
    const tglPengumuman = new Date(tanggalPengumuman);

    if (tglBuka >= tglTutup || tglTutup >= tglPengumuman) {
      return NextResponse.json(
        { error: 'Urutan tanggal tidak valid' },
        { status: 400 }
      );
    }

    // Upsert periode jalur
    const periodeJalur = await prisma.periodeJalur.upsert({
      where: {
        tahunAkademikId_jalur: {
          tahunAkademikId,
          jalur
        }
      },
      update: {
        namaJalur,
        tanggalBukaPendaftaran: new Date(tanggalBukaPendaftaran),
        tanggalTutupPendaftaran: new Date(tanggalTutupPendaftaran),
        tanggalPengumuman: new Date(tanggalPengumuman),
        isActive: isActive ?? true
      },
      create: {
        tahunAkademikId,
        jalur,
        namaJalur,
        tanggalBukaPendaftaran: new Date(tanggalBukaPendaftaran),
        tanggalTutupPendaftaran: new Date(tanggalTutupPendaftaran),
        tanggalPengumuman: new Date(tanggalPengumuman),
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(periodeJalur);
  } catch (error) {
    console.error('Error saving periode jalur:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update periode jalur
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, isActive } = body;

    const periodeJalur = await prisma.periodeJalur.update({
      where: { id },
      data: { isActive }
    });

    return NextResponse.json(periodeJalur);
  } catch (error) {
    console.error('Error updating periode jalur:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
