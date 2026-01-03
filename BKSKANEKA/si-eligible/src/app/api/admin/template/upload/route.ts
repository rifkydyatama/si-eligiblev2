import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

// API untuk upload dan parse template Excel PDSS/PTKIN
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const templateType = formData.get('type') as string; // 'PDSS' or 'PTKIN'

    if (!file) {
      return NextResponse.json({ error: 'File required' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Get headers (baris pertama)
    const range = XLSX.utils.decode_range(firstSheet['!ref'] || 'A1');
    const headers: string[] = [];
    
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      const cell = firstSheet[cellAddress];
      headers.push(cell ? String(cell.v) : `Column_${col}`);
    }

    // Detect kolom-kolom yang relevan
    const detectedColumns = headers.map((header, index) => ({
      index,
      name: header,
      detected: detectColumnType(header),
      isSemester: /sem|semester|S\d/i.test(header),
      isMapel: /mtk|ipa|ips|fisika|kimia|biologi|ekonomi|geografi|sejarah|b\.|bahasa|pkn|pjok|seni|prakarya|informatika|agama/i.test(header)
    }));

    // Auto-create mapping untuk mata pelajaran yang terdeteksi
    const mapelDetected = detectedColumns.filter(col => col.isMapel);
    const mappingData: any[] = [];
    
    for (const col of mapelDetected) {
      const detectedType = detectColumnType(col.name);
      if (detectedType !== 'unknown') {
        // Ekstrak semester dari nama kolom (contoh: MTK_1, MATEMATIKA_SEM1)
        const semesterMatch = col.name.match(/(?:_|sem)(\d)/i);
        const semester = semesterMatch ? parseInt(semesterMatch[1]) : 1;
        
        mappingData.push({
          semester,
          kolomDapodik: col.name,
          kolomPDSS: templateType === 'PDSS' ? col.name : '',
          kolomPTKIN: templateType === 'PTKIN' ? col.name : '',
          namaMapel: getNamaMapel(detectedType),
          kategori: getKategoriMapel(detectedType)
        });
      }
    }

    // Simpan template ke database
    const savedTemplate = templateType === 'PDSS' 
      ? await prisma.templateNilaiPDSS.create({
          data: {
            tahunAkademikId: formData.get('tahunAkademikId')?.toString() || 'default',
            namaTemplate: file.name,
            semester: 1, // Default, bisa diupdate
            strukturTemplate: headers,
            mappingMapel: mappingData,
            formatSheet: { columns: detectedColumns },
            fileTemplate: file.name,
            isActive: true
          }
        })
      : await prisma.templateNilaiPTKIN.create({
          data: {
            tahunAkademikId: formData.get('tahunAkademikId')?.toString() || 'default',
            namaTemplate: file.name,
            semester: 1,
            strukturTemplate: headers,
            mappingMapel: mappingData,
            formatSheet: { columns: detectedColumns },
            fileTemplate: file.name,
            isActive: true
          }
        });

    // Auto-save mapping mapel ke tabel konfigurasi
    for (const mapping of mappingData) {
      await prisma.$executeRaw`
        INSERT INTO MapelMapping (id, mataPelajaranSistem, mataPelajaranPDSS, mataPelajaranPTKIN, kategori, isActive, createdAt, updatedAt)
        VALUES (
          ${`mm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
          ${mapping.namaMapel},
          ${templateType === 'PDSS' ? mapping.kolomPDSS : ''},
          ${templateType === 'PTKIN' ? mapping.kolomPTKIN : ''},
          ${mapping.kategori},
          true,
          NOW(),
          NOW()
        )
        ON DUPLICATE KEY UPDATE
          ${templateType === 'PDSS' ? 'mataPelajaranPDSS' : 'mataPelajaranPTKIN'} = VALUES(${templateType === 'PDSS' ? 'mataPelajaranPDSS' : 'mataPelajaranPTKIN'}),
          updatedAt = NOW()
      `;
    }

    // Save audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId,
        userType: session.user.role,
        action: 'upload_template_excel',
        description: `Upload template ${templateType}: ${file.name} - Auto-mapped ${mappingData.length} mata pelajaran`,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
        metadata: {
          filename: file.name,
          type: templateType,
          columnsCount: headers.length,
          mapelDetected: mappingData.length,
          templateId: savedTemplate.id,
          mappings: mappingData
        }
      }
    });

    return NextResponse.json({
      success: true,
      template: {
        id: savedTemplate.id,
        type: templateType,
        filename: file.name,
        columns: detectedColumns,
        totalColumns: headers.length,
        mapelDetected: mappingData.length,
        mappings: mappingData,
        preview: headers.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Error uploading template:', error);
    return NextResponse.json({ error: 'Failed to process Excel file' }, { status: 500 });
  }
}

// Helper function untuk detect tipe kolom
function detectColumnType(header: string): string {
  const h = header.toLowerCase();
  
  if (/nisn/i.test(h)) return 'nisn';
  if (/nama|name/i.test(h)) return 'nama';
  if (/kelas|class/i.test(h)) return 'kelas';
  if (/jurusan|major/i.test(h)) return 'jurusan';
  if (/matematika|mtk|math/i.test(h)) return 'matematika';
  if (/fisika|physics/i.test(h)) return 'fisika';
  if (/kimia|chemistry/i.test(h)) return 'kimia';
  if (/biologi|biology/i.test(h)) return 'biologi';
  if (/bahasa.*indonesia|b.*indo/i.test(h)) return 'bahasa_indonesia';
  if (/bahasa.*inggris|b.*ing|english/i.test(h)) return 'bahasa_inggris';
  if (/ekonomi|economy/i.test(h)) return 'ekonomi';
  if (/geografi|geography/i.test(h)) return 'geografi';
  if (/sejarah|history/i.test(h)) return 'sejarah';
  if (/sosiologi|sociology/i.test(h)) return 'sosiologi';
  if (/pkn|pancasila|kewarganegaraan/i.test(h)) return 'pkn';
  if (/pjok|penjas|olahraga/i.test(h)) return 'pjok';
  if (/seni|budaya/i.test(h)) return 'seni_budaya';
  if (/prakarya|kewirausahaan/i.test(h)) return 'prakarya';
  if (/informatika|tik|komputer/i.test(h)) return 'informatika';
  if (/agama|pai|kristen|katolik|hindu|buddha/i.test(h)) return 'agama';
  
  return 'unknown';
}

// Helper: Get nama lengkap mata pelajaran
function getNamaMapel(code: string): string {
  const mapelNames: Record<string, string> = {
    'matematika': 'Matematika',
    'fisika': 'Fisika',
    'kimia': 'Kimia',
    'biologi': 'Biologi',
    'bahasa_indonesia': 'Bahasa Indonesia',
    'bahasa_inggris': 'Bahasa Inggris',
    'bahasa_arab': 'Bahasa Arab',
    'ekonomi': 'Ekonomi',
    'geografi': 'Geografi',
    'sejarah': 'Sejarah',
    'sosiologi': 'Sosiologi',
    'pkn': 'Pendidikan Kewarganegaraan',
    'pjok': 'Pendidikan Jasmani',
    'seni_budaya': 'Seni Budaya',
    'prakarya': 'Prakarya & Kewirausahaan',
    'informatika': 'Informatika',
    'agama': 'Pendidikan Agama'
  };
  return mapelNames[code] || code;
}

// Helper: Get kategori mata pelajaran
function getKategoriMapel(code: string): string {
  const wajib = ['matematika', 'bahasa_indonesia', 'bahasa_inggris', 'pkn', 'agama', 'pjok'];
  const peminatan = ['fisika', 'kimia', 'biologi', 'ekonomi', 'geografi', 'sejarah', 'sosiologi'];
  
  if (wajib.includes(code)) return 'wajib';
  if (peminatan.includes(code)) return 'peminatan';
  return 'lintas_minat';
}

// GET: Download template kosong
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'PDSS' or 'PTKIN'

    // Create workbook
    const wb = XLSX.utils.book_new();
    
    let headers: string[] = [];
    
    if (type === 'PDSS') {
      headers = [
        'NISN', 'NAMA', 'KELAS', 'JURUSAN',
        'MTK_1', 'MTK_2', 'MTK_3', 'MTK_4', 'MTK_5',
        'BIND_1', 'BIND_2', 'BIND_3', 'BIND_4', 'BIND_5',
        'BING_1', 'BING_2', 'BING_3', 'BING_4', 'BING_5',
        'FIS_1', 'FIS_2', 'FIS_3', 'FIS_4', 'FIS_5',
        'KIM_1', 'KIM_2', 'KIM_3', 'KIM_4', 'KIM_5',
        'BIO_1', 'BIO_2', 'BIO_3', 'BIO_4', 'BIO_5'
      ];
    } else if (type === 'PTKIN') {
      headers = [
        'NISN', 'NAMA_LENGKAP', 'KELAS', 'PROGRAM_STUDI',
        'MATEMATIKA_SEM1', 'MATEMATIKA_SEM2', 'MATEMATIKA_SEM3', 'MATEMATIKA_SEM4', 'MATEMATIKA_SEM5',
        'B_INDONESIA_SEM1', 'B_INDONESIA_SEM2', 'B_INDONESIA_SEM3', 'B_INDONESIA_SEM4', 'B_INDONESIA_SEM5',
        'B_INGGRIS_SEM1', 'B_INGGRIS_SEM2', 'B_INGGRIS_SEM3', 'B_INGGRIS_SEM4', 'B_INGGRIS_SEM5',
        'B_ARAB_SEM1', 'B_ARAB_SEM2', 'B_ARAB_SEM3', 'B_ARAB_SEM4', 'B_ARAB_SEM5'
      ];
    } else {
      headers = ['NISN', 'NAMA', 'KELAS', 'JURUSAN'];
    }

    // Create worksheet with headers only
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    
    // Add to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    // Return as file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="Template_${type || 'Default'}_${Date.now()}.xlsx"`
      }
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json({ error: 'Failed to generate template' }, { status: 500 });
  }
}
