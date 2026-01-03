// src/app/api/admin/nilai/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';
import { Buffer } from 'buffer';

// Intelligent header mapping untuk compatibility dengan berbagai template
const HEADER_PATTERNS = {
  nisn: ['nisn', 'nis', 'nomor induk'],
  nama: ['nama', 'name', 'siswa', 'student'],
  semester: ['semester', 'sem', 'smt'],
  jurusan: ['jurusan', 'program', 'kompetensi', 'keahlian', 'major'],
  tingkat: ['tingkat', 'kelas', 'grade', 'class'],
  rombel: ['rombel', 'rombongan', 'kelas'],
};

// Mapping mata pelajaran dari berbagai format (PDSS, PTKIN, e-Rapor, dll)
const SUBJECT_NORMALIZATION: Record<string, string> = {
  'pendidikan agama': 'Pendidikan Agama dan Budi Pekerti',
  'pai': 'Pendidikan Agama dan Budi Pekerti',
  'pkn': 'Pendidikan Pancasila dan Kewarganegaraan',
  'ppkn': 'Pendidikan Pancasila dan Kewarganegaraan',
  'bahasa indonesia': 'Bahasa Indonesia',
  'b. indonesia': 'Bahasa Indonesia',
  'matematika': 'Matematika',
  'mtk': 'Matematika',
  'ipa': 'IPA',
  'fisika': 'Fisika',
  'kimia': 'Kimia',
  'biologi': 'Biologi',
  'ips': 'IPS',
  'sejarah': 'Sejarah Indonesia',
  'geografi': 'Geografi',
  'ekonomi': 'Ekonomi',
  'sosiologi': 'Sosiologi',
  'bahasa inggris': 'Bahasa Inggris',
  'b. inggris': 'Bahasa Inggris',
  'english': 'Bahasa Inggris',
  'pjok': 'PJOK',
  'penjas': 'PJOK',
  'seni budaya': 'Seni Budaya',
  'prakarya': 'Prakarya',
};

function normalizeSubjectName(rawName: string): string {
  const lower = rawName.toLowerCase().trim();
  return SUBJECT_NORMALIZATION[lower] || rawName;
}

