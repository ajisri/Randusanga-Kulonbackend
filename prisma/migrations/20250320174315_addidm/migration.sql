-- CreateTable
CREATE TABLE `IndexDesaMembangun` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `statusidm` VARCHAR(191) NOT NULL,
    `nilaiidm` VARCHAR(191) NOT NULL,
    `ikl` VARCHAR(191) NOT NULL,
    `iks` VARCHAR(191) NOT NULL,
    `ike` VARCHAR(191) NOT NULL,
    `ket` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    UNIQUE INDEX `IndexDesaMembangun_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IndexDesaMembangun` ADD CONSTRAINT `IndexDesaMembangun_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
