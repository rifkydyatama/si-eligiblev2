// src/app/api/admin/nilai/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) return NextResponse.json({ error: 'Worksheet tidak ditemukan' }, { status: 400 });

    // --- LOGIKA SMART MAPPING (Mencari Kolom Otomatis) ---
    let colMap: { [key: string]: number } = {};
    const headerRow = worksheet.getRow(1);
    
    headerRow.eachCell((cell, colNumber) => {
      const headerText = cell.value?.toString().toLowerCase().trim() || '';
      if (headerText.includes('nisn')) colMap.nisn = colNumber;
      if (headerText.includes('semester')) colMap.semester = colNumber;
      if (headerText.includes('mapel') || headerText.includes('mata pelajaran') || headerText.includes('pelajaran')) colMap.subject = colNumber;
      if (headerText.includes('nilai') || headerText.includes('angka') || headerText.includes('skor')) colMap.score = colNumber;
    });

    if (!colMap.nisn || !colMap.semester || !colMap.subject || !colMap.score) {
      return NextResponse.json({ 
        error: 'Format kolom tidak dikenali. Pastikan ada kolom NISN, Semester, Mata Pelajaran, dan Nilai.' 
      }, { status: 400 });
    }

    let successCount = 0;
    let notFoundCount = 0;
    const errors: string[] = [];
    const rows: any[] = [];
    
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      rows.push(row);
    });

    for (const row of rows) {
      const nisn = row.getCell(colMap.nisn).value?.toString().trim();
      const semester = parseInt(row.getCell(colMap.semester).value?.toString() || '0');
      const subjectName = row.getCell(colMap.subject).value?.toString().trim();
      const score = parseFloat(row.getCell(colMap.score).value?.toString() || '0');

      if (!nisn || isNaN(semester) || !subjectName) continue;

      try {
        // 1. Cari Student berdasarkan NISN
        const student = await prisma.student.findUnique({ where: { nisn } });
        if (!student) {
          notFoundCount++;
          continue;
        }

        // 2. Cari atau Buat Subject (Mata Pelajaran)
        let subject = await prisma.subject.findFirst({
          where: { name: { equals: subjectName } }
        });

        if (!subject) {
          subject = await prisma.subject.create({
            data: { name: subjectName, isVocational: false }
          });
        }

        // 3. Upsert Grade (Nilai) - Menggunakan Unique Constraint
        await prisma.grade.upsert({
          where: {
            studentId_subjectId_semester: {
              studentId: student.id,
              subjectId: subject.id,
              semester: semester
            }
          },
          update: { score: score },
          create: {
            studentId: student.id,
            subjectId: subject.id,
            semester: semester,
            score: score
          }
        });

        successCount++;
      } catch (error) {
        console.error('Error row processing:', error);
        errors.push(`Gagal memproses baris ${row.number}: ${nisn}`);
      }
    }

    // 4. Log Audit sesuai Schema
    await prisma.auditLog.create({
      data: {
        adminId: Number(session.user.userId),
        action: 'import_nilai',
        details: `Import ${successCount} nilai e-Rapor. NISN tidak ditemukan: ${notFoundCount}`,
      }
    });

    return NextResponse.json({
      successCount,
      notFoundCount,
      totalRows: rows.length,
      errors
    });
  } catch (error) {
    console.error('Import Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}