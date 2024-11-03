/*
  Warnings:

  - Added the required column `pname` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `service` ADD COLUMN `file_url` VARCHAR(191) NULL,
    ADD COLUMN `pname` VARCHAR(191) NOT NULL;
