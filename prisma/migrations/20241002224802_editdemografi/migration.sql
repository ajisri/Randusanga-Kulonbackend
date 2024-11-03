/*
  Warnings:

  - Added the required column `status_aktif` to the `Demographics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tmt_status_aktif` to the `Demographics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `demographics` ADD COLUMN `keterangan_status` VARCHAR(191) NULL,
    ADD COLUMN `status_aktif` VARCHAR(191) NOT NULL,
    ADD COLUMN `tmt_status_aktif` DATETIME(3) NOT NULL;
