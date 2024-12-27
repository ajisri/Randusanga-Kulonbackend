/*
  Warnings:

  - You are about to drop the column `jabatanUuid` on the `masajabatan` table. All the data in the column will be lost.
  - Added the required column `jabatanId` to the `MasaJabatan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `masajabatan` DROP FOREIGN KEY `MasaJabatan_jabatanUuid_fkey`;

-- AlterTable
ALTER TABLE `masajabatan` DROP COLUMN `jabatanUuid`,
    ADD COLUMN `jabatanId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `MasaJabatan` ADD CONSTRAINT `MasaJabatan_jabatanId_fkey` FOREIGN KEY (`jabatanId`) REFERENCES `Jabatan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
