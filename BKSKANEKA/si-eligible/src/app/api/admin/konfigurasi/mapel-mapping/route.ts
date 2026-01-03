import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// Interface untuk mapping mata pelajaran
interface MataPelajaranMapping {
  id: string;
  semester: number;
  kolomDapodik: string; // Nama kolom di file Dapodik
  kolomPDSS: string; // Nama kolom di template PDSS
  kolomPTKIN: string; // Nama kolom di template PTKIN
  namaMapel: string;
  kategori: string; // 'wajib', 'peminatan', 'lintas_minat'
  kurikulum: string; // 'Merdeka', '2013'
  jurusanId?: string; // Optional: specific untuk jurusan tertentu
  isActive: boolean;
}

// GET: Ambil daftar mata pelajaran unik dari database
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');

    // Ambil mata pelajaran unik dari NilaiRapor yang sudah diimport
    const where = {
      mataPelajaran: {
        notIn: ['A', 'S', 'I', 'a', 's', 'i'] // Exclude absensi
      },
      ...(semester && { semester: parseInt(semester) })
    };

    const mataPelajaranList = await prisma.nilaiRapor.groupBy({
      by: ['mataPelajaran', 'semester'],
      where,
      _count: {
        id: true
      },
      orderBy: [
        { semester: 'asc' },
        { mataPelajaran: 'asc' }
      ]
    });

    // Transform ke format mapping
    const mappings: MataPelajaranMapping[] = mataPelajaranList.map((item) => {
      const mapelName = item.mataPelajaran;
      const sem = item.semester;
      
      return {
        id: `${sem}-${mapelName.replace(/\s+/g, '-').toLowerCase()}`,
        semester: sem,
        kolomDapodik: mapelName,
        kolomPDSS: mapelName,
        kolomPTKIN: mapelName,
        namaMapel: mapelName,
        kategori: 'wajib', // Default kategori
        kurikulum: 'Merdeka',
        isActive: true
      };
    });

    return NextResponse.json(mappings);
  } catch (error) {
    console.error('Error fetching mapel mapping:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Tambah/Update mapping mata pelajaran
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: MataPelajaranMapping = await request.json();
    
    if (!body.semester || !body.namaMapel || !body.kolomDapodik) {
      return NextResponse.json(
        { error: 'Data mapping tidak lengkap' },
        { status: 400 }
      );
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'create_mapel_mapping',
        description: `Tambah mapping: ${body.namaMapel} Semester ${body.semester}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          namaMapel: body.namaMapel,
          semester: body.semester,
          kolomDapodik: body.kolomDapodik,
          kolomPDSS: body.kolomPDSS,
          kolomPTKIN: body.kolomPTKIN,
          kategori: body.kategori,
          kurikulum: body.kurikulum
        }
      }
    });

    // Return data (nanti akan disimpan ke database)
    const newMapping: MataPelajaranMapping = {
      ...body,
      id: body.id || `mapping-${Date.now()}`,
      isActive: body.isActive !== false
    };

    return NextResponse.json(newMapping, { status: 201 });
  } catch (error) {
    console.error('Error creating mapping:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update mapping
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: MataPelajaranMapping = await request.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'update_mapel_mapping',
        description: `Update mapping: ${body.namaMapel}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          id: body.id,
          namaMapel: body.namaMapel,
          semester: body.semester,
          kolomDapodik: body.kolomDapodik,
          kolomPDSS: body.kolomPDSS,
          kolomPTKIN: body.kolomPTKIN,
          kategori: body.kategori,
          kurikulum: body.kurikulum
        }
      }
    });

    return NextResponse.json(body);
  } catch (error) {
    console.error('Error updating mapping:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Hapus mapping
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'delete_mapel_mapping',
        description: `Hapus mapping ID: ${id}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          mappingId: id
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting mapping:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
