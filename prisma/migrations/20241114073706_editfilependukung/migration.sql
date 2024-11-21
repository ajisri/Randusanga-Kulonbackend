/*
  Warnings:

  - You are about to drop the column `filePendukungId` on the `Keuangan` table. All the data in the column will be lost.
  - You are about to drop the `FilePendukung` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Keuangan` DROP FOREIGN KEY `Keuangan_filePendukungId_fkey`;

-- AlterTable
ALTER TABLE `Keuangan` DROP COLUMN `filePendukungId`,
    ADD COLUMN `apbdId` INTEGER NULL;

-- DropTable
DROP TABLE `FilePendukung`;

-- CreateTable
CREATE TABLE `Apbd` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `year` INTEGER NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_apbdId_fkey` FOREIGN KEY (`apbdId`) REFERENCES `Apbd`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
