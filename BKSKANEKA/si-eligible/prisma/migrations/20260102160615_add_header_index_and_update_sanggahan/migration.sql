-- AlterTable
ALTER TABLE `NilaiRapor` ADD COLUMN `headerIndex` INTEGER NULL;

-- AlterTable
ALTER TABLE `Sanggahan` ADD COLUMN `alasan` TEXT NULL,
    ADD COLUMN `nilaiId` VARCHAR(191) NULL,
    MODIFY `buktiRapor` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `NilaiRapor_isVerified_idx` ON `NilaiRapor`(`isVerified`);

-- CreateIndex
CREATE INDEX `Sanggahan_semester_idx` ON `Sanggahan`(`semester`);
