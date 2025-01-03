/*
  Warnings:

  - You are about to drop the column `url` on the `Subkategoriankor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Subkategoriankor` DROP COLUMN `url`;

-- CreateTable
CREATE TABLE `Poinsubkategoriankor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `subkategoriankorId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Poinsubkategoriankor_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Poinsubkategoriankor` ADD CONSTRAINT `Poinsubkategoriankor_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Poinsubkategoriankor` ADD CONSTRAINT `Poinsubkategoriankor_subkategoriankorId_fkey` FOREIGN KEY (`subkategoriankorId`) REFERENCES `Subkategoriankor`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
