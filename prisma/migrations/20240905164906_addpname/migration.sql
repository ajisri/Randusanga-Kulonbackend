/*
  Warnings:

  - Added the required column `pname` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `pname` VARCHAR(191) NOT NULL;
