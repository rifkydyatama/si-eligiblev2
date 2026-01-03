// src/app/api/siswa/profile/route.ts
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

    const siswa = await prisma.siswa.findFirst({
      where: { id: session.user.userId },
      include: {
        jurusanSekolah: true
      }
    });

    if (!siswa) {
      return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      id: siswa.id,
      nisn: siswa.nisn,
      nama: siswa.nama,
      kelas: siswa.kelas,
      jurusan: siswa.jurusanSekolah?.nama || '-',
      statusKIPK: siswa.statusKIPK,
      mendaftarKIPK: siswa.mendaftarKIPK || false,
      email: siswa.email,
      noTelepon: siswa.noTelepon
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'siswa') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { mendaftarKIPK } = body;

    const siswa = await prisma.siswa.update({
      where: { id: session.user.userId },
      data: {
        mendaftarKIPK: mendaftarKIPK === true
      }
    });

    return NextResponse.json({
      success: true,
      mendaftarKIPK: siswa.mendaftarKIPK
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
