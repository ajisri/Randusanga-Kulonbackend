/*
  Warnings:

  - You are about to drop the `BudgetItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BudgetItem` DROP FOREIGN KEY `BudgetItem_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `BudgetItem` DROP FOREIGN KEY `BudgetItem_subkategoriId_fkey`;

-- DropTable
DROP TABLE `BudgetItem`;
