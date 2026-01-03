-- DropForeignKey
ALTER TABLE `Kelulusan` DROP FOREIGN KEY `Kelulusan_jurusanId_fkey`;

-- DropForeignKey
ALTER TABLE `Kelulusan` DROP FOREIGN KEY `Kelulusan_kampusId_fkey`;

-- DropForeignKey (siswaId FK must be dropped first before dropping unique index)
ALTER TABLE `Kelulusan` DROP FOREIGN KEY `Kelulusan_siswaId_fkey`;

-- DropIndex
DROP INDEX `Kelulusan_siswaId_key` ON `Kelulusan`;

-- AlterTable
ALTER TABLE `Kelulusan` MODIFY `kampusId` VARCHAR(191) NULL,
    MODIFY `jurusanId` VARCHAR(191) NULL,
    MODIFY `buktiPenerimaan` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Kelulusan_siswaId_idx` ON `Kelulusan`(`siswaId`);

-- AddForeignKey
ALTER TABLE `Kelulusan` ADD CONSTRAINT `Kelulusan_jurusanId_fkey` FOREIGN KEY (`jurusanId`) REFERENCES `MasterJurusan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kelulusan` ADD CONSTRAINT `Kelulusan_kampusId_fkey` FOREIGN KEY (`kampusId`) REFERENCES `MasterKampus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey (recreate siswaId FK without unique constraint)
ALTER TABLE `Kelulusan` ADD CONSTRAINT `Kelulusan_siswaId_fkey` FOREIGN KEY (`siswaId`) REFERENCES `Siswa`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
