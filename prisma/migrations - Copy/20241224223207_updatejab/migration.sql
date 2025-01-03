/*
  Warnings:

  - Made the column `ringkasan` on table `Jabatan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Jabatan` MODIFY `ringkasan` LONGTEXT NOT NULL;
