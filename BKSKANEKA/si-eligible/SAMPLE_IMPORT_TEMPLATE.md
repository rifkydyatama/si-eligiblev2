# Sample Import Excel Template

## Format 1: Minimal (NISN + Subjects)
```
NISN       | Matematika | Bahasa Indonesia | Bahasa Inggris | Fisika | Kimia
0012345678 | 85         | 90               | 88             | 92     | 87
0087654321 | 92         | 88               | 91             | 89     | 90
0056781234 | 78         | 85               | 82             | 80     | 83
```

## Format 2: Complete (With Student Info)
```
NISN       | Nama            | Kelas | Jurusan | Matematika | Bahasa Indonesia | Bahasa Inggris | Fisika | Kimia | Biologi
0012345678 | Ahmad Fauzi     | XII-1 | IPA     | 85         | 90               | 88             | 92     | 87    | 89
0087654321 | Siti Nurhaliza  | XII-1 | IPA     | 92         | 88               | 91             | 89     | 90    | 93
0056781234 | Budi Santoso    | XII-2 | IPA     | 78         | 85               | 82             | 80     | 83    | 81
0034567890 | Rina Kartika    | XII-1 | IPS     | 88         | 92               | 87             | -      | -     | -
0045678901 | Dedi Kurniawan  | XII-2 | IPS     | 85         | 89               | 84             | -      | -     | -
```

## Format 3: With Semester Column
```
NISN       | Semester | Matematika | Bahasa Indonesia | Bahasa Inggris
0012345678 | 5        | 85         | 90               | 88
0087654321 | 5        | 92         | 88               | 91
0056781234 | 5        | 78         | 85               | 82
```

## Format 4: PDSS Compatible
```
NISN       | NAMA_LENGKAP    | MTK | BIND | BING | FIS | KIM | BIO
0012345678 | Ahmad Fauzi     | 85  | 90   | 88   | 92  | 87  | 89
0087654321 | Siti Nurhaliza  | 92  | 88   | 91   | 89  | 90  | 93
```

## Format 5: e-Rapor Format
```
No | NISN       | Nama Siswa      | Kelas | Pendidikan Agama | PKN | B. Indonesia | Matematika | IPA
1  | 0012345678 | Ahmad Fauzi     | XII-1 | 88               | 90  | 90           | 85         | 92
2  | 0087654321 | Siti Nurhaliza  | XII-1 | 92               | 91  | 88           | 92         | 89
3  | 0056781234 | Budi Santoso    | XII-2 | 85               | 87  | 85           | 78         | 80
```

---

## Important Notes:

### ✅ Required
- **NISN column** - MUST exist with header containing "NISN", "NIS", or "Nomor Induk"
- **At least 1 subject column** - Any column not matching core patterns (NISN/Nama/Kelas/Jurusan) will be treated as subject

### ✨ Optional
- **Semester** - Can be in Excel or set via form dropdown
- **Nama** - For reference only, not used in import logic
- **Kelas** - For reference only
- **Jurusan** - Used for auto-detection and filtering

### 🎯 Subject Name Mapping
System auto-normalizes these variations:
- `MTK`, `Matematika`, `Math` → **Matematika**
- `BIND`, `B. Indonesia`, `Bahasa Indonesia` → **Bahasa Indonesia**
- `BING`, `B. Inggris`, `English` → **Bahasa Inggris**
- `PAI`, `Pendidikan Agama` → **Pendidikan Agama dan Budi Pekerti**
- `PKN`, `PPKN` → **Pendidikan Pancasila dan Kewarganegaraan**
- `FIS`, `Fisika`, `Physics` → **Fisika**
- `KIM`, `Kimia`, `Chemistry` → **Kimia**
- `BIO`, `Biologi`, `Biology` → **Biologi**

### 💡 Tips
1. Use **ONE semester per file** for clarity
2. Empty cells or `-` will be skipped
3. NISN format: Plain numbers (no quotes needed)
4. Subject columns can be in ANY order - system tracks with headerIndex
5. Max file size: Recommended < 5MB

---

## Testing Checklist

Before importing to production:

- [ ] NISN column exists and detected
- [ ] Sample 5-10 rows imports successfully
- [ ] Subject names normalized correctly
- [ ] NISN matched dengan data siswa existing
- [ ] Created/Updated counts make sense
- [ ] No critical errors in error list
- [ ] Export generates file with same column order

---

**Download this as Excel template from**: `/admin/nilai` → "Unduh Template Nilai"
