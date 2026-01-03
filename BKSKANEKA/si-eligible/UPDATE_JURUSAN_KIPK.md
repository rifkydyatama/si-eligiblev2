# Update: Auto-Detect Jurusan & Fitur Daftar KIP-K

## Perubahan yang Sudah Dilakukan

### 1. ✅ Kolom JURUSAN Auto-Detect dari Kelas

**Masalah Sebelumnya:**
- Kolom JURUSAN menampilkan "BELUM DITENTUKAN" untuk semua siswa
- Data jurusan tidak terkoneksi dengan data import

**Solusi:**
File: `src/app/admin/siswa/page.tsx`

Sistem sekarang otomatis extract jurusan dari field `kelas`:
```typescript
const kelasJurusan = s.kelas.split(' ')[1]; // "XII TKR 5" → "TKR"
```

**Logika Prioritas:**
1. Ambil dari kelas (TKR, PM, TJKT, APAT, ATPH, ATUG, dll)
2. Fallback ke `jurusanSekolah` jika ada
3. Tampilkan "BELUM DITENTUKAN" jika keduanya kosong

**Hasil:**
- Kelas: "XII TKR 3" → Jurusan: **TKR**
- Kelas: "X ATPH 2" → Jurusan: **ATPH**
- Kelas: "XI ANIMASI" → Jurusan: **ANIMASI**

---

### 2. ✅ Status KIP-K Dinamis (3 Status)

**Masalah Sebelumnya:**
- Hanya ada 2 status: PENERIMA / REGULER
- Tidak bisa tracking siswa yang mendaftar

**Solusi:**
Sistem sekarang menampilkan 3 status berbeda:

| Status | Kondisi | Tampilan | Warna |
|--------|---------|----------|-------|
| **PENERIMA** | `statusKIPK = true` | ✅ PENERIMA | Orange |
| **MENDAFTAR** | `mendaftarKIPK = true` | 📝 MENDAFTAR | Green |
| **REGULER** | Kedua field `false` | ⭕ REGULER | Gray |

**Code di Table:**
```tsx
{s.mendaftarKIPK ? (
  <span className="...bg-emerald-100 text-emerald-600...">MENDAFTAR</span>
) : s.statusKIPK ? (
  <span className="...bg-orange-100 text-orange-600...">PENERIMA</span>
) : (
  <span className="...bg-slate-100 text-slate-400...">REGULER</span>
)}
```

---

### 3. ✅ API Mendaftar KIP-K dari Dashboard Siswa

**File Baru:** `src/app/api/siswa/mendaftar-kipk/route.ts`

**Endpoint:**
- **GET** `/api/siswa/mendaftar-kipk` - Cek status KIP-K siswa
- **POST** `/api/siswa/mendaftar-kipk` - Daftar/Batalkan KIP-K

**POST Body:**
```json
{
  "action": "register"  // atau "cancel"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Berhasil mendaftar KIP-K",
  "mendaftarKIPK": true
}
```

**Fitur Keamanan:**
- ✅ Validasi session siswa
- ✅ Cek apakah sudah penerima KIP-K
- ✅ Audit log setiap pendaftaran/pembatalan
- ✅ IP tracking untuk security

**Logika:**
1. Siswa yang sudah `statusKIPK = true` **TIDAK BISA** mendaftar lagi
2. Siswa reguler bisa mendaftar → `mendaftarKIPK = true`
3. Siswa yang sudah mendaftar bisa batalkan → `mendaftarKIPK = false`

---

### 4. ✅ UI Dashboard Siswa - Fitur Daftar KIP-K

**File:** `src/app/siswa/dashboard/page.tsx`

**Tampilan:**
```
┌─────────────────────────────────────────┐
│ Status KIP-K                   [BADGE]  │
├─────────────────────────────────────────┤
│ [Deskripsi Status]                      │
│                                         │
│ [✅ Daftar KIP-K Sekarang] <- Button   │
└─────────────────────────────────────────┘
```

**State Management:**
```typescript
interface KIPKStatus {
  statusKIPK: boolean;      // Sudah penerima
  mendaftarKIPK: boolean;   // Sudah mendaftar
  canRegister: boolean;     // Bisa mendaftar atau tidak
}
```

