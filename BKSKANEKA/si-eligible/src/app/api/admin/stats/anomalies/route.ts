// src/app/api/admin/stats/anomalies/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // 1. Deteksi NISN duplikat
    const nisnDuplicates = await prisma.$queryRaw<Array<{ nisn: string; count: number }>>`
      SELECT nisn, COUNT(*) as count 
      FROM Siswa 
      GROUP BY nisn 
      HAVING count > 1
    `;

    // 2. Deteksi nama duplikat (kemungkinan NISN berbeda tapi orang sama)
    const namaDuplicates = await prisma.$queryRaw<Array<{ nama: string; count: number }>>`
      SELECT nama, COUNT(*) as count 
      FROM Siswa 
      GROUP BY nama 
      HAVING count > 1
    `;

    // 3. Deteksi email duplikat
    const emailDuplicates = await prisma.$queryRaw<Array<{ email: string; count: number }>>`
      SELECT email, COUNT(*) as count 
      FROM Siswa 
      WHERE email IS NOT NULL AND email != ''
      GROUP BY email 
      HAVING count > 1
    `;

    // 4. Deteksi nomor telepon duplikat
    const phoneDuplicates = await prisma.$queryRaw<Array<{ noTelepon: string; count: number }>>`
      SELECT noTelepon, COUNT(*) as count 
      FROM Siswa 
      WHERE noTelepon IS NOT NULL AND noTelepon != ''
      GROUP BY noTelepon 
      HAVING count > 1
    `;

    // 5. Get detailed records untuk setiap anomali
    const detailedAnomalies = await Promise.all([
      // NISN duplicates
      ...nisnDuplicates.map(async (dup) => {
        const students = await prisma.siswa.findMany({
          where: { nisn: dup.nisn },
          select: { id: true, nisn: true, nama: true, kelas: true, email: true, noTelepon: true }
        });
        return {
          type: 'NISN_DUPLICATE' as const,
          value: dup.nisn,
          count: Number(dup.count),
          students
        };
      }),
      
      // Nama duplicates
      ...namaDuplicates.map(async (dup) => {
        const students = await prisma.siswa.findMany({
          where: { nama: dup.nama },
          select: { id: true, nisn: true, nama: true, kelas: true, email: true, noTelepon: true }
        });
        return {
          type: 'NAMA_DUPLICATE' as const,
          value: dup.nama,
          count: Number(dup.count),
          students
        };
      }),

      // Email duplicates
      ...emailDuplicates.map(async (dup) => {
        const students = await prisma.siswa.findMany({
          where: { email: dup.email },
          select: { id: true, nisn: true, nama: true, kelas: true, email: true, noTelepon: true }
        });
        return {
          type: 'EMAIL_DUPLICATE' as const,
          value: dup.email,
          count: Number(dup.count),
          students
        };
      }),

      // Phone duplicates
      ...phoneDuplicates.map(async (dup) => {
        const students = await prisma.siswa.findMany({
          where: { noTelepon: dup.noTelepon },
          select: { id: true, nisn: true, nama: true, kelas: true, email: true, noTelepon: true }
        });
        return {
          type: 'PHONE_DUPLICATE' as const,
          value: dup.noTelepon,
          count: Number(dup.count),
          students
        };
      })
    ]);

    const resolvedAnomalies = await Promise.all(detailedAnomalies);

    return NextResponse.json({
      totalAnomalies: resolvedAnomalies.length,
      nisnDuplicates: resolvedAnomalies.filter(a => a.type === 'NISN_DUPLICATE').length,
      namaDuplicates: resolvedAnomalies.filter(a => a.type === 'NAMA_DUPLICATE').length,
      emailDuplicates: resolvedAnomalies.filter(a => a.type === 'EMAIL_DUPLICATE').length,
      phoneDuplicates: resolvedAnomalies.filter(a => a.type === 'PHONE_DUPLICATE').length,
      anomalies: resolvedAnomalies
    });
  } catch (error) {
    console.error('Error fetching anomalies:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
