/*
  Warnings:

  - You are about to drop the column `file_url` on the `Subkategoriankor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Subkategoriankor` DROP COLUMN `file_url`,
    ADD COLUMN `url` VARCHAR(191) NULL;
