// src/app/api/siswa/search-jurusan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/siswa/search-jurusan?kampusId=xxx
 * Get jurusan list by kampus ID from local database
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const kampusId = searchParams.get('kampusId');

    if (!kampusId) {
      return NextResponse.json([], { status: 200 });
    }

    // Get jurusan berdasarkan kampus ID
    const jurusanList = await prisma.masterJurusan.findMany({
      where: {
        isActive: true,
        kampusId: kampusId
      },
      select: {
        id: true,
        namaJurusan: true,
        jenjang: true,
        fakultas: true,
        akreditasi: true
      },
      orderBy: {
        namaJurusan: 'asc'
      }
    });

    return NextResponse.json(jurusanList);
  } catch (error) {
    console.error('Error fetching jurusan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
