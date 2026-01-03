# Dokumentasi Fitur Sinkronisasi Dapodik

## Overview
Fitur sinkronisasi Dapodik memungkinkan admin untuk mengambil data siswa secara langsung dari server Dapodik sekolah melalui API endpoint, tanpa perlu melakukan import manual melalui file Excel.

## Lokasi Fitur
- **Halaman**: `/admin/siswa/import`
- **Tombol**: "Sync Dapodik" (di bagian header, pojok kanan atas)

## Cara Menggunakan

### 1. Akses Halaman Import
- Login sebagai Admin atau Guru BK
- Navigasi ke **Admin > Siswa > Import Data**

### 2. Klik Tombol "Sync Dapodik"
- Tombol berwarna biru dengan icon Cloud
- Akan membuka modal dialog sinkronisasi

### 3. Masukkan Konfigurasi API

#### URL API Dapodik (Wajib)
- Masukkan endpoint API Dapodik sekolah
- Format: `https://dapodik.sekolah.sch.id/api/siswa`
- Contoh lain: `http://localhost:3000/api/dapodik/students`

#### Token Autentikasi (Opsional)
- Jika API Dapodik memerlukan autentikasi
- Masukkan Bearer token atau API key
- Kosongkan jika API tidak memerlukan autentikasi

### 4. Klik "Mulai Sinkronisasi"
- Sistem akan melakukan request ke API Dapodik
- Progress ditampilkan dengan animasi loading
- Waktu timeout: 30 detik

### 5. Hasil Sinkronisasi
Setelah proses selesai, sistem akan menampilkan:
- **Siswa Baru**: Jumlah siswa yang ditambahkan ke database
- **Data Diupdate**: Jumlah siswa yang datanya diperbaharui
- **Data Duplikat**: Siswa yang sudah ada (tidak diproses)
- **Error**: Jumlah data yang gagal diproses

## Format Data API Dapodik

### Format Response yang Didukung

#### Format Array Langsung
```json
[
  {
    "nisn": "0012345678",
    "nama": "Ahmad Fauzi",
    "tanggal_lahir": "2007-05-15",
    "kelas": "12",
    "jurusan": "IPA",
    "email": "ahmad@example.com",
    "no_telepon": "081234567890",
    "penerima_kipk": true
  }
]
```

#### Format dengan Wrapper Object
```json
{
  "success": true,
  "data": [
    {
      "nisn": "0012345678",
      "nama": "Ahmad Fauzi",
      ...
    }
  ]
}
```

#### Format dengan Property 'rows'
```json
{
  "rows": [
    {
      "nisn": "0012345678",
      "nama": "Ahmad Fauzi",
      ...
    }
  ]
}
```

### Field yang Diperlukan

#### Field Wajib
- `nisn` (string) - NISN siswa minimal 8 digit
- `nama` (string) - Nama lengkap siswa

#### Field Opsional
- `tanggal_lahir` (string/date) - Format: YYYY-MM-DD atau ISO 8601
- `kelas` (string) - Default: "12"
- `jurusan` (string) - Nama jurusan (akan dicocokkan dengan master jurusan)
- `email` (string) - Email siswa
- `no_telepon` (string) - Nomor telepon/HP
- `penerima_kipk` (boolean) - Status penerima KIP-K

## Logika Sinkronisasi

### 1. Validasi Data
- NISN harus minimal 8 digit (karakter non-digit dihapus otomatis)
- Nama tidak boleh kosong
- Tanggal lahir diparse dengan fallback ke 2007-01-01

### 2. Deteksi Duplikat
- Sistem mengecek NISN yang sudah ada di database
- Jika NISN sudah ada → **UPDATE** data siswa
- Jika NISN belum ada → **INSERT** siswa baru

### 3. Update Data Siswa
Jika siswa sudah ada, field berikut akan diupdate:
- Nama
- Tanggal Lahir
- Kelas (jika ada di API)
- Email (jika ada di API)
- No Telepon (jika ada di API)
- Status KIP-K (jika ada di API)

### 4. Matching Jurusan
- Sistem akan mencari jurusan di database berdasarkan nama
- Pencarian menggunakan `contains` (substring matching)
- Jika tidak ditemukan, field jurusan dikosongkan

## Contoh Implementasi API Dapodik

