/*
  Warnings:

  - You are about to drop the column `lembagaId` on the `anggota` table. All the data in the column will be lost.
  - Added the required column `lembagaDesaid` to the `Anggota` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `anggota` DROP FOREIGN KEY `Anggota_lembagaId_fkey`;

-- AlterTable
ALTER TABLE `anggota` DROP COLUMN `lembagaId`,
    ADD COLUMN `lembagaDesaid` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_lembagaDesaid_fkey` FOREIGN KEY (`lembagaDesaid`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
