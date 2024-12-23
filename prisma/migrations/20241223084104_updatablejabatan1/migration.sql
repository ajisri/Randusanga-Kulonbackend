/*
  Warnings:

  - You are about to drop the column `pejabatNama` on the `MasaJabatan` table. All the data in the column will be lost.
  - You are about to drop the column `periodeTahun` on the `MasaJabatan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jabatanId,mulai]` on the table `MasaJabatan` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `mulai` to the `MasaJabatan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `MasaJabatan` DROP COLUMN `pejabatNama`,
    DROP COLUMN `periodeTahun`,
    ADD COLUMN `mulai` INTEGER NOT NULL,
    ADD COLUMN `selesai` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `MasaJabatan_jabatanId_mulai_key` ON `MasaJabatan`(`jabatanId`, `mulai`);
