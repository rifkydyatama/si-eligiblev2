// src/app/api/siswa/mendaftar-kipk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * POST: Siswa mendaftar KIP-K dari dashboard
 * Endpoint ini mengubah status mendaftarKIPK menjadi true
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body; // 'register' atau 'cancel'

    // Ambil data siswa berdasarkan userId dari session
    const siswa = await prisma.siswa.findFirst({
      where: {
        id: session.user.userId
      }
    });

    if (!siswa) {
      return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });
    }

    // Cek apakah sudah penerima KIP-K
    if (siswa.statusKIPK && action === 'register') {
      return NextResponse.json({ 
        error: 'Anda sudah terdaftar sebagai penerima KIP-K' 
      }, { status: 400 });
    }

    // Update status mendaftarKIPK
    const updatedSiswa = await prisma.siswa.update({
      where: { id: siswa.id },
      data: {
        mendaftarKIPK: action === 'register' ? true : false
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: 'siswa',
        action: action === 'register' ? 'daftar_kipk' : 'batal_daftar_kipk',
        description: `${siswa.nama} (${siswa.nisn}) ${action === 'register' ? 'mendaftar' : 'membatalkan'} KIP-K`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          siswaId: siswa.id,
          nisn: siswa.nisn,
          nama: siswa.nama
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: action === 'register' 
        ? 'Berhasil mendaftar KIP-K' 
        : 'Berhasil membatalkan pendaftaran KIP-K',
      mendaftarKIPK: updatedSiswa.mendaftarKIPK
    });

  } catch (error) {
    console.error('Error mendaftar KIP-K:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET: Cek status pendaftaran KIP-K siswa
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const siswa = await prisma.siswa.findFirst({
      where: {
        id: session.user.userId
      },
      select: {
        id: true,
        nisn: true,
        nama: true,
        statusKIPK: true,
        mendaftarKIPK: true
      }
    });

    if (!siswa) {
      return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      statusKIPK: siswa.statusKIPK,
      mendaftarKIPK: siswa.mendaftarKIPK,
      canRegister: !siswa.statusKIPK && !siswa.mendaftarKIPK
    });

  } catch (error) {
    console.error('Error get status KIP-K:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
