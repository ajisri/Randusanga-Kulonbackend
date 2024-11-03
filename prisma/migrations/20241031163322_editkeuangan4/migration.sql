-- DropForeignKey
ALTER TABLE `budgetitem` DROP FOREIGN KEY `BudgetItem_subkategoriId_fkey`;

-- DropForeignKey
ALTER TABLE `kategori` DROP FOREIGN KEY `Kategori_keuanganId_fkey`;

-- DropForeignKey
ALTER TABLE `subkategori` DROP FOREIGN KEY `Subkategori_kategoriId_fkey`;

-- AlterTable
ALTER TABLE `budgetitem` MODIFY `subkategoriId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `kategori` MODIFY `keuanganId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `subkategori` MODIFY `kategoriId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_keuanganId_fkey` FOREIGN KEY (`keuanganId`) REFERENCES `Keuangan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `Kategori`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_subkategoriId_fkey` FOREIGN KEY (`subkategoriId`) REFERENCES `Subkategori`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