**Button Logic:**
- **Penerima KIP-K:** Button tidak ditampilkan (sudah penerima)
- **Belum Mendaftar:** Button biru "✅ Daftar KIP-K Sekarang"
- **Sudah Mendaftar:** Button merah "❌ Batalkan Pendaftaran"
- **Loading:** Show spinner "Memproses..."

---

## Flow Lengkap Sistem KIP-K

### Scenario 1: Siswa Reguler Mendaftar
```
1. Dashboard Siswa → Status: ⭕ REGULER
2. Klik "✅ Daftar KIP-K Sekarang"
3. POST /api/siswa/mendaftar-kipk { action: "register" }
4. Database: mendaftarKIPK = true
5. Audit Log: "Siswa X mendaftar KIP-K"
6. Dashboard Siswa → Status: 📝 MENDAFTAR
7. Admin Dashboard → Status: 📝 MENDAFTAR
```

### Scenario 2: Admin Verifikasi Pendaftaran
```
1. Admin melihat siswa dengan status MENDAFTAR
2. Admin update: statusKIPK = true (manual/API)
3. Dashboard Siswa → Status: ✅ PENERIMA
4. Button "Daftar KIP-K" hilang (tidak perlu lagi)
```

### Scenario 3: Siswa Batalkan Pendaftaran
```
1. Dashboard Siswa → Status: 📝 MENDAFTAR
2. Klik "❌ Batalkan Pendaftaran"
3. POST /api/siswa/mendaftar-kipk { action: "cancel" }
4. Database: mendaftarKIPK = false
5. Dashboard Siswa → Status: ⭕ REGULER
6. Button kembali ke "✅ Daftar KIP-K Sekarang"
```

---

## Testing Checklist

### Admin Dashboard (`/admin/siswa`)
- [x] Kolom JURUSAN menampilkan "TKR", "PM", "TJKT", dll (bukan "BELUM DITENTUKAN")
- [x] Status KIP-K menampilkan 3 status: PENERIMA / MENDAFTAR / REGULER
- [x] Grid view juga menampilkan jurusan dan status yang benar

### Dashboard Siswa (`/siswa/dashboard`)
- [x] Tampil section "Status KIP-K"
- [x] Button "Daftar KIP-K" muncul untuk siswa reguler
- [x] Button berubah "Batalkan" setelah mendaftar
- [x] Tidak ada button untuk penerima KIP-K
- [x] Loading state saat proses pendaftaran

### API Endpoint
- [x] GET `/api/siswa/mendaftar-kipk` → Return status
- [x] POST `/api/siswa/mendaftar-kipk` → Register/Cancel
- [x] Audit log tercatat setiap aksi
- [x] Validasi security (hanya siswa yang login)

---

## Database Schema Update

Field yang digunakan di `Siswa` model:
```prisma
model Siswa {
  statusKIPK      Boolean  @default(false)  // Penerima resmi
  mendaftarKIPK   Boolean  @default(false)  // Siswa mendaftar
  kelas           String                     // Format: "XII TKR 5"
}
```

---

## Update Selanjutnya (Opsional)

### Admin: Approve Pendaftaran KIP-K
Buat API untuk admin approve siswa yang mendaftar:
```typescript
POST /api/admin/siswa/approve-kipk
{
  "siswaId": "xxx",
  "approve": true
}
→ Update: statusKIPK = true, mendaftarKIPK = false
```

### Notifikasi Email/WhatsApp
Ketika siswa mendaftar KIP-K, kirim notifikasi ke admin

### Export Data KIP-K
Export Excel siswa yang mendaftar KIP-K untuk dilaporkan

---

## Summary

✅ **Kolom JURUSAN** sekarang auto-detect dari kelas (TKR, PM, TJKT, dll)  
✅ **Status KIP-K** ada 3: PENERIMA (orange), MENDAFTAR (green), REGULER (gray)  
✅ **API Mendaftar KIP-K** sudah tersedia untuk dashboard siswa  
✅ **UI Dashboard Siswa** ada button daftar/batalkan KIP-K  
✅ **Audit Log** setiap aksi tercatat dengan IP tracking  

Sistem sudah terintegrasi penuh! 🎉
