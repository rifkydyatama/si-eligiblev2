// src/app/api/admin/kelas-management/promote/route.ts
/**
 * AUTO-PROMOTE KELAS SYSTEM
 * Automatically promotes students:
 * - Kelas X → Kelas XI
 * - Kelas XI → Kelas XII
 */

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mapping kelas promotion
    const promotionMap: Record<string, string> = {};
    
    // Generate mappings for all common class formats
    const jurusan = ['IPA', 'IPS', 'Bahasa', 'MIPA', 'IIS', 'IBB', 'TKJ', 'RPL', 'MM', 'AKL', 'OTKP', 'BDP', 'TKR', 'TBSM', 'TAV', 'TPM'];
    const angka = ['1', '2', '3', '4', '5'];
    
    // X → XI
    for (const jur of jurusan) {
      for (const num of angka) {
        promotionMap[`X ${jur} ${num}`] = `XI ${jur} ${num}`;
        promotionMap[`X-${jur}-${num}`] = `XI-${jur}-${num}`;
        promotionMap[`X.${jur}.${num}`] = `XI.${jur}.${num}`;
        promotionMap[`X${jur}${num}`] = `XI${jur}${num}`;
      }
    }
    
    // XI → XII
    for (const jur of jurusan) {
      for (const num of angka) {
        promotionMap[`XI ${jur} ${num}`] = `XII ${jur} ${num}`;
        promotionMap[`XI-${jur}-${num}`] = `XII-${jur}-${num}`;
        promotionMap[`XI.${jur}.${num}`] = `XII.${jur}.${num}`;
        promotionMap[`XI${jur}${num}`] = `XII${jur}${num}`;
      }
    }

    // Get all students to promote
    const studentsToPromote = await prisma.siswa.findMany({
      where: {
        kelas: {
          startsWith: 'X'
        }
      },
      select: {
        id: true,
        nisn: true,
        nama: true,
        kelas: true
      }
    });

    let promoted = 0;
    let notMapped = 0;
    const promotionLog: Array<{nisn: string; nama: string; from: string; to: string | null}> = [];

    // Process promotions in batches
    const batchSize = 50;
    for (let i = 0; i < studentsToPromote.length; i += batchSize) {
      const batch = studentsToPromote.slice(i, i + batchSize);
      
      const updatePromises = batch.map(async (student) => {
        const newKelas = promotionMap[student.kelas];
        
        if (newKelas) {
          await prisma.siswa.update({
            where: { id: student.id },
            data: { kelas: newKelas }
          });
          
          promoted++;
          promotionLog.push({
            nisn: student.nisn,
            nama: student.nama,
            from: student.kelas,
            to: newKelas
          });
        } else {
          notMapped++;
          promotionLog.push({
            nisn: student.nisn,
            nama: student.nama,
            from: student.kelas,
            to: null
          });
        }
      });

      await Promise.all(updatePromises);
    }

    return NextResponse.json({
      success: true,
      message: 'Kenaikan kelas berhasil diproses',
      stats: {
        totalProcessed: studentsToPromote.length,
        promoted,
        notMapped
      },
      log: promotionLog
    });

  } catch (error) {
    console.error('Error promoting students:', error);
    return NextResponse.json(
      { error: 'Gagal memproses kenaikan kelas', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
