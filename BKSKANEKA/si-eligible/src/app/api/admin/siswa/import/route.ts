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

    // --- AUTO-DETECT HEADER ROW (untuk Excel Dapodik dengan judul di atas) ---
    let headerRowNumber = 1;
    let foundHeader = false;
    
    // Cari baris yang mengandung "NISN" sebagai header
    for (let i = 1; i <= 10; i++) { // Cek 10 baris pertama
      const row = worksheet.getRow(i);
      let hasNISN = false;
      let hasNama = false;
      
      row.eachCell((cell) => {
        const cellValue = cell.value?.toString().toLowerCase().trim() || '';
        if (cellValue.includes('nisn')) hasNISN = true;
        if (cellValue.includes('nama') && !cellValue.includes('sekolah')) hasNama = true;
      });
      
      if (hasNISN && hasNama) {
        headerRowNumber = i;
        foundHeader = true;
        console.log(`✅ Header ditemukan di Row ${i}`);
        break;
      }
    }
    
    if (!foundHeader) {
      console.log('❌ Header tidak ditemukan di 10 baris pertama');
      return NextResponse.json({ 
        error: 'Header tidak ditemukan. Pastikan Excel memiliki kolom NISN dan Nama.',
        suggestion: 'File Excel harus memiliki baris header dengan kolom NISN dan Nama (bisa di row manapun dalam 10 baris pertama)'
      }, { status: 400 });
    }

    // --- LOGIKA SMART MAPPING DAPODIK (ENHANCED) ---
    // Mencari indeks kolom berdasarkan nama header dengan berbagai variasi
    let colMap: { [key: string]: number } = {};
    const headerRow = worksheet.getRow(headerRowNumber);
    
    // Debug: Log semua nilai di header row
    console.log(`📋 Debug Row ${headerRowNumber} (Header):`);
    headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const cellValue = cell.value?.toString() || '';
      console.log(`  Col ${colNumber}: "${cellValue}"`);
    });
    
    headerRow.eachCell((cell, colNumber) => {
      const headerText = cell.value?.toString().toLowerCase().trim() || '';
      
      // NISN - berbagai variasi
      if (headerText.includes('nisn') || headerText === 'no_induk_siswa_nasional' || headerText === 'no induk siswa nasional') {
        colMap.nisn = colNumber;
      }
      
      // Nama - berbagai variasi
      if (headerText.includes('nama') && !headerText.includes('jurusan') && !headerText.includes('kelas') && !headerText.includes('sekolah')) {
        if (!colMap.nama) colMap.nama = colNumber; // ambil kolom nama pertama
      }
      
      // Tanggal Lahir - berbagai variasi
      if ((headerText.includes('lahir') && (headerText.includes('tanggal') || headerText.includes('tgl') || headerText.includes('tgllahir'))) || 
          headerText === 'tanggal_lahir' || headerText === 'tgllahir' || headerText === 'tempat_tanggal_lahir') {
        colMap.tanggalLahir = colNumber;
      }
      
      // Kelas/Tingkat - berbagai variasi
      if (headerText.includes('kelas') || headerText.includes('rombel') || headerText.includes('tingkat') || 
          headerText === 'kls' || headerText.includes('rombongan')) {
        colMap.kelas = colNumber;
      }
      
      // Jurusan - berbagai variasi
      if (headerText.includes('jurusan') || headerText.includes('kompetensi') || headerText.includes('kejuruan') ||
          headerText.includes('peminatan') || headerText === 'komp_keahlian') {
        colMap.jurusan = colNumber;
      }
      
      // Email - berbagai variasi
      if (headerText.includes('email') || headerText.includes('e-mail') || headerText.includes('surel')) {
        colMap.email = colNumber;
      }
      
      // Telepon - berbagai variasi
      if (headerText.includes('telepon') || headerText.includes('hp') || headerText.includes('ponsel') || 
          headerText.includes('telp') || headerText.includes('no_hp') || headerText.includes('handphone') ||
          headerText === 'no_telp_seluler' || headerText === 'nomor_telepon') {
        colMap.noTelepon = colNumber;
      }
      
      // KIP-K/KPS - berbagai variasi
      if (headerText.includes('kip') || headerText.includes('kks') || headerText.includes('kps') || 
          headerText.includes('penerima') || headerText === 'penerima_kip' || headerText === 'penerima_kps') {
        colMap.statusKIPK = colNumber;
      }
      
      // Jenis Kelamin (untuk info tambahan, tidak disimpan di schema saat ini)
      if (headerText.includes('jenis') && headerText.includes('kelamin') || headerText === 'jk' || headerText === 'gender') {
        colMap.jenisKelamin = colNumber;
      }
    });

    // Log kolom yang terdeteksi untuk debugging
    console.log('🔍 Kolom terdeteksi:', colMap);

    // Validasi apakah kolom minimal (NISN & Nama) ditemukan
    if (!colMap.nisn || !colMap.nama) {
      return NextResponse.json({ 
        error: 'Format kolom tidak dikenali. Pastikan Excel memiliki kolom "NISN" dan "Nama".',
        detectedColumns: Object.keys(colMap).length > 0 ? colMap : 'Tidak ada kolom yang terdeteksi',
        suggestion: 'File Excel harus memiliki header di baris pertama dengan minimal kolom NISN dan Nama'
      }, { status: 400 });
    }

    console.log('✅ Validasi kolom berhasil. Mulai membaca data...');

    type SiswaData = {
      nisn: string;
      nama: string;
      tanggalLahir: Date;
      kelas: string;
      email: string | null;
      noTelepon: string | null;
      statusKIPK: boolean;
      mendaftarKIPK: boolean;
    };

    const siswaData: SiswaData[] = [];
    const errors: string[] = [];

    // Membaca baris (mulai dari baris setelah header)
    let processedRows = 0;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber <= headerRowNumber) return; // Lewati header dan baris di atasnya

      const nisn = row.getCell(colMap.nisn).value?.toString().trim();
      const nama = row.getCell(colMap.nama).value?.toString().trim();
      const rawTanggalLahir = colMap.tanggalLahir ? row.getCell(colMap.tanggalLahir).value : null;
      const kelas = colMap.kelas ? row.getCell(colMap.kelas).value?.toString().trim() : '12';
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

      // ⚠️ VALIDASI KELAS: DISABLED - Terima semua kelas untuk restore data
      // TODO: Aktifkan kembali setelah data ter-restore
      // if (kelas && !kelas.toUpperCase().startsWith('XII')) {
      //   errors.push(`Baris ${rowNumber}: Sistem hanya menerima siswa kelas XII. Kelas "${kelas}" ditolak.`);
      //   return;
      // }

      processedRows++;

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
        email: email || null,
        noTelepon: noTelepon || null,
        statusKIPK,
        mendaftarKIPK: false
      });
    });

    console.log(`📊 Total baris diproses: ${processedRows}, Valid: ${siswaData.length}, Error: ${errors.length}`);

    if (errors.length > 0 && siswaData.length === 0) {
      return NextResponse.json({ error: 'Data tidak valid', errors }, { status: 400 });
    }

    // --- DEDUPLIKASI NISN DALAM ARRAY (cegah duplikat dalam file Excel) ---
    const uniqueSiswaMap = new Map<string, typeof siswaData[0]>();
    const duplicatesInFile: string[] = [];

    siswaData.forEach((data) => {
      if (uniqueSiswaMap.has(data.nisn)) {
        duplicatesInFile.push(`${data.nama} (${data.nisn})`);
      } else {
        uniqueSiswaMap.set(data.nisn, data);
      }
    });

    const dedupedSiswaData = Array.from(uniqueSiswaMap.values());
    
    console.log(`🔍 Duplikat dalam Excel: ${duplicatesInFile.length}`);
    if (duplicatesInFile.length > 0) {
      console.log(`   NISN duplikat: ${duplicatesInFile.slice(0, 5).join(', ')}${duplicatesInFile.length > 5 ? '...' : ''}`);
    }

    // --- PROSES DATABASE ---
    let successCount = 0;
    let duplicateCount = 0;
    let errorCount = 0;
    const detailedErrors: string[] = [];

    console.log(`🔄 Memulai proses insert ${dedupedSiswaData.length} data siswa unik ke database...`);

    for (const data of dedupedSiswaData) {
      try {
        const existing = await prisma.siswa.findUnique({
          where: { nisn: data.nisn }
        });

        if (existing) {
          duplicateCount++;
          console.log(`⊗ Duplikat di database: ${data.nama} (${data.nisn})`);
          continue;
        }

        await prisma.siswa.create({ data });
        successCount++;
        
        if (successCount % 100 === 0) {
          console.log(`✓ Progress: ${successCount} siswa berhasil disimpan...`);
        }
      } catch (error: any) {
        errorCount++;
        const errorMsg = `${data.nama} (${data.nisn}): ${error.message || error}`;
        console.error('❌ Error inserting siswa:', errorMsg);
        detailedErrors.push(errorMsg);
        
        // Log detail error pertama untuk debugging
        if (errorCount === 1) {
          console.error('Detail error pertama:', error);
        }
      }
    }

    console.log(`\n📊 RINGKASAN IMPORT:`);
    console.log(`  ✓ Berhasil: ${successCount}`);
    console.log(`  ⊗ Duplikat di Excel: ${duplicatesInFile.length}`);
    console.log(`  ⊗ Duplikat di database: ${duplicateCount}`);
    console.log(`  ✗ Error: ${errorCount}`);
    console.log(`  📋 Total baris Excel: ${siswaData.length}`);
    console.log(`  📋 Data unik: ${dedupedSiswaData.length}\n`);

    // Log audit sesuai schema AuditLog
    await prisma.auditLog.create({
      data: {
        userId: session.user.userId || 'system',
        userType: 'admin',
        action: 'import_siswa',
        description: `Import ${successCount} siswa berhasil. Duplikat Excel: ${duplicatesInFile.length}, Duplikat DB: ${duplicateCount}, Error: ${errorCount}`,
        ipAddress: null,
        metadata: {
          successCount,
          duplicatesInFile: duplicatesInFile.length,
          duplicateCount,
          errorCount,
          totalRows: siswaData.length
        }
      }
    });

    return NextResponse.json({
      message: 'Import selesai',
      successCount,
      duplicatesInFile: duplicatesInFile.length,
      duplicateCount,
      errorCount,
      totalRows: siswaData.length,
      uniqueRows: dedupedSiswaData.length,
      errors: detailedErrors.slice(0, 50) // Limit error messages ke 50 pertama
    });

  } catch (error) {
    console.error('Error importing siswa:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}