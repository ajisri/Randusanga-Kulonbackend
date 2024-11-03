/*
  Warnings:

  - You are about to drop the `kategorikeuangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `laporankeuangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pembiayaandesa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rinciankeuangan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subkategorikeuangan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kategorikeuangan` DROP FOREIGN KEY `KategoriKeuangan_createdbyId_fkey`;

-- DropForeignKey
ALTER TABLE `laporankeuangan` DROP FOREIGN KEY `LaporanKeuangan_createdbyId_fkey`;

-- DropForeignKey
ALTER TABLE `laporankeuangan` DROP FOREIGN KEY `LaporanKeuangan_rincianKeuanganId_fkey`;

-- DropForeignKey
ALTER TABLE `pembiayaandesa` DROP FOREIGN KEY `PembiayaanDesa_createdbyId_fkey`;

-- DropForeignKey
ALTER TABLE `pembiayaandesa` DROP FOREIGN KEY `PembiayaanDesa_laporanKeuanganId_fkey`;

-- DropForeignKey
ALTER TABLE `rinciankeuangan` DROP FOREIGN KEY `RincianKeuangan_createdbyId_fkey`;

-- DropForeignKey
ALTER TABLE `rinciankeuangan` DROP FOREIGN KEY `RincianKeuangan_subKategoriKeuanganId_fkey`;

-- DropForeignKey
ALTER TABLE `subkategorikeuangan` DROP FOREIGN KEY `SubKategoriKeuangan_createdbyId_fkey`;

-- DropForeignKey
ALTER TABLE `subkategorikeuangan` DROP FOREIGN KEY `SubKategoriKeuangan_kategoriKeuanganId_fkey`;

-- DropTable
DROP TABLE `kategorikeuangan`;

-- DropTable
DROP TABLE `laporankeuangan`;

-- DropTable
DROP TABLE `pembiayaandesa`;

-- DropTable
DROP TABLE `rinciankeuangan`;

-- DropTable
DROP TABLE `subkategorikeuangan`;

-- CreateTable
CREATE TABLE `Keuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Keuangan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `keuanganId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Kategori_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subkategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `kategoriId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Subkategori_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BudgetItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `subkategoriId` INTEGER NOT NULL,
    `budget` DECIMAL(65, 30) NOT NULL,
    `realization` DECIMAL(65, 30) NOT NULL,
    `remaining` DECIMAL(65, 30) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `BudgetItem_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_keuanganId_fkey` FOREIGN KEY (`keuanganId`) REFERENCES `Keuangan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `Kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_subkategoriId_fkey` FOREIGN KEY (`subkategoriId`) REFERENCES `Subkategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
