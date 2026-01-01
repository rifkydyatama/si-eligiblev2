import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

// GET: Ambil daftar jurusan sekolah
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jurusan = await prisma.jurusanSekolah.findMany({
      orderBy: [
        { tingkat: 'asc' },
        { kode: 'asc' }
      ],
      include: {
        _count: {
          select: { siswa: true }
        }
      }
    });

    return NextResponse.json(jurusan);
  } catch (error) {
    console.error('Error fetching jurusan sekolah:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Tambah jurusan sekolah baru
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { kode, nama, tingkat, isActive } = body;

    if (!kode || !nama || !tingkat) {
      return NextResponse.json(
        { error: 'Kode, nama, dan tingkat wajib diisi' },
        { status: 400 }
      );
    }

    // Cek duplikasi kode
    const existing = await prisma.jurusanSekolah.findUnique({
      where: { kode: kode.toUpperCase() }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Kode jurusan sudah digunakan' },
        { status: 400 }
      );
    }

    const newJurusan = await prisma.jurusanSekolah.create({
      data: {
        kode: kode.toUpperCase(),
        nama,
        tingkat,
        isActive: isActive !== false
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'create_jurusan_sekolah',
        description: `Menambahkan jurusan sekolah: ${nama} (${kode})`
      }
    });

    return NextResponse.json(newJurusan, { status: 201 });
  } catch (error) {
    console.error('Error creating jurusan sekolah:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Update jurusan sekolah
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, kode, nama, tingkat, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    // Cek apakah jurusan sedang digunakan oleh siswa
    const jurusanWithSiswa = await prisma.jurusanSekolah.findUnique({
      where: { id },
      include: {
        _count: {
          select: { siswa: true }
        }
      }
    });

    if (!jurusanWithSiswa) {
      return NextResponse.json(
        { error: 'Jurusan tidak ditemukan. Silakan refresh halaman.' },
        { status: 404 }
      );
    }

    if (jurusanWithSiswa._count.siswa > 0 && !isActive) {
      return NextResponse.json(
        { error: `Tidak dapat menonaktifkan jurusan. Masih ada ${jurusanWithSiswa._count.siswa} siswa terdaftar.` },
        { status: 400 }
      );
    }

    const updatedJurusan = await prisma.jurusanSekolah.update({
      where: { id },
      data: {
        kode: kode.toUpperCase(),
        nama,
        tingkat,
        isActive
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'update_jurusan_sekolah',
        description: `Update jurusan sekolah: ${nama} (${kode})`
      }
    });

    return NextResponse.json(updatedJurusan);
  } catch (error) {
    console.error('Error updating jurusan sekolah:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: Hapus jurusan sekolah
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

    // Cek apakah jurusan sedang digunakan
    const jurusanWithSiswa = await prisma.jurusanSekolah.findUnique({
      where: { id },
      include: {
        _count: {
          select: { siswa: true }
        }
      }
    });

    if (jurusanWithSiswa && jurusanWithSiswa._count.siswa > 0) {
      return NextResponse.json(
        { error: `Tidak dapat menghapus jurusan. Masih ada ${jurusanWithSiswa._count.siswa} siswa terdaftar.` },
        { status: 400 }
      );
    }

    await prisma.jurusanSekolah.delete({
      where: { id }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'delete_jurusan_sekolah',
        description: `Hapus jurusan sekolah ID: ${id}`
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting jurusan sekolah:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
