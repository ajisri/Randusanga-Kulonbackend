-- DropForeignKey
ALTER TABLE `pengumuman` DROP FOREIGN KEY `Pengumuman_createdbyId_fkey`;

-- AlterTable
ALTER TABLE `pengumuman` MODIFY `createdbyId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
