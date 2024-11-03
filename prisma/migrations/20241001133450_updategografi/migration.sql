/*
  Warnings:

  - You are about to drop the column `created_at` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `east_boundary` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `north_boundary` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `south_boundary` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `geography` table. All the data in the column will be lost.
  - You are about to drop the column `west_boundary` on the `geography` table. All the data in the column will be lost.
  - Added the required column `nama` to the `Geography` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Geography` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `geography` DROP FOREIGN KEY `Geography_profile_id_fkey`;

-- AlterTable
ALTER TABLE `geography` DROP COLUMN `created_at`,
    DROP COLUMN `created_by`,
    DROP COLUMN `east_boundary`,
    DROP COLUMN `north_boundary`,
    DROP COLUMN `profile_id`,
    DROP COLUMN `south_boundary`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `updated_by`,
    DROP COLUMN `west_boundary`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `nama` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `BatasWilayah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `utara` VARCHAR(191) NOT NULL,
    `selatan` VARCHAR(191) NOT NULL,
    `timur` VARCHAR(191) NOT NULL,
    `barat` VARCHAR(191) NOT NULL,
    `geographyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BatasWilayah_uuid_key`(`uuid`),
    UNIQUE INDEX `BatasWilayah_geographyId_key`(`geographyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbitasiDesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `nilai` VARCHAR(191) NOT NULL,
    `geographyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OrbitasiDesa_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `JenisLahan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `luas` DOUBLE NOT NULL,
    `geographyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `JenisLahan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PotensiWisata` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `jenis` VARCHAR(191) NOT NULL,
    `luas` DOUBLE NULL,
    `geographyId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PotensiWisata_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BatasWilayah` ADD CONSTRAINT `BatasWilayah_geographyId_fkey` FOREIGN KEY (`geographyId`) REFERENCES `Geography`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrbitasiDesa` ADD CONSTRAINT `OrbitasiDesa_geographyId_fkey` FOREIGN KEY (`geographyId`) REFERENCES `Geography`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JenisLahan` ADD CONSTRAINT `JenisLahan_geographyId_fkey` FOREIGN KEY (`geographyId`) REFERENCES `Geography`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PotensiWisata` ADD CONSTRAINT `PotensiWisata_geographyId_fkey` FOREIGN KEY (`geographyId`) REFERENCES `Geography`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
