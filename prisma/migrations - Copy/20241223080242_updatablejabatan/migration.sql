/*
  Warnings:

  - The primary key for the `Jabatan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Jabatan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `MasaJabatan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `MasaJabatan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[uuid]` on the table `Jabatan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `MasaJabatan` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `Jabatan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `MasaJabatan` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE `MasaJabatan` DROP FOREIGN KEY `MasaJabatan_jabatanId_fkey`;

-- AlterTable
ALTER TABLE `Jabatan` DROP PRIMARY KEY,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `MasaJabatan` DROP PRIMARY KEY,
    ADD COLUMN `uuid` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Jabatan_uuid_key` ON `Jabatan`(`uuid`);

-- CreateIndex
CREATE UNIQUE INDEX `MasaJabatan_uuid_key` ON `MasaJabatan`(`uuid`);

-- AddForeignKey
ALTER TABLE `MasaJabatan` ADD CONSTRAINT `MasaJabatan_jabatanId_fkey` FOREIGN KEY (`jabatanId`) REFERENCES `Jabatan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
