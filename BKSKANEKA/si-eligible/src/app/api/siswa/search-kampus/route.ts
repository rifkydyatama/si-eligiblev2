// src/app/api/siswa/search-kampus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/siswa/search-kampus?query=universitas
 * Search kampus from local database
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const jenisKampus = searchParams.get('jenisKampus');

    if (!query || query.length < 3) {
      return NextResponse.json([], { status: 200 });
    }

    // Build where clause dynamically
    const whereClause: any = {
      isActive: true,
      namaKampus: {
        contains: query
      }
    };

    // Filter by jenisKampus if provided
    if (jenisKampus) {
      whereClause.jenisKampus = jenisKampus;
    }

    // Search kampus dari database lokal
    const kampusList = await prisma.masterKampus.findMany({
      where: whereClause,
      select: {
        id: true,
        namaKampus: true,
        jenisKampus: true,
        provinsi: true,
        kota: true,
        akreditasi: true
      },
      orderBy: {
        namaKampus: 'asc'
      },
      take: 10 // Limit hasil pencarian
    });

    return NextResponse.json(kampusList);
  } catch (error) {
    console.error('Error searching kampus:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
