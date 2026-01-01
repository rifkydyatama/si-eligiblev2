# Migrasi Jurusan Sekolah ke Database

## 📋 Langkah-Langkah Migrasi

### 1. Update Prisma Schema
File `prisma/schema.prisma` sudah diupdate dengan:
- Model baru `JurusanSekolah`
- Relasi di model `Siswa` dari string `jurusan` ke relasi `jurusanId`

### 2. Generate Prisma Client Baru
```bash
npx prisma generate
```

### 3. Jalankan Migrasi Database

**Option A: Menggunakan Prisma Migrate (Recommended)**
```bash
npx prisma migrate dev --name add_jurusan_sekolah
```

**Option B: Manual Migration (Jika Prisma Migrate bermasalah)**
Jalankan SQL migration file yang sudah disediakan:
```bash
# Jalankan file: prisma/migrations/add_jurusan_sekolah.sql
# Gunakan MySQL client atau tools seperti phpMyAdmin/MySQL Workbench
```

### 4. Verifikasi Data
Setelah migrasi, cek:
```sql
-- Cek jurusan sekolah
SELECT * FROM JurusanSekolah;

-- Cek relasi siswa
SELECT s.nama, s.kelas, js.kode, js.nama as jurusan_nama
FROM Siswa s
JOIN JurusanSekolah js ON s.jurusanId = js.id
LIMIT 10;

-- Cek jumlah siswa per jurusan
SELECT js.kode, js.nama, COUNT(s.id) as total_siswa
FROM JurusanSekolah js
LEFT JOIN Siswa s ON s.jurusanId = js.id
GROUP BY js.id
ORDER BY js.tingkat, js.kode;
```

## ✅ Fitur yang Terintegrasi

Setelah migrasi, jurusan sekolah akan terintegrasi di:

### 1. **Halaman Konfigurasi** ✅
- CRUD lengkap untuk jurusan sekolah
- Tampilan jumlah siswa per jurusan
- Validasi: tidak bisa hapus/nonaktifkan jika masih ada siswa

### 2. **Manajemen Siswa** ✅
- Dropdown jurusan sekolah saat tambah/edit siswa
- Data referensi dari tabel JurusanSekolah
- Auto-validate: hanya jurusan aktif yang bisa dipilih

### 3. **Import Siswa** ✅
- Mapping kode jurusan saat import
- Validasi kode jurusan yang valid
- Auto-create jurusan jika diperlukan (optional)

### 4. **Export Data** ✅
- Kolom jurusan menggunakan data dari relasi
- Template export include nama jurusan lengkap

### 5. **Laporan & Statistik** ✅
- Grouping berdasarkan jurusan sekolah
- Filter per jurusan
- Ranking per jurusan

### 6. **Perhitungan Nilai** ✅
- Konfigurasi bobot bisa per jurusan
- Ranking eligible per jurusan sekolah

## 🔄 Migration Notes

### Data Default yang Akan Di-Seed:
- **SMA:**
  - IPA - Ilmu Pengetahuan Alam
  - IPS - Ilmu Pengetahuan Sosial  
  - BAHASA - Bahasa

- **SMK:**
  - TKJ - Teknik Komputer dan Jaringan
  - RPL - Rekayasa Perangkat Lunak
  - AKL - Akuntansi dan Keuangan Lembaga
  - OTKP - Otomatisasi dan Tata Kelola Perkantoran
  - BDP - Bisnis Daring dan Pemasaran
  - MM - Multimedia
  - TKR - Teknik Kendaraan Ringan

### Mapping Data Lama ke Baru:
Migration script akan otomatis:
1. Membuat tabel JurusanSekolah
2. Insert data default
3. Map data siswa existing berdasarkan kode jurusan
4. Set foreign key constraint
5. Update indexes

### Rollback (Jika Diperlukan):
```sql
-- Remove foreign key
ALTER TABLE Siswa DROP FOREIGN KEY Siswa_jurusanId_fkey;

-- Drop indexes
DROP INDEX Siswa_jurusanId_idx ON Siswa;
DROP INDEX Siswa_kelas_jurusanId_idx ON Siswa;

-- Restore old column (jika sempat dihapus)
ALTER TABLE Siswa ADD COLUMN jurusan VARCHAR(191);
UPDATE Siswa s
JOIN JurusanSekolah js ON s.jurusanId = js.id
SET s.jurusan = js.kode;

-- Remove new column
ALTER TABLE Siswa DROP COLUMN jurusanId;

-- Drop table
DROP TABLE JurusanSekolah;
```

## 🚀 Setelah Migrasi

1. **Restart Development Server**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

2. **Test Fitur:**
   - Buka halaman Konfigurasi > Tab Jurusan Sekolah
   - Tambah jurusan baru
   - Edit jurusan existing
   - Cek halaman manajemen siswa apakah dropdown jurusan sudah muncul
   - Test import siswa dengan kode jurusan

3. **Verify Integration:**
   - Cek apakah jumlah siswa muncul di list jurusan
   - Test validasi hapus jurusan yang sedang digunakan
   - Test filter dan grouping per jurusan di halaman lain

## ⚠️ Penting!

- **Backup database** sebelum migrasi
- Jalankan di development environment dulu
- Test semua fitur sebelum deploy ke production
- Monitor error logs setelah migrasi
