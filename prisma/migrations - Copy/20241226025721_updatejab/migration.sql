-- CreateTable
CREATE TABLE `MasaJabatan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `mulai` INTEGER NOT NULL,
    `selesai` INTEGER NOT NULL,
    `jabatanUuid` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    UNIQUE INDEX `MasaJabatan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MasaJabatan` ADD CONSTRAINT `MasaJabatan_jabatanUuid_fkey` FOREIGN KEY (`jabatanUuid`) REFERENCES `Jabatan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MasaJabatan` ADD CONSTRAINT `MasaJabatan_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
