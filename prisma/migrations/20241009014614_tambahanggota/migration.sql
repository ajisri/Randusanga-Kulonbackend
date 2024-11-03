-- CreateTable
CREATE TABLE `ProfilLembaga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `lembagaId` INTEGER NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NULL,

    UNIQUE INDEX `ProfilLembaga_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anggota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lembagaId` INTEGER NOT NULL,
    `demografiId` INTEGER NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProfilLembaga` ADD CONSTRAINT `ProfilLembaga_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfilLembaga` ADD CONSTRAINT `ProfilLembaga_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_demografiId_fkey` FOREIGN KEY (`demografiId`) REFERENCES `Demographics`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
