-- CreateTable
CREATE TABLE `Kehadiran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jabatanId` VARCHAR(191) NOT NULL,
    `statusHadir` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Kehadiran` ADD CONSTRAINT `Kehadiran_jabatanId_fkey` FOREIGN KEY (`jabatanId`) REFERENCES `Jabatan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kehadiran` ADD CONSTRAINT `Kehadiran_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
