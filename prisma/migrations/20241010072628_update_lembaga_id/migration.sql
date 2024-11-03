-- DropForeignKey
ALTER TABLE `profillembaga` DROP FOREIGN KEY `ProfilLembaga_lembagaId_fkey`;

-- DropForeignKey
ALTER TABLE `tugaspokok` DROP FOREIGN KEY `TugasPokok_lembagaId_fkey`;

-- DropForeignKey
ALTER TABLE `visimisi` DROP FOREIGN KEY `VisiMisi_lembagaId_fkey`;

-- AlterTable
ALTER TABLE `profillembaga` MODIFY `lembagaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tugaspokok` MODIFY `lembagaId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `visimisi` MODIFY `lembagaId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ProfilLembaga` ADD CONSTRAINT `ProfilLembaga_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisiMisi` ADD CONSTRAINT `VisiMisi_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TugasPokok` ADD CONSTRAINT `TugasPokok_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
