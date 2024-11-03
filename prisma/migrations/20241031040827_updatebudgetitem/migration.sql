/*
  Warnings:

  - Added the required column `year` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budgetitem` ADD COLUMN `file_url` VARCHAR(191) NULL,
    ADD COLUMN `year` INTEGER NOT NULL;
