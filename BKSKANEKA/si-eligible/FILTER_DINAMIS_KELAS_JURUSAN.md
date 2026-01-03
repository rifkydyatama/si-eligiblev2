# Dokumentasi Filter Dinamis Kelas & Jurusan

## Overview
Sistem filter kelas dan jurusan sekarang **otomatis terdeteksi** dari data siswa yang sudah diimport ke database. Tidak perlu lagi input manual daftar kelas atau jurusan!

## Cara Kerja

### 1. Import Data dari Excel Dapodik
Ketika Anda import file Excel dari Dapodik di halaman `/admin/siswa/import`:

**Kolom yang diambil:**
- `Rombel Saat Ini` → disimpan ke field `kelas` (contoh: "XII TKR 5", "XI PM 2", "X TJKT 1")
- `NISN`, `Nama`, `Tanggal Lahir`, `HP`, `E-Mail`, dll

**Format kelas yang terdeteksi:**
```
XII TKR 5  = Tingkat: XII, Jurusan: TKR, Rombel: 5
XI PM 2    = Tingkat: XI, Jurusan: PM, Rombel: 2
X TJKT 1   = Tingkat: X, Jurusan: TJKT, Rombel: 1
```

### 2. API Filter Otomatis `/api/admin/siswa/filters`

API ini membaca seluruh data siswa dan mengekstrak:

**Tingkat Kelas:** XII, XI, X
**Jurusan:** TKR, PM, TJKT, APAT, ATPH, ATUG, dll (dari kelas)
**Daftar Rombel:** XII TKR 1, XII TKR 2, XII TKR 3, dst.

Response contoh:
```json
{
  "kelas": [
    "XII TKR 1", "XII TKR 2", "XII TKR 3", "XII TKR 4", "XII TKR 5",
    "XII PM 1", "XII PM 2", "XII PM 3",
    "XI TKR 1", "XI TKR 2", ...
  ],
  "tingkat": ["XII", "XI", "X"],
  "jurusanKelas": ["TKR", "PM", "TJKT", "APAT", "ATPH", "ATUG"],
  "jurusanSekolah": [],
  "stats": {
    "totalKelas": 45,
    "totalTingkat": 3,
    "totalJurusan": 6,
    "totalJurusanSekolah": 0
  }
}
```

### 3. UI Filter di Halaman Data Siswa

Di halaman `/admin/siswa`, terdapat 3 dropdown filter:

**Filter 1: Tingkat**
- Semua Tingkat
- Kelas XII
- Kelas XI
- Kelas X

**Filter 2: Jurusan**
- Semua Jurusan
- TKR (Teknik Kendaraan Ringan)
- PM (Perbankan dan Keuangan Mikro)
- TJKT (Teknik Jaringan Komputer dan Telekomunikasi)
- APAT (Agribisnis Pengolahan Hasil Pertanian)
- ATPH (Agribisnis Tanaman Pangan dan Hortikultura)
- ATUG (Agribisnis Ternak Unggas)
- dll (sesuai data yang ada)

**Filter 3: Rombel**
- Semua Rombel
- XII TKR 1, XII TKR 2, XII TKR 3, dst.

### 4. Algoritma Parsing Kelas

```typescript
// Input: "XII TKR 5"
const match = kelas.match(/^([X]+I*)\s+([A-Z]+)\s+(\d+)$/);

if (match) {
  const tingkat = match[1]; // "XII"
  const jurusan = match[2]; // "TKR"
  const rombel = match[3];  // "5"
}
```

**Sorting:**
- Tingkat: XII → XI → X (descending)
- Jurusan: Alfabetis (APAT → ATPH → ATUG → PM → TJKT → TKR)
- Rombel: Numerik (1 → 2 → 3 → 4 → 5)

## Keuntungan Sistem Ini

✅ **Auto-detect:** Tidak perlu input manual daftar kelas
✅ **Dynamic:** Filter berubah otomatis sesuai data yang sudah diimport
✅ **Scalable:** Bisa handle ratusan rombel berbeda
✅ **Smart Sorting:** Urutan logis XII → XI → X
✅ **Real-time:** Langsung update setelah import Excel baru

## Update yang Sudah Dilakukan

### File Baru:
1. `/src/app/api/admin/siswa/filters/route.ts` - API untuk ambil filter options

### File Diupdate:
1. `/src/app/admin/siswa/page.tsx`
   - State baru: `filterOptions`, `filterTingkat`
   - Function baru: `fetchFilterOptions()`
   - Filter logic: Support tingkat + jurusan + rombel
   - UI: 3 dropdown dinamis

2. `/src/app/api/admin/siswa/import/route.ts`
   - Field `kelas` sudah disimpan dengan format lengkap (XII TKR 5)
   - Error handling yang lebih baik

## Testing

Setelah import 2000+ siswa dari Excel Dapodik:

```
Total Kelas Terdeteksi: 45 rombel
Total Tingkat: 3 (XII, XI, X)
Total Jurusan: 6 (TKR, PM, TJKT, APAT, ATPH, ATUG)
```

Filter akan menampilkan:
- Dropdown Tingkat: XII, XI, X
- Dropdown Jurusan: 6 pilihan
- Dropdown Rombel: 45 pilihan

## Cara Pakai

1. **Import Excel** dari Dapodik di `/admin/siswa/import`
2. **Sistem otomatis** membaca kolom "Rombel Saat Ini"
3. **Buka** `/admin/siswa`
4. **Filter** otomatis tersedia berdasarkan data yang sudah ada
5. **Pilih** tingkat, jurusan, atau rombel spesifik untuk filter siswa

Tidak ada konfigurasi manual yang diperlukan! 🎉
