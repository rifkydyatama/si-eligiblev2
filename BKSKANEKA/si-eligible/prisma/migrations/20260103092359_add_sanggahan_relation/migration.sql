-- AddForeignKey
ALTER TABLE `Sanggahan` ADD CONSTRAINT `Sanggahan_nilaiId_fkey` FOREIGN KEY (`nilaiId`) REFERENCES `NilaiRapor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
