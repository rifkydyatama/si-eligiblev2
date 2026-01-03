// src/app/api/siswa/sanggahan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json({ 
        error: 'Invalid JSON format. Please check request body.' 
      }, { status: 400 });
    }

    const { nilaiId, nilaiBaru, keterangan, buktiRapor } = body;

    if (!nilaiId || !nilaiBaru) {
      return NextResponse.json({ error: 'Data tidak lengkap' }, { status: 400 });
    }

    // Verify that the nilai belongs to the current user
    const nilai = await prisma.nilaiRapor.findFirst({
      where: {
        id: nilaiId,
        siswaId: session.user.userId
      }
    });

    if (!nilai) {
      return NextResponse.json({ error: 'Nilai tidak ditemukan' }, { status: 404 });
    }

    // Check if already has pending sanggahan
    const existingSanggahan = await prisma.sanggahan.findFirst({
      where: {
        siswaId: session.user.userId,
        semester: nilai.semester,
        mataPelajaran: nilai.mataPelajaran,
        status: 'pending'
      }
    });

    if (existingSanggahan) {
      return NextResponse.json({ 
        error: 'Sudah ada sanggahan yang sedang diproses untuk mata pelajaran ini' 
      }, { status: 400 });
    }

    // Create sanggahan record
    const sanggahan = await prisma.sanggahan.create({
      data: {
        siswaId: session.user.userId,
        nilaiId: nilai.id,  // Link ke NilaiRapor
        semester: nilai.semester,
        mataPelajaran: nilai.mataPelajaran,
        nilaiLama: nilai.nilai,
        nilaiBaru: parseFloat(nilaiBaru),
        buktiRapor: buktiRapor || null,  // Store base64 image or URL
        alasan: keterangan || 'Pengajuan koreksi nilai',  // Gunakan field alasan
        keterangan: keterangan || null,
        status: 'pending'
      }
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId || 'system',
        userType: 'siswa',
        action: 'create_sanggahan',
        description: `Sanggahan nilai ${nilai.mataPelajaran} semester ${nilai.semester}: ${nilai.nilai} → ${nilaiBaru}`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          sangahanId: sanggahan.id,
          mataPelajaran: nilai.mataPelajaran,
          semester: nilai.semester,
          nilaiLama: nilai.nilai,
          nilaiBaru
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: sanggahan
    });
  } catch (error) {
    console.error('Error creating sanggahan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Siswa melihat histori sanggahan mereka
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sanggahan = await prisma.sanggahan.findMany({
      where: {
        siswaId: session.user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: sanggahan
    });
  } catch (error) {
    console.error('Error fetching sanggahan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}