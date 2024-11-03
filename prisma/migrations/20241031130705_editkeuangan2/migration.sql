/*
  Warnings:

  - You are about to drop the column `type` on the `keuangan` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Kategori` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Keuangan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Subkategori` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `budgetitem` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `kategori` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `keuangan` DROP COLUMN `type`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `subkategori` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;
