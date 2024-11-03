/*
  Warnings:

  - You are about to drop the column `file_url` on the `tugaspokok` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `visimisi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `lembaga` ADD COLUMN `file_url` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `tugaspokok` DROP COLUMN `file_url`;

-- AlterTable
ALTER TABLE `visimisi` DROP COLUMN `title`;
