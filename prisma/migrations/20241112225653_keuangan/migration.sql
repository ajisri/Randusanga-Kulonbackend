-- AlterTable
ALTER TABLE `Keuangan` ADD COLUMN `filePendukungId` INTEGER NULL;

-- CreateTable
CREATE TABLE `FilePendukung` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Keuangan_uuid_idx` ON `Keuangan`(`uuid`);

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_filePendukungId_fkey` FOREIGN KEY (`filePendukungId`) REFERENCES `FilePendukung`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
