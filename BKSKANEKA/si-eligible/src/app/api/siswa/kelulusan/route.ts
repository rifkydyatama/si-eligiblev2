import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const kelulusanList = await prisma.kelulusan.findMany({
      where: {
        siswaId: session.user.userId
      },
      include: {
        kampus: {
          select: {
            id: true,
            namaKampus: true,
            jenisKampus: true,
            provinsi: true,
            kota: true
          }
        },
        jurusan: {
          select: {
            id: true,
            namaJurusan: true,
            jenjang: true,
            fakultas: true,
            akreditasi: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(kelulusanList);
  } catch (error) {
    console.error('Error fetching kelulusan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const status = formData.get('status') as string;
    const kampusNama = formData.get('kampusNama') as string;
    const jurusanNama = formData.get('jurusanNama') as string;
    const jalur = formData.get('jalur') as string;
    const buktiPenerimaan = formData.get('buktiPenerimaan') as File;

    if (!status || !jalur) {
      return NextResponse.json({ error: 'Status dan jalur wajib diisi' }, { status: 400 });
    }

    let kampusId: string | null = null;
    let jurusanId: string | null = null;

    // Untuk status lulus, kampus, jurusan, dan bukti penerimaan wajib diisi
    if (status === 'lulus') {
      if (!kampusNama || !jurusanNama) {
        return NextResponse.json({ error: 'Kampus dan jurusan wajib diisi untuk status lulus' }, { status: 400 });
      }
      if (!buktiPenerimaan) {
        return NextResponse.json({ error: 'Bukti penerimaan wajib diupload untuk status lulus' }, { status: 400 });
      }

      // Lookup kampus ID from namaKampus
      const kampus = await prisma.masterKampus.findFirst({
        where: { namaKampus: kampusNama }
      });
      
      if (!kampus) {
        return NextResponse.json({ error: 'Kampus tidak ditemukan' }, { status: 400 });
      }
      
      kampusId = kampus.id;

      // Lookup jurusan ID from namaJurusan and kampusId
      const jurusan = await prisma.masterJurusan.findFirst({
        where: { 
          namaJurusan: jurusanNama,
          kampusId: kampus.id
        }
      });
      
      if (!jurusan) {
        return NextResponse.json({ error: 'Jurusan tidak ditemukan untuk kampus tersebut' }, { status: 400 });
      }
      
      jurusanId = jurusan.id;
    }

    let buktiPenerimaanPath = '';

    // Handle file upload if bukti penerimaan is provided
    if (buktiPenerimaan) {
      const bytes = await buktiPenerimaan.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create uploads directory if it doesn't exist
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'kelulusan');
      try {
        await mkdir(uploadsDir, { recursive: true });
      } catch (error) {
        // Directory might already exist, continue
      }

      // Generate unique filename
      const filename = `${session.user.userId}_${Date.now()}_${buktiPenerimaan.name}`;
      const filepath = join(uploadsDir, filename);

      await writeFile(filepath, buffer);
      buktiPenerimaanPath = `/uploads/kelulusan/${filename}`;
    }

    // Create new kelulusan record for each submission
    const newKelulusan = await prisma.kelulusan.create({
      data: {
        siswaId: session.user.userId,
        status,
        kampusId: kampusId || null,
        jurusanId: jurusanId || null,
        jalur,
        buktiPenerimaan: buktiPenerimaanPath || null
      },
      include: {
        kampus: {
          select: {
            id: true,
            namaKampus: true,
            jenisKampus: true,
            provinsi: true,
            kota: true
          }
        },
        jurusan: {
          select: {
            id: true,
            namaJurusan: true,
            jenjang: true,
            fakultas: true,
            akreditasi: true
          }
        }
      }
    });
    return NextResponse.json(newKelulusan);
  } catch (error) {
    console.error('Error creating/updating kelulusan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deletedKelulusan = await prisma.kelulusan.deleteMany({
      where: {
        siswaId: session.user.userId
      }
    });

    return NextResponse.json({ success: true, deleted: deletedKelulusan.count });
  } catch (error) {
    console.error('Error deleting kelulusan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}