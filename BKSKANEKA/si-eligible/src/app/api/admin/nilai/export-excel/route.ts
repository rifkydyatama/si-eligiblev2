import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

// Export nilai dengan EXACT MATCH dari headerIndex import - PDSS/PTKIN Ready
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { jurusanId, semester, tahunAkademikId } = body;

    // Get siswa dengan nilai rapor yang punya headerIndex (dari import)
    const siswa = await prisma.siswa.findMany({
      where: {
        ...(jurusanId && { jurusanId }),
        ...(tahunAkademikId && { tahunAkademikId })
      },
      include: {
        jurusanSekolah: true,
        nilaiRapor: {
          where: {
            ...(semester && { semester: parseInt(semester) }),
            headerIndex: { not: null } // Hanya ambil yang punya headerIndex tracking
          },
          orderBy: { headerIndex: 'asc' } // Sort by original Excel column position
        }
      }
    });

    if (siswa.length === 0) {
      return NextResponse.json({ 
        error: 'Tidak ada data siswa dengan nilai yang sudah diimport' 
      }, { status: 404 });
    }

    // === PHASE 1: RECONSTRUCT EXACT HEADERS FROM IMPORT ===
    // Kumpulkan semua unique mata pelajaran dengan headerIndex dari semua siswa
    const subjectMap = new Map<number, string>(); // headerIndex => mataPelajaran
    
    siswa.forEach(s => {
      s.nilaiRapor.forEach(n => {
        if (n.headerIndex !== null && !subjectMap.has(n.headerIndex)) {
          subjectMap.set(n.headerIndex, n.mataPelajaran);
        }
      });
    });

    // Sort by headerIndex untuk exact match dengan Excel asli
    const sortedSubjects = Array.from(subjectMap.entries())
      .sort((a, b) => a[0] - b[0]);

    // Create workbook dengan ExcelJS untuk styling yang lebih baik
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Nilai Rapor');

    // === PHASE 2: BUILD HEADER ROW (EXACT MATCH) ===
    const headerRow = worksheet.getRow(1);
    const headerCells = ['NISN', 'Nama', 'Kelas', 'Jurusan'];
    
    // Add subject headers sesuai urutan headerIndex asli
    sortedSubjects.forEach(([, subject]) => {
      headerCells.push(subject);
    });

    headerRow.values = headerCells;
    
    // Style header
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF1E40AF' } // Blue-600
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // === PHASE 3: FILL DATA ROWS ===
    siswa.forEach((s, index) => {
      const dataRow = worksheet.getRow(index + 2);
      const rowData: Array<string | number> = [
        `'${s.nisn}`, // Prefix dengan ' agar NISN tidak diformat sebagai number
        s.nama,
        s.kelas || '-',
        s.jurusanSekolah?.nama || '-'
      ];

      // Add nilai sesuai urutan headerIndex
      sortedSubjects.forEach(([headerIndex, subject]) => {
        const nilai = s.nilaiRapor.find(n => 
          n.headerIndex === headerIndex && 
          n.mataPelajaran === subject
        );
        rowData.push(nilai?.nilai || '');
      });

      dataRow.values = rowData;

      // Style data rows
      dataRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // NISN sebagai text (kolom 1)
        if (colNumber === 1) {
          cell.alignment = { horizontal: 'left' };
          cell.numFmt = '@'; // Text format
        } else if (colNumber > 4) {
          // Nilai columns - center aligned
          cell.alignment = { horizontal: 'center' };
          
          // Highlight jika nilai di bawah KKM (75)
          const nilaiValue = cell.value as number;
          if (typeof nilaiValue === 'number' && nilaiValue < 75) {
            cell.font = { color: { argb: 'FFDC2626' } }; // Red-600
          }
        }
      });
    });

    // === PHASE 4: AUTO-SIZE COLUMNS ===
    worksheet.columns.forEach((column, index) => {
      let maxLength = 10;
      
      // Check header length
      const headerCell = headerCells[index];
      if (headerCell) {
        maxLength = Math.max(maxLength, headerCell.toString().length + 2);
      }

      // Check data length (sample first 10 rows)
      for (let i = 2; i <= Math.min(12, siswa.length + 1); i++) {
        const cell = worksheet.getRow(i).getCell(index + 1);
        if (cell.value) {
          const cellLength = cell.value.toString().length;
          maxLength = Math.max(maxLength, cellLength + 2);
        }
      }

      column.width = Math.min(maxLength, 30); // Max width 30
    });

    // Freeze header row
    worksheet.views = [
      { state: 'frozen', xSplit: 0, ySplit: 1 }
    ];

    // === PHASE 5: GENERATE BUFFER ===
    const buffer = await workbook.xlsx.writeBuffer();

    // === PHASE 6: AUDIT LOG ===
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId || 'system',
        userType: session.user.role,
        action: 'export_nilai_excel',
        description: `Export nilai ${siswa.length} siswa dengan ${sortedSubjects.length} mata pelajaran (exact match)`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          jurusanId,
          semester,
          tahunAkademikId,
          totalSiswa: siswa.length,
          totalSubjects: sortedSubjects.length,
          subjects: sortedSubjects.map(([idx, name]) => ({ headerIndex: idx, name }))
        }
      }
    });

    // Return as Excel file
    const filename = `Nilai_Rapor_${jurusanId || 'All'}_${semester || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error('Error exporting nilai:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to export nilai' 
    }, { status: 500 });
  }
}
