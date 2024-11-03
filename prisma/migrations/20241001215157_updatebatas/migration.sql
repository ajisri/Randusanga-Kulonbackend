/*
  Warnings:

  - You are about to drop the column `barat` on the `bataswilayah` table. All the data in the column will be lost.
  - You are about to drop the column `geographyId` on the `bataswilayah` table. All the data in the column will be lost.
  - You are about to drop the column `selatan` on the `bataswilayah` table. All the data in the column will be lost.
  - You are about to drop the column `timur` on the `bataswilayah` table. All the data in the column will be lost.
  - You are about to drop the column `utara` on the `bataswilayah` table. All the data in the column will be lost.
  - You are about to drop the column `geographyId` on the `jenislahan` table. All the data in the column will be lost.
  - You are about to drop the column `geographyId` on the `orbitasidesa` table. All the data in the column will be lost.
  - You are about to drop the column `geographyId` on the `potensiwisata` table. All the data in the column will be lost.
  - You are about to drop the `geography` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `kategori` to the `BatasWilayah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nilai` to the `BatasWilayah` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bataswilayah` DROP FOREIGN KEY `BatasWilayah_geographyId_fkey`;

-- DropForeignKey
ALTER TABLE `jenislahan` DROP FOREIGN KEY `JenisLahan_geographyId_fkey`;

-- DropForeignKey
ALTER TABLE `orbitasidesa` DROP FOREIGN KEY `OrbitasiDesa_geographyId_fkey`;

-- DropForeignKey
ALTER TABLE `potensiwisata` DROP FOREIGN KEY `PotensiWisata_geographyId_fkey`;

-- AlterTable
ALTER TABLE `bataswilayah` DROP COLUMN `barat`,
    DROP COLUMN `geographyId`,
    DROP COLUMN `selatan`,
    DROP COLUMN `timur`,
    DROP COLUMN `utara`,
    ADD COLUMN `kategori` VARCHAR(191) NOT NULL,
    ADD COLUMN `nilai` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `jenislahan` DROP COLUMN `geographyId`;

-- AlterTable
ALTER TABLE `orbitasidesa` DROP COLUMN `geographyId`;

-- AlterTable
ALTER TABLE `potensiwisata` DROP COLUMN `geographyId`;

-- DropTable
DROP TABLE `geography`;
