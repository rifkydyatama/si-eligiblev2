// src/app/api/admin/siswa/sync-dapodik/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

/**
 * ============================================================
 * SI-ELIGIBLE DAPODIK SYNCHRONIZATION API
 * ============================================================
 * Endpoint: POST /api/admin/siswa/sync-dapodik
 * Purpose: Sinkronisasi data siswa dari server Dapodik
 * Authorization: Admin & Guru BK only
 * ============================================================
 */

interface DapodikStudent {
  nisn: string;
  nama: string;
  tanggal_lahir: string;
  kelas: string;
  jurusan?: string;
  email?: string;
  no_telepon?: string;
  penerima_kipk?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== 'admin' && session.user.role !== 'guru_bk')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { dapodikUrl, token } = body;

    // Validasi parameter
    if (!dapodikUrl) {
      return NextResponse.json({ 
        error: 'URL Dapodik tidak boleh kosong' 
      }, { status: 400 });
    }

    // Normalisasi URL - tambahkan protocol jika tidak ada
    let normalizedUrl = dapodikUrl.trim();
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      // Default ke https:// jika tidak ada protocol
      normalizedUrl = `https://${normalizedUrl}`;
    }

    // Validasi format URL
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ 
        error: 'Format URL tidak valid. Contoh: https://dapodik.sekolah.sch.id/api/siswa' 
      }, { status: 400 });
    }

    // --- FETCH DATA DARI API DAPODIK ---
    let dapodikData: DapodikStudent[] = [];
    
    // Untuk Node.js fetch, disable SSL verification untuk self-signed/expired certificates
    const fetchOptions: RequestInit = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      // @ts-expect-error - Node.js specific option
      rejectUnauthorized: false,
    };

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(normalizedUrl, {
        ...fetchOptions,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Dapodik API Error: ${response.status} - ${response.statusText}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        const preview = text.substring(0, 300).replace(/\s+/g, ' ');
        throw new Error(`URL mengembalikan HTML (halaman web), bukan API JSON.\n\nPreview: ${preview}...\n\nPastikan URL adalah endpoint API yang mengembalikan data JSON, bukan URL website.`);
      }

      const result = await response.json();
      
      // Adaptasi struktur response Dapodik (sesuaikan dengan format API sekolah)
      // Asumsi response format: { success: true, data: [...] } atau langsung array
      if (Array.isArray(result)) {
        dapodikData = result;
      } else if (result.data && Array.isArray(result.data)) {
        dapodikData = result.data;
      } else if (result.rows && Array.isArray(result.rows)) {
        dapodikData = result.rows;
      } else {
        throw new Error('Format response Dapodik tidak valid');
      }

    } catch (fetchError) {
      console.error('Dapodik Fetch Error:', fetchError);
      
      // Jika HTTPS gagal karena SSL, coba fallback ke HTTP
      if (fetchError instanceof Error && 
          (fetchError.message.includes('certificate') || fetchError.message.includes('CERT_')) &&
          normalizedUrl.startsWith('https://')) {
        
        const httpUrl = normalizedUrl.replace('https://', 'http://');
        console.log('SSL Error detected, trying HTTP fallback:', httpUrl);
        
        try {
          const httpController = new AbortController();
          const httpTimeoutId = setTimeout(() => httpController.abort(), 30000);

          const httpResponse = await fetch(httpUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            signal: httpController.signal
          });

          clearTimeout(httpTimeoutId);

          if (!httpResponse.ok) {
            throw new Error(`HTTP API Error: ${httpResponse.status} - ${httpResponse.statusText}`);
          }

          // Check if HTTP response is JSON
          const httpContentType = httpResponse.headers.get('content-type');
          if (!httpContentType || !httpContentType.includes('application/json')) {
            const text = await httpResponse.text();
            const preview = text.substring(0, 300).replace(/\s+/g, ' ');
            throw new Error(`URL mengembalikan HTML (halaman web), bukan API JSON. Preview: ${preview}...`);
          }

          const result = await httpResponse.json();
          
          // Adaptasi struktur response
          if (Array.isArray(result)) {
            dapodikData = result;
          } else if (result.data && Array.isArray(result.data)) {
            dapodikData = result.data;
          } else if (result.rows && Array.isArray(result.rows)) {
            dapodikData = result.rows;
          } else {
            throw new Error('Format response Dapodik tidak valid');
          }
          
          // Berhasil dengan HTTP, lanjutkan ke proses data
        } catch (httpError) {
          return NextResponse.json({ 
            error: `Gagal mengambil data dari Dapodik (HTTPS & HTTP)`,
            details: `HTTPS Error: ${fetchError instanceof Error ? fetchError.message : 'SSL Certificate Error'}. HTTP Error: ${httpError instanceof Error ? httpError.message : 'Unknown error'}`,
            suggestion: 'Pastikan server Dapodik dapat diakses dan API endpoint benar.'
          }, { status: 502 });
        }
      } else {
        return NextResponse.json({ 
          error: `Gagal mengambil data dari Dapodik: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`,
          details: String(fetchError),
          suggestion: fetchError instanceof Error && fetchError.message.includes('certificate') 
            ? 'Server menggunakan SSL certificate yang tidak valid. Gunakan HTTP atau perbaiki certificate.'
            : 'Periksa koneksi jaringan dan pastikan URL API benar.'
        }, { status: 502 });
      }
    }

    if (!dapodikData || dapodikData.length === 0) {
      return NextResponse.json({ 
        error: 'Tidak ada data siswa yang ditemukan dari Dapodik',
        successCount: 0,
        duplicateCount: 0,
        errorCount: 0
      }, { status: 200 });
    }

    // --- PROSES SINKRONISASI KE DATABASE ---
    let successCount = 0;
    let duplicateCount = 0;
    let updateCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const updatedStudents: string[] = [];

    for (const student of dapodikData) {
      try {
        // Validasi data minimal
        if (!student.nisn || !student.nama) {
          errorCount++;
          errors.push(`Data tidak valid: NISN atau Nama kosong`);
          continue;
        }

        // Normalisasi NISN (hapus spasi, strip karakter non-digit)
        const cleanNisn = student.nisn.toString().trim().replace(/\D/g, '');
        
        if (cleanNisn.length < 8) {
          errorCount++;
          errors.push(`NISN tidak valid: ${student.nisn}`);
          continue;
        }

        // Parse tanggal lahir
        let tanggalLahir: Date;
        try {
          if (student.tanggal_lahir) {
            tanggalLahir = new Date(student.tanggal_lahir);
            if (isNaN(tanggalLahir.getTime())) {
              throw new Error('Invalid date');
            }
          } else {
            // Default fallback jika tidak ada tanggal lahir
            tanggalLahir = new Date('2007-01-01');
          }
        } catch {
          tanggalLahir = new Date('2007-01-01');
        }

        // Cari data siswa yang sudah ada
        const existingSiswa = await prisma.siswa.findUnique({
          where: { nisn: cleanNisn }
        });

        if (existingSiswa) {
          // Update data siswa yang sudah ada
          await prisma.siswa.update({
            where: { nisn: cleanNisn },
            data: {
              nama: student.nama.trim(),
              tanggalLahir,
              kelas: student.kelas?.trim() || existingSiswa.kelas,
              email: student.email?.trim() || existingSiswa.email,
              noTelepon: student.no_telepon?.trim() || existingSiswa.noTelepon,
              statusKIPK: student.penerima_kipk ?? existingSiswa.statusKIPK,
              updatedAt: new Date()
            }
          });
          
          updateCount++;
          updatedStudents.push(student.nama);
        } else {
          // Tambah siswa baru
          // Cari jurusan sekolah jika ada (opsional)
          let jurusanSekolahId = null;
          if (student.jurusan) {
            const jurusanSekolah = await prisma.jurusanSekolah.findFirst({
              where: {
                nama: {
                  contains: student.jurusan.trim()
                }
              }
            });
            jurusanSekolahId = jurusanSekolah?.id;
          }

          await prisma.siswa.create({
            data: {
              nisn: cleanNisn,
              nama: student.nama.trim(),
              tanggalLahir,
              kelas: student.kelas?.trim() || '12',
              jurusanId: jurusanSekolahId,
              email: student.email?.trim() || null,
              noTelepon: student.no_telepon?.trim() || null,
              statusKIPK: student.penerima_kipk || false,
              mendaftarKIPK: false,
              isDataLocked: false
            }
          });
          
          successCount++;
        }

      } catch (error) {
        errorCount++;
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`${student.nama}: ${errorMsg}`);
        console.error('Error syncing student:', error);
      }
    }

    // Hitung duplikat (siswa yang sudah ada tapi tidak diupdate)
    duplicateCount = dapodikData.length - successCount - updateCount - errorCount;

    // Log audit
    try {
      await prisma.auditLog.create({
        data: {
          userId: String(session.user.userId),
          userType: 'admin',
          action: 'sync_dapodik',
          description: `Sinkronisasi Dapodik: ${successCount} baru, ${updateCount} diupdate, ${duplicateCount} duplikat, ${errorCount} error. Source: ${normalizedUrl}`
        }
      });
    } catch (auditError) {
      console.error('Failed to create audit log:', auditError);
    }

    return NextResponse.json({
      success: true,
      message: 'Sinkronisasi Dapodik selesai',
      successCount,
      updateCount,
      duplicateCount,
      errorCount,
      totalProcessed: dapodikData.length,
      updatedStudents: updatedStudents.slice(0, 10), // Max 10 untuk preview
      errors: errors.slice(0, 10), // Max 10 error untuk preview
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Dapodik Sync Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
