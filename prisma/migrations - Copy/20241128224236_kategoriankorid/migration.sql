-- DropForeignKey
ALTER TABLE `Subkategoriankor` DROP FOREIGN KEY `Subkategoriankor_kategoriankorId_fkey`;

-- AlterTable
ALTER TABLE `Subkategoriankor` MODIFY `kategoriankorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Subkategoriankor` ADD CONSTRAINT `Subkategoriankor_kategoriankorId_fkey` FOREIGN KEY (`kategoriankorId`) REFERENCES `Kategoriankor`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
