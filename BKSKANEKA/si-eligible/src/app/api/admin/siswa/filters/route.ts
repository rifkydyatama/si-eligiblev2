// src/app/api/admin/siswa/filters/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET: Ambil daftar kelas dan jurusan yang unik dari data siswa yang sudah diimport
 * Endpoint ini mengekstrak nilai kelas dan jurusan dari database untuk digunakan sebagai filter
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ambil semua siswa dengan distinct kelas
    const siswaData = await prisma.siswa.findMany({
      select: {
        kelas: true,
        jurusanSekolah: {
          select: {
            id: true,
            kode: true,
            nama: true
          }
        }
      }
    });

    // Extract unique kelas
    const kelasSet = new Set<string>();
    const jurusanMap = new Map<string, { id: string; kode: string; nama: string }>();

    siswaData.forEach(siswa => {
      if (siswa.kelas) {
        kelasSet.add(siswa.kelas);
      }
      if (siswa.jurusanSekolah) {
        jurusanMap.set(siswa.jurusanSekolah.id, siswa.jurusanSekolah);
      }
    });

    // Parsing kelas untuk mendapatkan tingkat, jurusan, dan nomor rombel
    interface KelasParsed {
      original: string;
      tingkat: string;
      jurusan: string;
      rombel: string;
      sortKey: string;
    }

    const kelasList: KelasParsed[] = Array.from(kelasSet).map(kelas => {
      // Format: "XII TKR 5" atau "X PM 2"
      const match = kelas.match(/^([X]+I*)\s+([A-Z]+)\s+(\d+)$/);
      
      if (match) {
        const tingkat = match[1]; // XII, XI, X
        const jurusan = match[2]; // TKR, PM, TJKT, dll
        const rombel = match[3];  // 1, 2, 3, dll
        
        // Sort key: tingkat (desc), jurusan (asc), rombel (asc)
        const tingkatNum = tingkat === 'XII' ? 3 : tingkat === 'XI' ? 2 : 1;
        const sortKey = `${tingkatNum}-${jurusan}-${rombel.padStart(2, '0')}`;
        
        return {
          original: kelas,
          tingkat,
          jurusan,
          rombel,
          sortKey
        };
      }
      
      // Fallback jika format tidak sesuai
      return {
        original: kelas,
        tingkat: kelas.split(' ')[0] || '',
        jurusan: kelas.split(' ')[1] || '',
        rombel: kelas.split(' ')[2] || '',
        sortKey: kelas
      };
    });

    // Sort kelas: XII → XI → X, lalu by jurusan, lalu by rombel
    kelasList.sort((a, b) => {
      // Descending tingkat (XII first)
      if (a.sortKey < b.sortKey) return -1;
      if (a.sortKey > b.sortKey) return 1;
      return 0;
    });

    // Extract unique tingkat dan jurusan dari kelas
    const tingkatSet = new Set<string>();
    const jurusanFromKelasSet = new Set<string>();

    kelasList.forEach(k => {
      tingkatSet.add(k.tingkat);
      if (k.jurusan) jurusanFromKelasSet.add(k.jurusan);
    });

    return NextResponse.json({
      kelas: kelasList.map(k => k.original),
      tingkat: Array.from(tingkatSet).sort((a, b) => {
        const order = { 'XII': 0, 'XI': 1, 'X': 2 };
        return (order[a as keyof typeof order] || 99) - (order[b as keyof typeof order] || 99);
      }),
      jurusanKelas: Array.from(jurusanFromKelasSet).sort(),
      jurusanSekolah: Array.from(jurusanMap.values()).sort((a, b) => a.kode.localeCompare(b.kode)),
      stats: {
        totalKelas: kelasList.length,
        totalTingkat: tingkatSet.size,
        totalJurusan: jurusanFromKelasSet.size,
        totalJurusanSekolah: jurusanMap.size
      }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
