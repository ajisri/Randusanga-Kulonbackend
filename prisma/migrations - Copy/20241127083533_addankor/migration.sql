-- CreateTable
CREATE TABLE `Ankor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategoriankor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `ankorId` INTEGER NOT NULL,

    UNIQUE INDEX `Kategoriankor_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subkategoriankor` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `kategoriankorId` INTEGER NOT NULL,

    UNIQUE INDEX `Subkategoriankor_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ankor` ADD CONSTRAINT `Ankor_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategoriankor` ADD CONSTRAINT `Kategoriankor_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategoriankor` ADD CONSTRAINT `Kategoriankor_ankorId_fkey` FOREIGN KEY (`ankorId`) REFERENCES `Ankor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategoriankor` ADD CONSTRAINT `Subkategoriankor_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategoriankor` ADD CONSTRAINT `Subkategoriankor_kategoriankorId_fkey` FOREIGN KEY (`kategoriankorId`) REFERENCES `Kategoriankor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
