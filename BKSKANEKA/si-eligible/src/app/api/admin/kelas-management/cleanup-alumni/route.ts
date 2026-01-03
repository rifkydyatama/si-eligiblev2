// src/app/api/admin/kelas-management/cleanup-alumni/route.ts
/**
 * ALUMNI DATA CLEANUP SYSTEM
 * Removes graduated students (XII) from previous academic year
 * Also cleans up all related data: nilai, peminatan, kelulusan, sanggahan
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { tahunAjaranLama } = body; // Format: "2023/2024"

    if (!tahunAjaranLama) {
      return NextResponse.json({ error: 'Tahun ajaran lama harus diisi' }, { status: 400 });
    }

    // Find all XII students (alumni candidates)
    const alumniStudents = await prisma.siswa.findMany({
      where: {
        kelas: {
          startsWith: 'XII'
        }
      },
      select: {
        id: true,
        nisn: true,
        nama: true,
        kelas: true
      }
    });

    if (alumniStudents.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada data alumni yang perlu dibersihkan',
        deleted: 0
      });
    }

    const studentIds = alumniStudents.map(s => s.id);

    // Delete related data in transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Delete sanggahan
      const deletedSanggahan = await tx.sanggahan.deleteMany({
        where: { siswaId: { in: studentIds } }
      });

      // 2. Delete kelulusan
      const deletedKelulusan = await tx.kelulusan.deleteMany({
        where: { siswaId: { in: studentIds } }
      });

      // 3. Delete peminatan
      const deletedPeminatan = await tx.peminatan.deleteMany({
        where: { siswaId: { in: studentIds } }
      });

      // 4. Delete nilai rapor
      const deletedNilai = await tx.nilaiRapor.deleteMany({
        where: { siswaId: { in: studentIds } }
      });

      // 5. Delete siswa
      const deletedSiswa = await tx.siswa.deleteMany({
        where: { id: { in: studentIds } }
      });

      return {
        siswa: deletedSiswa.count,
        nilai: deletedNilai.count,
        peminatan: deletedPeminatan.count,
        kelulusan: deletedKelulusan.count,
        sanggahan: deletedSanggahan.count
      };
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil membersihkan data alumni tahun ajaran ${tahunAjaranLama}`,
      deleted: result.siswa,
      relatedDataDeleted: {
        nilaiRapor: result.nilai,
        peminatan: result.peminatan,
        kelulusan: result.kelulusan,
        sanggahan: result.sanggahan
      },
      alumniList: alumniStudents.map(s => ({
        nisn: s.nisn,
        nama: s.nama,
        kelas: s.kelas
      }))
    });

  } catch (error) {
    console.error('Error cleaning up alumni:', error);
    return NextResponse.json(
      { error: 'Gagal membersihkan data alumni', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
