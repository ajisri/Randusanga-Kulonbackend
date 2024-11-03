/*
  Warnings:

  - Added the required column `tanggal_akhir_agenda` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agenda` ADD COLUMN `tanggal_akhir_agenda` DATETIME(3) NOT NULL;
