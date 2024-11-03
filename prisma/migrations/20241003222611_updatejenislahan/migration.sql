/*
  Warnings:

  - Added the required column `nama` to the `JenisLahan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `jenislahan` ADD COLUMN `nama` VARCHAR(191) NOT NULL;
