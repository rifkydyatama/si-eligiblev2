// src/app/api/siswa/timeline/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get active academic year
    const activeTahunAkademik = await prisma.tahunAkademik.findFirst({
      where: { isActive: true }
    });

    if (!activeTahunAkademik) {
      return NextResponse.json([]);
    }

    // Get all periode jalur for active academic year
    const periodeJalur = await prisma.periodeJalur.findMany({
      where: {
        tahunAkademikId: activeTahunAkademik.id,
        isActive: true
      },
      orderBy: {
        tanggalBukaPendaftaran: 'asc'
      },
      select: {
        id: true,
        jalur: true,
        namaJalur: true,
        tanggalBukaPendaftaran: true,
        tanggalTutupPendaftaran: true,
        tanggalPengumuman: true
      }
    });

    // Transform to match TimelineEntry interface
    const timeline = periodeJalur.map(p => ({
      id: p.id,
      jalur: p.namaJalur || p.jalur,
      tanggalMulai: p.tanggalBukaPendaftaran.toISOString(),
      tanggalSelesai: p.tanggalTutupPendaftaran.toISOString()
    }));

    return NextResponse.json(timeline);
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
