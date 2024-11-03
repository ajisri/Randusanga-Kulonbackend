/*
  Warnings:

  - You are about to drop the column `demografiId` on the `anggota` table. All the data in the column will be lost.
  - Added the required column `demografiDesaid` to the `Anggota` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `anggota` DROP FOREIGN KEY `Anggota_demografiId_fkey`;

-- AlterTable
ALTER TABLE `anggota` DROP COLUMN `demografiId`,
    ADD COLUMN `demografiDesaid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_demografiDesaid_fkey` FOREIGN KEY (`demografiDesaid`) REFERENCES `Demographics`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
