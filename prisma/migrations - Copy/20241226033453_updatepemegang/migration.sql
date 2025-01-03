-- AlterTable
ALTER TABLE `jabatan` ADD COLUMN `pemegangId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Jabatan` ADD CONSTRAINT `Jabatan_pemegangId_fkey` FOREIGN KEY (`pemegangId`) REFERENCES `Demographics`(`uuid`) ON DELETE SET NULL ON UPDATE CASCADE;
