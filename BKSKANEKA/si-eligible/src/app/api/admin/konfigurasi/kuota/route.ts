// src/app/api/admin/konfigurasi/kuota/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Ambil konfigurasi kuota
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tahunAkademikId = searchParams.get('tahunAkademikId');

    const where = tahunAkademikId ? { tahunAkademikId } : {};

    const konfigurasiKuota = await prisma.konfigurasiKuota.findMany({
      where,
      orderBy: [
        { jalur: 'asc' },
        { jurusan: 'asc' }
      ],
      include: {
        tahunAkademik: true
      }
    });

    return NextResponse.json(konfigurasiKuota);
  } catch (error) {
    console.error('Error fetching konfigurasi kuota:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Tambah/update konfigurasi kuota
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

    // Validasi
    if (!tahunAkademikId || !jalur || !jurusan) {
      return NextResponse.json(
        { error: 'Data tidak lengkap' },
        { status: 400 }
      );
    }

    if (persenKuotaSekolah < 0 || persenKuotaSekolah > 100) {
      return NextResponse.json(
        { error: 'Persentase kuota harus 0-100' },
        { status: 400 }
      );
    }

    // Upsert konfigurasi
    const konfigurasi = await prisma.konfigurasiKuota.upsert({
      where: {
        tahunAkademikId_jalur_jurusan: {
          tahunAkademikId,
          jalur,
          jurusan
        }
      },
      update: {
        persenKuotaSekolah: parseFloat(persenKuotaSekolah),
        minimalRataRata: parseFloat(minimalRataRata),
        metodePeRankingan: metodePeRankingan || 'rata-rata-murni'
      },
      create: {
        tahunAkademikId,
        jalur,
        jurusan,
        persenKuotaSekolah: parseFloat(persenKuotaSekolah),
        minimalRataRata: parseFloat(minimalRataRata),
        metodePeRankingan: metodePeRankingan || 'rata-rata-murni'
      }
    });

    return NextResponse.json(konfigurasi);
  } catch (error) {
    console.error('Error saving konfigurasi kuota:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
