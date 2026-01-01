/*
  Warnings:

  - You are about to drop the column `jurusan` on the `Siswa` table. All the data in the column will be lost.

*/

-- STEP 1: Create JurusanSekolah table first
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

-- STEP 2: Insert default jurusan data
INSERT INTO `JurusanSekolah` (`id`, `kode`, `nama`, `tingkat`, `isActive`, `createdAt`, `updatedAt`) VALUES
('js_ipa_001', 'IPA', 'IPA (Ilmu Pengetahuan Alam)', 'SMA', true, NOW(3), NOW(3)),
('js_ips_002', 'IPS', 'IPS (Ilmu Pengetahuan Sosial)', 'SMA', true, NOW(3), NOW(3)),
('js_bahasa_003', 'BAHASA', 'Bahasa', 'SMA', true, NOW(3), NOW(3)),
('js_tkj_004', 'TKJ', 'Teknik Komputer dan Jaringan', 'SMK', true, NOW(3), NOW(3)),
('js_rpl_005', 'RPL', 'Rekayasa Perangkat Lunak', 'SMK', true, NOW(3), NOW(3)),
('js_akl_006', 'AKL', 'Akuntansi dan Keuangan Lembaga', 'SMK', true, NOW(3), NOW(3)),
('js_otkp_007', 'OTKP', 'Otomatisasi dan Tata Kelola Perkantoran', 'SMK', true, NOW(3), NOW(3)),
('js_bdp_008', 'BDP', 'Bisnis Daring dan Pemasaran', 'SMK', true, NOW(3), NOW(3)),
('js_mm_009', 'MM', 'Multimedia', 'SMK', true, NOW(3), NOW(3)),
('js_tkr_010', 'TKR', 'Teknik Kendaraan Ringan', 'SMK', true, NOW(3), NOW(3));

-- STEP 3: Add new column jurusanId (nullable first)
ALTER TABLE `Siswa` ADD COLUMN `jurusanId` VARCHAR(191) NULL;

-- STEP 4: Migrate data from old jurusan column to new jurusanId
-- Map berdasarkan kode yang matching
UPDATE `Siswa` s
JOIN `JurusanSekolah` js ON UPPER(TRIM(s.`jurusan`)) = js.`kode`
SET s.`jurusanId` = js.`id`;

-- STEP 5: Handle unmapped data - set default to IPA
UPDATE `Siswa` 
SET `jurusanId` = 'js_ipa_001' 
WHERE `jurusanId` IS NULL AND `jurusan` IS NOT NULL;

-- STEP 6: Drop old index
DROP INDEX `Siswa_kelas_jurusan_idx` ON `Siswa`;

-- STEP 7: Drop old column jurusan (data already migrated)
ALTER TABLE `Siswa` DROP COLUMN `jurusan`;

-- STEP 8: Create new indexes
CREATE INDEX `Siswa_kelas_jurusanId_idx` ON `Siswa`(`kelas`, `jurusanId`);
CREATE INDEX `Siswa_jurusanId_idx` ON `Siswa`(`jurusanId`);

-- STEP 9: Add foreign key constraint (SET NULL on delete untuk keamanan)
ALTER TABLE `Siswa` ADD CONSTRAINT `Siswa_jurusanId_fkey` 
FOREIGN KEY (`jurusanId`) REFERENCES `JurusanSekolah`(`id`) 
ON DELETE SET NULL ON UPDATE CASCADE;

