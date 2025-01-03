/*
  Warnings:

  - You are about to drop the column `fungsi` on the `Jabatan` table. All the data in the column will be lost.
  - You are about to drop the column `tugas` on the `Jabatan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Jabatan` DROP COLUMN `fungsi`,
    DROP COLUMN `tugas`;

-- CreateTable
CREATE TABLE `Tugas` (
    `id` VARCHAR(191) NOT NULL,
    `namatugas` VARCHAR(191) NOT NULL,
    `jabatanId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Fungsi` (
    `id` VARCHAR(191) NOT NULL,
    `namafungsi` VARCHAR(191) NOT NULL,
    `jabatanId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tugas` ADD CONSTRAINT `Tugas_jabatanId_fkey` FOREIGN KEY (`jabatanId`) REFERENCES `Jabatan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Fungsi` ADD CONSTRAINT `Fungsi_jabatanId_fkey` FOREIGN KEY (`jabatanId`) REFERENCES `Jabatan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
