-- CreateTable
CREATE TABLE `JurusanSekolah` (
    `id` VARCHAR(191) NOT NULL,
    `kode` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `tingkat` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JurusanSekolah_kode_key`(`kode`),
    INDEX `JurusanSekolah_kode_idx`(`kode`),
    INDEX `JurusanSekolah_tingkat_idx`(`tingkat`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable Siswa - Ubah jurusan menjadi jurusanId dengan relasi
-- STEP 1: Tambah kolom baru jurusanId
ALTER TABLE `Siswa` ADD COLUMN `jurusanId` VARCHAR(191);

-- STEP 2: Seed data jurusan sekolah
INSERT INTO `JurusanSekolah` (`id`, `kode`, `nama`, `tingkat`, `isActive`, `createdAt`, `updatedAt`) VALUES
('js_ipa_001', 'IPA', 'IPA (Ilmu Pengetahuan Alam)', 'SMA', true, NOW(), NOW()),
('js_ips_002', 'IPS', 'IPS (Ilmu Pengetahuan Sosial)', 'SMA', true, NOW(), NOW()),
('js_bahasa_003', 'BAHASA', 'Bahasa', 'SMA', true, NOW(), NOW()),
('js_tkj_004', 'TKJ', 'Teknik Komputer dan Jaringan', 'SMK', true, NOW(), NOW()),
('js_rpl_005', 'RPL', 'Rekayasa Perangkat Lunak', 'SMK', true, NOW(), NOW()),
('js_akl_006', 'AKL', 'Akuntansi dan Keuangan Lembaga', 'SMK', true, NOW(), NOW()),
('js_otkp_007', 'OTKP', 'Otomatisasi dan Tata Kelola Perkantoran', 'SMK', true, NOW(), NOW()),
('js_bdp_008', 'BDP', 'Bisnis Daring dan Pemasaran', 'SMK', true, NOW(), NOW()),
('js_mm_009', 'MM', 'Multimedia', 'SMK', true, NOW(), NOW()),
('js_tkr_010', 'TKR', 'Teknik Kendaraan Ringan', 'SMK', true, NOW(), NOW());

-- STEP 3: Migrate existing data - Map string jurusan ke jurusanId
UPDATE `Siswa` s
JOIN `JurusanSekolah` js ON UPPER(s.`jurusan`) = js.`kode`
SET s.`jurusanId` = js.`id`;

-- STEP 4: Set default untuk siswa yang belum ter-mapping (jika ada)
-- Gunakan IPA sebagai default
UPDATE `Siswa` 
SET `jurusanId` = 'js_ipa_001' 
WHERE `jurusanId` IS NULL;

-- STEP 5: Set jurusanId sebagai NOT NULL
ALTER TABLE `Siswa` MODIFY `jurusanId` VARCHAR(191) NOT NULL;

-- STEP 6: Tambah foreign key constraint
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_jurusanId_fkey` 
FOREIGN KEY (`jurusanId`) REFERENCES `JurusanSekolah`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- STEP 7: Tambah index untuk performa
CREATE INDEX `Siswa_jurusanId_idx` ON `Siswa`(`jurusanId`);
CREATE INDEX `Siswa_kelas_jurusanId_idx` ON `Siswa`(`kelas`, `jurusanId`);

-- STEP 8: Hapus kolom lama jurusan (optional - hati-hati!)
-- ALTER TABLE `Siswa` DROP COLUMN `jurusan`;

-- STEP 9: Drop index lama yang menggunakan kolom jurusan
DROP INDEX `Siswa_kelas_jurusan_idx` ON `Siswa`;
