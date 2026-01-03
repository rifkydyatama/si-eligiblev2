// src/app/api/siswa/nilai/route.ts
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

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');

    // Get siswa dengan nilai rapor
    const siswa = await prisma.siswa.findFirst({
      where: { 
        id: session.user.userId
      },
      include: {
        jurusanSekolah: true,
        nilaiRapor: {
          where: {
            mataPelajaran: {
              notIn: ['A', 'S', 'I', 'a', 's', 'i'] // Exclude absensi columns
            },
            ...(semester ? { semester: parseInt(semester) } : {})
          },
          include: {
            sanggahan: {
              orderBy: { createdAt: 'desc' },
              take: 1 // Ambil sanggahan terbaru saja
            }
          },
          orderBy: [
            { semester: 'asc' },
            { mataPelajaran: 'asc' }
          ]
        }
      }
    });

    if (!siswa) {
      return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });
    }

    // Group nilai by semester
    const nilaiPerSemester: Record<number, any[]> = {};
    
    siswa.nilaiRapor.forEach(nilai => {
      if (!nilaiPerSemester[nilai.semester]) {
        nilaiPerSemester[nilai.semester] = [];
      }
      
      nilaiPerSemester[nilai.semester].push({
        id: nilai.id,
        mataPelajaran: nilai.mataPelajaran,
        nilai: nilai.nilai,
        isVerified: nilai.isVerified,
        semester: nilai.semester,
        createdAt: nilai.createdAt,
        updatedAt: nilai.updatedAt,
        sanggahan: nilai.sanggahan // Include sanggahan data
      });
    });

    // Calculate statistics per semester
    const statsPerSemester: Record<number, any> = {};
    Object.keys(nilaiPerSemester).forEach(sem => {
      const semNumber = parseInt(sem);
      const nilaiSem = nilaiPerSemester[semNumber];
      statsPerSemester[semNumber] = {
        totalMapel: nilaiSem.length,
        verified: nilaiSem.filter(n => n.isVerified).length,
        unverified: nilaiSem.filter(n => !n.isVerified).length,
        rataRata: nilaiSem.reduce((sum, n) => sum + n.nilai, 0) / nilaiSem.length
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        siswa: {
          nisn: siswa.nisn,
          nama: siswa.nama,
          kelas: siswa.kelas,
          jurusan: siswa.jurusanSekolah?.nama || '-'
        },
        nilaiPerSemester,
        statsPerSemester,
        totalStats: {
          totalNilai: siswa.nilaiRapor.length,
          verified: siswa.nilaiRapor.filter(n => n.isVerified).length,
          unverified: siswa.nilaiRapor.filter(n => !n.isVerified).length,
          rataRataKeseluruhan: siswa.nilaiRapor.length > 0 
            ? siswa.nilaiRapor.reduce((sum, n) => sum + n.nilai, 0) / siswa.nilaiRapor.length 
            : 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching nilai:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}