### PHP (Simple)
```php
<?php
header('Content-Type: application/json');

// Query ke database Dapodik
$query = "SELECT 
    nisn, 
    nama, 
    tanggal_lahir, 
    kelas, 
    jurusan,
    email,
    no_hp as no_telepon
FROM siswa 
WHERE tingkat = 12";

$result = mysqli_query($conn, $query);
$data = [];

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
```

### Node.js/Express
```javascript
app.get('/api/siswa', async (req, res) => {
  try {
    const siswa = await db.query(`
      SELECT 
        nisn, 
        nama, 
        tanggal_lahir, 
        kelas, 
        jurusan,
        email,
        no_telepon
      FROM siswa 
      WHERE tingkat = 12
    `);
    
    res.json(siswa.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Security & Authorization

### Token Authentication
Jika API Dapodik dilindungi dengan autentikasi:

1. **Bearer Token**
   - Header: `Authorization: Bearer <token>`
   - Masukkan token di field "Token Autentikasi"

2. **API Key**
   - Bisa menggunakan header custom
   - Implementasi di server Dapodik

### Contoh Generate Token (Sederhana)
```javascript
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { school: 'SMKN1' },
  'secret-key',
  { expiresIn: '24h' }
);
```

## Troubleshooting

### Error: "Gagal mengambil data dari Dapodik"
**Kemungkinan Penyebab:**
- URL API salah atau tidak dapat diakses
- Server Dapodik sedang offline
- Timeout (lebih dari 30 detik)
- CORS error (jika API di domain berbeda)

**Solusi:**
1. Cek URL API di browser
2. Pastikan server Dapodik aktif
3. Cek koneksi jaringan
4. Tambahkan CORS headers di server Dapodik

### Error: "Format response Dapodik tidak valid"
**Penyebab:**
- Response bukan format JSON
- Struktur data tidak sesuai (bukan array atau object dengan data/rows)

**Solusi:**
- Cek response API di browser/Postman
- Pastikan return JSON array atau object dengan property `data`/`rows`

### Error: "NISN tidak valid"
**Penyebab:**
- NISN kurang dari 8 digit
- NISN kosong di data API

**Solusi:**
- Perbaiki data di database Dapodik
- Pastikan field NISN terisi dengan benar

### Tidak ada data yang tersinkronisasi
**Kemungkinan:**
- API return array kosong
- Semua NISN sudah ada (duplikat)

**Solusi:**
- Cek data di server Dapodik
- Lihat jumlah "Data Duplikat" di hasil sinkronisasi

## Audit Log
Setiap sinkronisasi akan tercatat di Audit Log dengan detail:
- User yang melakukan sinkronisasi
- Waktu sinkronisasi
- Jumlah data baru, update, duplikat, dan error
- URL sumber data

## Keamanan
1. **Authorization**: Hanya Admin dan Guru BK yang dapat mengakses
2. **Validation**: Data divalidasi sebelum disimpan
3. **Error Handling**: Error ditangani dengan baik tanpa expose sensitive info
4. **Audit Trail**: Semua aktivitas tercatat

## Best Practices

### Untuk Admin Sekolah
1. Pastikan server Dapodik dapat diakses dari jaringan SI-Eligible
2. Gunakan HTTPS untuk keamanan data
3. Implementasi autentikasi token untuk API
4. Lakukan sinkronisasi saat jam sepi untuk performa optimal
5. Backup database sebelum sinkronisasi besar pertama kali

### Untuk Developer API Dapodik
1. Gunakan pagination untuk data banyak (>1000 siswa)
2. Implementasi caching untuk mengurangi beban database
3. Rate limiting untuk mencegah abuse
4. Logging untuk debugging
5. Return proper HTTP status codes

## Roadmap Features
- [ ] Sinkronisasi terjadwal (cronjob)
- [ ] Pilih tingkat/kelas yang akan disinkronkan
- [ ] Preview data sebelum sinkronisasi
- [ ] History sinkronisasi dengan detail
- [ ] Sinkronisasi nilai raport dari Dapodik
- [ ] Webhook untuk auto-sync saat ada perubahan

## Support
Jika mengalami kendala:
1. Cek dokumentasi ini terlebih dahulu
2. Lihat error log di console browser (F12)
3. Hubungi administrator sistem
4. Buat issue ticket dengan detail error
