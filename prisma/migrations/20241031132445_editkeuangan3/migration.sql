-- DropForeignKey
ALTER TABLE `budgetitem` DROP FOREIGN KEY `BudgetItem_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `budgetitem` DROP FOREIGN KEY `BudgetItem_subkategoriId_fkey`;

-- DropForeignKey
ALTER TABLE `kategori` DROP FOREIGN KEY `Kategori_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `kategori` DROP FOREIGN KEY `Kategori_keuanganId_fkey`;

-- DropForeignKey
ALTER TABLE `keuangan` DROP FOREIGN KEY `Keuangan_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `subkategori` DROP FOREIGN KEY `Subkategori_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `subkategori` DROP FOREIGN KEY `Subkategori_kategoriId_fkey`;

-- AlterTable
ALTER TABLE `subkategori` ADD COLUMN `remaining` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `totalBudget` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    ADD COLUMN `totalRealization` DECIMAL(65, 30) NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_keuanganId_fkey` FOREIGN KEY (`keuanganId`) REFERENCES `Keuangan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `Kategori`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_subkategoriId_fkey` FOREIGN KEY (`subkategoriId`) REFERENCES `Subkategori`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
