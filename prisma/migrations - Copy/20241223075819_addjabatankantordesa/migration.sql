-- CreateTable
CREATE TABLE `Jabatan` (
    `id` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `ringkasan` VARCHAR(191) NULL,
    `tugas` VARCHAR(191) NULL,
    `fungsi` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MasaJabatan` (
    `id` VARCHAR(191) NOT NULL,
    `pejabatNama` VARCHAR(191) NOT NULL,
    `periodeTahun` INTEGER NOT NULL,
    `jabatanId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Jabatan` ADD CONSTRAINT `Jabatan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasaJabatan` ADD CONSTRAINT `MasaJabatan_jabatanId_fkey` FOREIGN KEY (`jabatanId`) REFERENCES `Jabatan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasaJabatan` ADD CONSTRAINT `MasaJabatan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
