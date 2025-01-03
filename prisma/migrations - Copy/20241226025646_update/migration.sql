/*
  Warnings:

  - You are about to drop the `masajabatan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `masajabatan` DROP FOREIGN KEY `MasaJabatan_createdbyId_fkey`;

-- DropForeignKey
ALTER TABLE `masajabatan` DROP FOREIGN KEY `MasaJabatan_jabatanId_fkey`;

-- DropTable
DROP TABLE `masajabatan`;
