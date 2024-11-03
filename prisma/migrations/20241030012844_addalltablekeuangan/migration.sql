-- CreateTable
CREATE TABLE `KategoriKeuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `KategoriKeuangan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubKategoriKeuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `kategoriKeuanganId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `SubKategoriKeuangan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RincianKeuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `subKategoriKeuanganId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `RincianKeuangan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LaporanKeuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `tahun` INTEGER NOT NULL,
    `rincianKeuanganId` VARCHAR(191) NOT NULL,
    `anggaran` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `realisasi` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `sisa` DECIMAL(65, 30) NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `LaporanKeuangan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PembiayaanDesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `laporanKeuanganId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PembiayaanDesa_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `KategoriKeuangan` ADD CONSTRAINT `KategoriKeuangan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubKategoriKeuangan` ADD CONSTRAINT `SubKategoriKeuangan_kategoriKeuanganId_fkey` FOREIGN KEY (`kategoriKeuanganId`) REFERENCES `KategoriKeuangan`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubKategoriKeuangan` ADD CONSTRAINT `SubKategoriKeuangan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RincianKeuangan` ADD CONSTRAINT `RincianKeuangan_subKategoriKeuanganId_fkey` FOREIGN KEY (`subKategoriKeuanganId`) REFERENCES `SubKategoriKeuangan`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RincianKeuangan` ADD CONSTRAINT `RincianKeuangan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKeuangan` ADD CONSTRAINT `LaporanKeuangan_rincianKeuanganId_fkey` FOREIGN KEY (`rincianKeuanganId`) REFERENCES `RincianKeuangan`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LaporanKeuangan` ADD CONSTRAINT `LaporanKeuangan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembiayaanDesa` ADD CONSTRAINT `PembiayaanDesa_laporanKeuanganId_fkey` FOREIGN KEY (`laporanKeuanganId`) REFERENCES `LaporanKeuangan`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PembiayaanDesa` ADD CONSTRAINT `PembiayaanDesa_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
