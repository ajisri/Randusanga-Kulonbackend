/*
  Warnings:

  - Made the column `selesai` on table `masajabatan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `masajabatan` MODIFY `selesai` INTEGER NOT NULL;
