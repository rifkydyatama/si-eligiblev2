import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Ambil konfigurasi kuota
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tahunAkademikId = searchParams.get('tahunAkademikId');

    const kuota = await prisma.konfigurasiKuota.findMany({
      where: tahunAkademikId ? { tahunAkademikId } : undefined,
      include: {
        tahunAkademik: true
      }
    });

    return NextResponse.json(kuota);
  } catch (error) {
    console.error('Error fetching kuota:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Simpan konfigurasi kuota
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
      jurusan,
      persenKuotaSekolah,
      minimalRataRata,
      metodePeRankingan
    } = body;

    // Upsert konfigurasi kuota
    const kuota = await prisma.konfigurasiKuota.upsert({
      where: {
        id: body.id || 'new'
      },
      update: {
        persenKuotaSekolah: parseFloat(persenKuotaSekolah),
        minimalRataRata: minimalRataRata ? parseFloat(minimalRataRata) : null,
        metodePeRankingan
      },
      create: {
        tahunAkademikId,
        jalur,
        jurusan,
        persenKuotaSekolah: parseFloat(persenKuotaSekolah),
        minimalRataRata: minimalRataRata ? parseFloat(minimalRataRata) : null,
        metodePeRankingan
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'update_konfigurasi_kuota',
        description: `Update konfigurasi kuota: ${jalur} - ${jurusan}`
      }
    });

    return NextResponse.json(kuota);
  } catch (error) {
    console.error('Error saving kuota:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
