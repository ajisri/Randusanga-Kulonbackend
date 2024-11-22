/*
  Warnings:

  - You are about to drop the column `file_url` on the `BudgetItem` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `BudgetItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `BudgetItem` DROP COLUMN `file_url`,
    DROP COLUMN `year`;
