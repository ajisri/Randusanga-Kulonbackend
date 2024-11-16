/*
  Warnings:

  - Made the column `apbdId` on table `Keuangan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Keuangan` DROP FOREIGN KEY `Keuangan_apbdId_fkey`;

-- AlterTable
ALTER TABLE `Keuangan` MODIFY `apbdId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_apbdId_fkey` FOREIGN KEY (`apbdId`) REFERENCES `Apbd`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
