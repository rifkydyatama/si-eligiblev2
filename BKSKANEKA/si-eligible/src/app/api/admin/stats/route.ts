// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Bagian pengecekan session dihapus agar bisa diakses tanpa login

    // Mengambil statistik langsung dari database menggunakan prisma
    const [totalSiswa, totalNilaiVerified, totalSanggahanPending, totalKelulusan] = await Promise.all([
      prisma.siswa.count(),
      prisma.siswa.count({
        where: {
          nilaiRapor: {
            some: {
              isVerified: true
            }
          }
        }
      }),
      prisma.sanggahan.count({
        where: {
          status: 'pending'
        }
      }),
      prisma.kelulusan.count({
        where: {
          status: 'diterima'
        }
      })
    ]);

    return NextResponse.json({
      totalSiswa,
      totalNilaiVerified,
      totalSanggahanPending,
      totalKelulusan
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}