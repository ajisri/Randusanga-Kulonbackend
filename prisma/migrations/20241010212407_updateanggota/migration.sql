/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Anggota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lembagaId]` on the table `Anggota` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[demografiId]` on the table `Anggota` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Anggota` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `anggota` DROP FOREIGN KEY `Anggota_demografiId_fkey`;

-- DropForeignKey
ALTER TABLE `anggota` DROP FOREIGN KEY `Anggota_lembagaId_fkey`;

-- AlterTable
ALTER TABLE `anggota` ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `lembagaId` VARCHAR(191) NOT NULL,
    MODIFY `demografiId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Anggota_uuid_key` ON `Anggota`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `Anggota_lembagaId_key` ON `Anggota`(`lembagaId`);

-- CreateIndex
CREATE UNIQUE INDEX `Anggota_demografiId_key` ON `Anggota`(`demografiId`);

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_demografiId_fkey` FOREIGN KEY (`demografiId`) REFERENCES `Demographics`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
