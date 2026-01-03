-- AlterTable
ALTER TABLE `TemplateExport` ADD COLUMN `fileTemplate` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MapelMapping` (
    `id` VARCHAR(191) NOT NULL,
    `tahunAkademikId` VARCHAR(191) NULL,
    `mataPelajaranSistem` VARCHAR(191) NOT NULL,
    `mataPelajaranPDSS` VARCHAR(191) NULL,
    `mataPelajaranPTKIN` VARCHAR(191) NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `kelompok` VARCHAR(191) NULL,
    `kodeMapel` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `MapelMapping_kategori_idx`(`kategori`),
    UNIQUE INDEX `MapelMapping_mataPelajaranSistem_key`(`mataPelajaranSistem`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TemplateNilaiPDSS` (
    `id` VARCHAR(191) NOT NULL,
    `tahunAkademikId` VARCHAR(191) NOT NULL,
    `namaTemplate` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `strukturTemplate` JSON NOT NULL,
    `mappingMapel` JSON NOT NULL,
    `formatSheet` JSON NOT NULL,
    `fileTemplate` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TemplateNilaiPDSS_tahunAkademikId_idx`(`tahunAkademikId`),
    INDEX `TemplateNilaiPDSS_semester_idx`(`semester`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TemplateNilaiPTKIN` (
    `id` VARCHAR(191) NOT NULL,
    `tahunAkademikId` VARCHAR(191) NOT NULL,
    `namaTemplate` VARCHAR(191) NOT NULL,
    `semester` INTEGER NOT NULL,
    `strukturTemplate` JSON NOT NULL,
    `mappingMapel` JSON NOT NULL,
    `formatSheet` JSON NOT NULL,
    `fileTemplate` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TemplateNilaiPTKIN_tahunAkademikId_idx`(`tahunAkademikId`),
    INDEX `TemplateNilaiPTKIN_semester_idx`(`semester`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `TemplateExport_jenisExport_idx` ON `TemplateExport`(`jenisExport`);
