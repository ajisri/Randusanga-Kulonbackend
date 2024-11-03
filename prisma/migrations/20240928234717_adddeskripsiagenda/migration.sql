/*
  Warnings:

  - Added the required column `deskripsi` to the `Agenda` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `agenda` ADD COLUMN `deskripsi` LONGTEXT NOT NULL;
