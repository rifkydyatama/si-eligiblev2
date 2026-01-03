# Quick Start - Sinkronisasi Dapodik

## Setup Cepat

### 1. Buat Endpoint API di Server Dapodik Anda

#### Contoh PHP Sederhana
Buat file `api_siswa.php` di server Dapodik:

```php
<?php
// api_siswa.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Untuk development

// Koneksi database Dapodik
$host = 'localhost';
$dbname = 'dapodik';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Query siswa kelas 12
    $stmt = $pdo->query("
        SELECT 
            nisn,
            nama_lengkap as nama,
            tanggal_lahir,
            CONCAT('12 ', nama_rombel) as kelas,
            kompetensi_keahlian as jurusan,
            email,
            no_hp as no_telepon,
            CASE WHEN penerima_kip = 1 THEN true ELSE false END as penerima_kipk
        FROM peserta_didik
        WHERE tingkat = 12
        AND status_aktif = 1
    ");
    
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($data);
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
```

**URL API**: `http://server-dapodik.sekolah.local/api_siswa.php`

### 2. Test API di Browser/Postman

Buka URL API di browser, pastikan return JSON seperti ini:
```json
[
  {
    "nisn": "0012345678",
    "nama": "Ahmad Fauzi",
    "tanggal_lahir": "2007-05-15",
    "kelas": "12 IPA 1",
    "jurusan": "Ilmu Pengetahuan Alam",
    "email": null,
    "no_telepon": "081234567890",
    "penerima_kipk": false
  }
]
```

### 3. Gunakan Fitur Sync di SI-Eligible

1. Login sebagai Admin
2. Menu: **Admin → Siswa → Import Data**
3. Klik tombol **"Sync Dapodik"** (biru, pojok kanan)
4. Masukkan URL: `http://server-dapodik.sekolah.local/api_siswa.php`
5. Token: kosongkan (untuk contoh sederhana)
6. Klik **"Mulai Sinkronisasi"**

### 4. Verifikasi Hasil

Setelah sinkronisasi selesai:
- Cek jumlah **Siswa Baru** yang berhasil ditambahkan
- Cek jumlah **Data Diupdate** (untuk siswa yang sudah ada)
- Lihat list siswa di menu **Admin → Siswa**

## Setup dengan Autentikasi (Recommended)

### PHP dengan Token Sederhana

```php
<?php
// api_siswa_secure.php
header('Content-Type: application/json');

// Validasi token
$headers = getallheaders();
$expectedToken = 'secret-token-sekolah-123'; // Ganti dengan token rahasia

if (!isset($headers['Authorization']) || $headers['Authorization'] !== "Bearer $expectedToken") {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// ... lanjutkan dengan query database seperti contoh sebelumnya
?>
```

Di SI-Eligible:
- **URL**: `http://server-dapodik.sekolah.local/api_siswa_secure.php`
- **Token**: `secret-token-sekolah-123`

## Troubleshooting Cepat

### ❌ Error: "Gagal mengambil data dari Dapodik"

**Cek:**
1. Apakah URL bisa diakses dari browser?
2. Apakah server Dapodik online?
3. Apakah ada firewall yang memblokir?

**Solusi:**
```bash
# Test koneksi
ping server-dapodik.sekolah.local

# Test API dengan curl
curl http://server-dapodik.sekolah.local/api_siswa.php
```

### ❌ Error CORS (di browser console)

**Tambahkan di file PHP:**
```php
header('Access-Control-Allow-Origin: https://si-eligible.sekolah.sch.id');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### ❌ "Format response tidak valid"

**Cek response API, pastikan:**
- Return valid JSON
- Berupa array: `[...]` atau object: `{"data": [...]}`
- Tidak ada HTML error

### ⚠️ Tidak ada siswa yang masuk

**Kemungkinan:**
- Semua NISN sudah ada (duplikat) → cek "Data Duplikat"
- Query database tidak return data → cek di Dapodik
- Filter `tingkat = 12` terlalu ketat → sesuaikan query

## Maintenance

### Update Data Reguler

**Manual:**
- Buka halaman import
- Klik "Sync Dapodik"
- Lakukan sekali seminggu atau sesuai kebutuhan

**Rencana Otomatis (Coming Soon):**
- Sinkronisasi terjadwal via cronjob
- Webhook dari Dapodik saat ada perubahan

### Backup Sebelum Sync

Sangat disarankan backup database sebelum sinkronisasi pertama:

```bash
# MySQL
mysqldump -u root -p si_eligible > backup_before_sync.sql

# Restore jika ada masalah
mysql -u root -p si_eligible < backup_before_sync.sql
```

## Tips & Best Practices

✅ **DO:**
- Gunakan HTTPS untuk production
- Implementasi autentikasi token
- Lakukan sync saat jam sepi (malam/pagi)
- Backup database secara berkala
- Monitor audit log

❌ **DON'T:**
- Expose API tanpa autentikasi ke internet
- Sync saat jam aktif (banyak user)
- Lupa backup sebelum sync pertama kali

## Kontak Support

Jika ada kendala:
1. Baca dokumentasi lengkap: `DOKUMENTASI_SINKRONISASI_DAPODIK.md`
2. Cek error di browser console (F12)
3. Hubungi admin sistem dengan screenshot error