function matchHeader(headerText: string, patterns: string[]): boolean {
  const lower = headerText.toLowerCase().trim();
  return patterns.some(pattern => lower.includes(pattern));
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const jurusanId = formData.get('jurusanId') as string | null;
    const semester = formData.get('semester') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(arrayBuffer));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as Buffer);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({ error: 'Worksheet tidak ditemukan' }, { status: 400 });
    }

    // === PHASE 1: INTELLIGENT HEADER DETECTION ===
    // Auto-detect header row (skip school info rows)
    let headerRowNumber = 1;
    let headerRow = worksheet.getRow(1);
    
    // Try to find row with NISN column (actual header row)
    for (let rowNum = 1; rowNum <= 10; rowNum++) {
      const row = worksheet.getRow(rowNum);
      let foundNISN = false;
      
      row.eachCell((cell) => {
        const text = cell.value?.toString().toLowerCase().trim() || '';
        if (text.includes('nisn') || text.includes('nis')) {
          foundNISN = true;
        }
      });
      
      if (foundNISN) {
        headerRowNumber = rowNum;
        headerRow = row;
        console.log(`Found header row at line ${rowNum}`);
        break;
      }
    }

    const detectedHeaders: Map<number, string> = new Map(); // colNumber => original header text
    const colMap: { nisn?: number; semester?: number; [key: string]: number | undefined } = {};
    const subjectColumns: Map<number, string> = new Map(); // colNumber => subject name

    headerRow.eachCell((cell, colNumber) => {
      const headerText = cell.value?.toString().trim() || '';
      detectedHeaders.set(colNumber, headerText);

      // Match core columns
      if (matchHeader(headerText, HEADER_PATTERNS.nisn)) {
        colMap.nisn = colNumber;
      } else if (matchHeader(headerText, HEADER_PATTERNS.semester)) {
        colMap.semester = colNumber;
      } else if (matchHeader(headerText, HEADER_PATTERNS.nama)) {
        colMap.nama = colNumber;
      } else if (matchHeader(headerText, HEADER_PATTERNS.jurusan)) {
        colMap.jurusan = colNumber;
      } else if (matchHeader(headerText, HEADER_PATTERNS.tingkat)) {
        colMap.tingkat = colNumber;
      } else if (matchHeader(headerText, HEADER_PATTERNS.rombel)) {
        colMap.rombel = colNumber;
      } else {
        // Assume it's a subject column (nilai mata pelajaran)
        // Skip common non-subject columns and single-letter columns (usually absensi: S/I/A)
        const skip = headerText.match(/^(no|nomor|#|id|ket|keterangan|jml|jumlah|total|rata|absen|sakit|izin|alfa|hadir|s|i|a)$/i);
        
        if (!skip && headerText.length > 1) {
          const normalizedSubject = normalizeSubjectName(headerText);
          subjectColumns.set(colNumber, normalizedSubject);
        }
      }
    });

    console.log('Detected headers:', Array.from(detectedHeaders.entries()));
    console.log('Core columns:', colMap);
    console.log('Subject columns:', Array.from(subjectColumns.entries()));

    // Validation: NISN wajib ada
    if (!colMap.nisn) {
      return NextResponse.json({ 
        error: 'Kolom NISN tidak ditemukan. Pastikan ada kolom NISN dalam Excel.',
        debug: {
          detectedHeaders: Array.from(detectedHeaders.entries()),
          availablePatterns: HEADER_PATTERNS.nisn
        }
      }, { status: 400 });
    }

    // Validation: harus ada kolom mata pelajaran
    if (subjectColumns.size === 0) {
      return NextResponse.json({ 
        error: 'Tidak ada kolom mata pelajaran yang terdeteksi. Pastikan ada kolom nilai dalam Excel.',
        debug: {
          detectedHeaders: Array.from(detectedHeaders.entries()),
          coreColumns: colMap
        }
      }, { status: 400 });
    }

    // === PHASE 2: DATA PROCESSING ===
    let successCount = 0;
    let notFoundCount = 0;
    let updatedCount = 0;
    let createdCount = 0;
    const errors: string[] = [];
    const processedNISN = new Set<string>();

    // Collect all data rows
    const dataRows: Array<{ row: ExcelJS.Row; rowNumber: number }> = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= headerRowNumber) return; // Skip header and rows before header
      dataRows.push({ row, rowNumber });
    });

    // Process in batches using transactions for better performance
    const BATCH_SIZE = 10; // Reduced for stability
    for (let i = 0; i < dataRows.length; i += BATCH_SIZE) {
      const batch = dataRows.slice(i, i + BATCH_SIZE);

      await prisma.$transaction(async (tx) => {
        for (const { row, rowNumber } of batch) {
          const nisn = row.getCell(colMap.nisn!).value?.toString().trim();
          
          if (!nisn) {
            errors.push(`Baris ${rowNumber}: NISN kosong`);
            continue;
          }

          // Skip duplicate NISN dalam file yang sama
          if (processedNISN.has(nisn)) {
            continue;
          }
          processedNISN.add(nisn);

          try {
            // Cari siswa berdasarkan NISN
            const siswa = await tx.siswa.findUnique({
              where: { nisn },
              include: { jurusanSekolah: true }
            });
            
            if (!siswa) {
              notFoundCount++;
              errors.push(`Baris ${rowNumber}: NISN ${nisn} tidak ditemukan di database`);
              continue;
            }

            // Filter jurusan jika diminta
            if (jurusanId && siswa.jurusanId !== jurusanId) {
              errors.push(`Baris ${rowNumber}: NISN ${nisn} bukan dari jurusan yang dipilih`);
              continue;
            }

            // Auto-detect semester dari Excel atau gunakan parameter
            let targetSemester = semester ? parseInt(semester) : null;
            if (!targetSemester && colMap.semester) {
              const semesterValue = row.getCell(colMap.semester).value?.toString().trim();
              targetSemester = semesterValue ? parseInt(semesterValue) : null;
            }

            if (!targetSemester) {
              errors.push(`Baris ${rowNumber}: Semester tidak terdeteksi untuk NISN ${nisn}`);
              continue;
            }

            // Process each subject column
            for (const [colNumber, subjectName] of subjectColumns.entries()) {
              const cellValue = row.getCell(colNumber).value;
              let nilaiValue: number | null = null;

              // Parse nilai dengan berbagai format
              if (typeof cellValue === 'number') {
                nilaiValue = cellValue;
              } else if (typeof cellValue === 'string') {
                const cleaned = cellValue.replace(/[^0-9.,]/g, '').replace(',', '.');
                nilaiValue = parseFloat(cleaned);
              }

              // Skip jika nilai kosong atau invalid
              if (!nilaiValue || isNaN(nilaiValue)) continue;

              // Validasi range nilai (0-100)
              if (nilaiValue < 0 || nilaiValue > 100) {
                errors.push(`Baris ${rowNumber}: Nilai ${subjectName} di luar range (${nilaiValue})`);
                continue;
              }

              // Upsert dengan headerIndex tracking untuk exact export match
              const existingNilai = await tx.nilaiRapor.findUnique({
                where: {
                  siswaId_semester_mataPelajaran: {
                    siswaId: siswa.id,
                    semester: targetSemester,
                    mataPelajaran: subjectName
                  }
                }
              });

              await tx.nilaiRapor.upsert({
                where: {
                  siswaId_semester_mataPelajaran: {
                    siswaId: siswa.id,
                    semester: targetSemester,
                    mataPelajaran: subjectName
                  }
                },
                update: { 
                  nilai: nilaiValue,
                  headerIndex: colNumber, // Track Excel column position
                  isVerified: false // Reset verification on update
                },
                create: {
                  siswaId: siswa.id,
                  semester: targetSemester,
                  mataPelajaran: subjectName,
                  nilai: nilaiValue,
                  headerIndex: colNumber, // Track Excel column position
                  isVerified: false
                }
              });

              if (existingNilai) {
                updatedCount++;
              } else {
                createdCount++;
              }
              successCount++;
            }
          } catch (error) {
            console.error(`Error processing row ${rowNumber}:`, error);
            errors.push(`Baris ${rowNumber}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }, {
        maxWait: 30000, // 30 seconds
        timeout: 30000, // 30 seconds
      });
    }

    // === PHASE 3: AUDIT LOG ===
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId || 'system',
        userType: session.user.role,
        action: 'import_nilai',
        description: `Import Excel: ${successCount} nilai berhasil (${createdCount} baru, ${updatedCount} update). NISN tidak ditemukan: ${notFoundCount}.`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          filename: file.name,
          jurusanId,
          semester,
          detectedHeaders: Array.from(detectedHeaders.entries()),
          detectedSubjects: Array.from(subjectColumns.values()),
          successCount,
          createdCount,
          updatedCount,
          notFoundCount,
          totalRows: dataRows.length,
          processedNISN: processedNISN.size
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRows: dataRows.length,
          processedNISN: processedNISN.size,
          successCount,
          createdCount,
          updatedCount,
          notFoundCount,
          errorCount: errors.length
        },
        detection: {
          headers: Array.from(detectedHeaders.entries()).map(([col, name]) => ({ column: col, name })),
          subjects: Array.from(subjectColumns.entries()).map(([col, name]) => ({ column: col, name })),
          coreColumns: {
            nisn: colMap.nisn,
            semester: colMap.semester,
            nama: colMap.nama,
            jurusan: colMap.jurusan
          }
        },
        errors: errors.slice(0, 50) // Limit error messages untuk UI
      }
    });
  } catch (error) {
    console.error('Import Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}