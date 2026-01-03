// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Bagian pengecekan session dihapus agar bisa diakses tanpa login

    // Mengambil statistik langsung dari database menggunakan prisma
    const [
      totalSiswa, 
      totalKIPK, 
      totalMendaftarKIPK,
      totalKelas12,
      totalNilaiVerified, 
      totalSanggahanPending, 
      totalKelulusan
    ] = await Promise.all([
      // Total semua siswa
      prisma.siswa.count(),
      
      // Total siswa penerima KIP-K
      prisma.siswa.count({
        where: {
          statusKIPK: true
        }
      }),
      
      // Total siswa yang mendaftar KIP-K
      prisma.siswa.count({
        where: {
          mendaftarKIPK: true
        }
      }),
      
      // Total siswa kelas XII
      prisma.siswa.count({
        where: {
          kelas: {
            startsWith: 'XII'
          }
        }
      }),
      
      // Total siswa dengan nilai terverifikasi
      prisma.siswa.count({
        where: {
          nilaiRapor: {
            some: {
              isVerified: true
            }
          }
        }
      }),
      
      // Total sanggahan pending
      prisma.sanggahan.count({
        where: {
          status: 'pending'
        }
      }),
      
      // Total siswa yang lulus (status lulus)
      prisma.kelulusan.count({
        where: {
          status: 'lulus'
        }
      })
    ]);

    // Total KIP-K gabungan (penerima + mendaftar)
    const totalNeuralKIPK = totalKIPK + totalMendaftarKIPK;

    return NextResponse.json({
      totalSiswa,
      totalKIPK,
      totalMendaftarKIPK,
      totalNeuralKIPK,
      totalKelas12,
      totalNilaiVerified,
      totalSanggahanPending,
      totalKelulusan
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}