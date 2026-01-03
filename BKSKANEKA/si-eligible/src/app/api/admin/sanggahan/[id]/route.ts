// src/app/api/admin/sanggahan/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status, alasan } = await request.json();

    const sanggahan = await prisma.sanggahan.findUnique({
      where: { id },
      include: { siswa: true }
    });

    if (!sanggahan) {
      return NextResponse.json({ error: 'Sanggahan tidak ditemukan' }, { status: 404 });
    }

    // Gunakan transaction untuk update atomic
    const result = await prisma.$transaction(async (tx) => {
      // Update sanggahan
      const updated = await tx.sanggahan.update({
        where: { id },
        data: {
          status,
          alasan: status === 'rejected' ? (alasan || 'Tidak ada alasan yang diberikan') : null,
          reviewedBy: session.user.userId,
          reviewedAt: new Date()
        }
      });

      // Jika approved, update nilai di database dan set isVerified = true
      if (status === 'approved') {
        await tx.nilaiRapor.updateMany({
          where: {
            siswaId: sanggahan.siswaId,
            semester: sanggahan.semester,
            mataPelajaran: sanggahan.mataPelajaran
          },
          data: {
            nilai: sanggahan.nilaiBaru,
            isVerified: true  // Set verified setelah approved
          }
        });
      }

      // Log audit dalam transaction
      await tx.auditLog.create({
        data: {
          userId: session.user.userId || 'system',
          userType: session.user.role,
          action: status === 'approved' ? 'approve_sanggahan' : 'reject_sanggahan',
          description: `${status === 'approved' ? 'Menyetujui' : 'Menolak'} sanggahan ${sanggahan.siswa.nama} - ${sanggahan.mataPelajaran}`,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          metadata: {
            sangahanId: sanggahan.id,
            siswaId: sanggahan.siswaId,
            mataPelajaran: sanggahan.mataPelajaran,
            semester: sanggahan.semester,
            status
          }
        }
      });

      return updated;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating sanggahan:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}