// src/app/api/admin/nilai/cleanup-absensi/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * DELETE /api/admin/nilai/cleanup-absensi
 * Menghapus nilai rapor dengan mata pelajaran A, S, I (data absensi yang tidak sengaja masuk)
 */
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Hapus semua nilai dengan mataPelajaran berupa huruf tunggal A, S, I
    const result = await prisma.nilaiRapor.deleteMany({
      where: {
        mataPelajaran: {
          in: ['A', 'S', 'I', 'a', 's', 'i']
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil menghapus ${result.count} data nilai absensi (A, S, I)`,
      deletedCount: result.count
    });

  } catch (error) {
    console.error('Error cleanup absensi:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus data nilai absensi' },
      { status: 500 }
    );
  }
}
