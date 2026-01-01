// src/app/api/admin/siswa/import/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import ExcelJS from 'exceljs';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(new Uint8Array(bytes));

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    const worksheet = workbook.getWorksheet(1);
    if (!worksheet) {
      return NextResponse.json({ error: 'Worksheet tidak ditemukan' }, { status: 400 });
    }

    // --- LOGIKA SMART MAPPING DAPODIK ---
    // Mencari indeks kolom berdasarkan nama header (tidak sensitif huruf besar/kecil)
    let colMap: { [key: string]: number } = {};
    const headerRow = worksheet.getRow(1);
    
    headerRow.eachCell((cell, colNumber) => {
      const headerText = cell.value?.toString().toLowerCase().trim() || '';
      
      if (headerText.includes('nisn')) colMap.nisn = colNumber;
      if (headerText.includes('nama')) colMap.nama = colNumber;
      if (headerText.includes('lahir') && (headerText.includes('tanggal') || headerText.includes('tgl'))) colMap.tanggalLahir = colNumber;
      if (headerText.includes('kelas') || headerText.includes('rombel')) colMap.kelas = colNumber;
      if (headerText.includes('jurusan') || headerText.includes('kompetensi')) colMap.jurusan = colNumber;
      if (headerText.includes('email')) colMap.email = colNumber;
      if (headerText.includes('telepon') || headerText.includes('hp') || headerText.includes('ponsel')) colMap.noTelepon = colNumber;
      if (headerText.includes('kip') || headerText.includes('kks') || headerText.includes('kps') || headerText.includes('penerima')) colMap.statusKIPK = colNumber;
    });

    // Validasi apakah kolom minimal (NISN & Nama) ditemukan
    if (!colMap.nisn || !colMap.nama) {
      return NextResponse.json({ 
        error: 'Format kolom tidak dikenali. Pastikan Excel memiliki header "NISN" dan "Nama".' 
      }, { status: 400 });
    }

    type SiswaData = {
      nisn: string;
      nama: string;
      tanggalLahir: Date;
      kelas: string;
      jurusan: string;
      email: string | null;
      noTelepon: string | null;
      statusKIPK: boolean;
    };

    const siswaData: SiswaData[] = [];
    const errors: string[] = [];

    // Membaca baris (mulai baris ke-2)
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Lewati header

      const nisn = row.getCell(colMap.nisn).value?.toString().trim();
      const nama = row.getCell(colMap.nama).value?.toString().trim();
      const rawTanggalLahir = colMap.tanggalLahir ? row.getCell(colMap.tanggalLahir).value : null;
      const kelas = colMap.kelas ? row.getCell(colMap.kelas).value?.toString().trim() : '12';
      const jurusan = colMap.jurusan ? row.getCell(colMap.jurusan).value?.toString().trim() : '-';
      const email = colMap.email ? row.getCell(colMap.email).value?.toString().trim() : null;
      const noTelepon = colMap.noTelepon ? row.getCell(colMap.noTelepon).value?.toString().trim() : null;
      
      // Deteksi KIPK (jika kolom ada dan berisi "Ya", "1", atau "True")
      const kipkValue = colMap.statusKIPK ? row.getCell(colMap.statusKIPK).value?.toString().toLowerCase() : '';
      const statusKIPK = kipkValue === 'ya' || kipkValue === '1' || kipkValue === 'true' || kipkValue === 'penerima';

      // Validasi baris wajib
      if (!nisn || nisn.length < 8) {
        errors.push(`Baris ${rowNumber}: NISN tidak valid (${nisn})`);
        return;
      }
      if (!nama) {
        errors.push(`Baris ${rowNumber}: Nama tidak boleh kosong`);
        return;
      }

      // Parsing Tanggal Lahir (Handel format Excel Date atau String)
      let parsedDate: Date;
      if (rawTanggalLahir instanceof Date) {
        parsedDate = rawTanggalLahir;
      } else if (typeof rawTanggalLahir === 'number') {
        parsedDate = new Date((rawTanggalLahir - 25569) * 86400 * 1000);
      } else if (rawTanggalLahir) {
        parsedDate = new Date(rawTanggalLahir.toString());
      } else {
        parsedDate = new Date(); // Fallback jika kosong
      }

      siswaData.push({
        nisn,
        nama,
        tanggalLahir: parsedDate,
        kelas,
        jurusan,
        email: email || null,
        noTelepon: noTelepon || null,
        statusKIPK
      });
    });

    if (errors.length > 0 && siswaData.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid', errors }, { status: 400 });
    }

    // --- PROSES DATABASE (TETAP SAMA) ---
    let successCount = 0;
    let duplicateCount = 0;

    for (const data of siswaData) {
      try {
        const existing = await prisma.siswa.findUnique({
          where: { nisn: data.nisn }
        });

        if (existing) {
          duplicateCount++;
          continue;
        }

        await prisma.siswa.create({ data });
        successCount++;
      } catch (error) {
        console.error('Error inserting siswa:', error);
        errors.push(`Gagal simpan ${data.nama}: ${error}`);
      }
    }

    // Log audit sesuai schema AuditLog
    await prisma.auditLog.create({
      data: {
        adminId: Number(session.user.userId),
        action: 'import_siswa',
        details: `Import ${successCount} siswa (Dapodik Mapped). Duplikat: ${duplicateCount}`
      }
    });

    return NextResponse.json({
      message: 'Import selesai',
      successCount,
      duplicateCount,
      totalRows: siswaData.length,
      errors
    });

  } catch (error) {
    console.error('Error importing siswa:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}