-- CreateTable
CREATE TABLE `Administrator` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,
    `refresh_token` VARCHAR(255) NULL,

    UNIQUE INDEX `Administrator_uuid_key`(`uuid`),
    UNIQUE INDEX `Administrator_username_key`(`username`),
    UNIQUE INDEX `Administrator_email_key`(`email`),
    UNIQUE INDEX `Administrator_refresh_token_key`(`refresh_token`),
    INDEX `Administrator_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(255) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_uuid_key`(`uuid`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_refresh_token_key`(`refresh_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `pname` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    UNIQUE INDEX `Profile_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lembaga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nama` VARCHAR(191) NOT NULL,
    `singkatan` VARCHAR(191) NOT NULL,
    `dasar_hukum` VARCHAR(191) NOT NULL,
    `alamat_kantor` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    UNIQUE INDEX `Lembaga_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfilLembaga` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `lembagaId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NULL,

    UNIQUE INDEX `ProfilLembaga_uuid_key`(`uuid`),
    UNIQUE INDEX `ProfilLembaga_lembagaId_key`(`lembagaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VisiMisi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `lembagaId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NULL,

    UNIQUE INDEX `VisiMisi_uuid_key`(`uuid`),
    UNIQUE INDEX `VisiMisi_lembagaId_key`(`lembagaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TugasPokok` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `lembagaId` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NULL,

    UNIQUE INDEX `TugasPokok_uuid_key`(`uuid`),
    UNIQUE INDEX `TugasPokok_lembagaId_key`(`lembagaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Anggota` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `lembagaDesaid` VARCHAR(191) NOT NULL,
    `demografiDesaid` VARCHAR(191) NOT NULL,
    `jabatan` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NOT NULL,

    UNIQUE INDEX `Anggota_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BatasWilayah` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `nilai` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BatasWilayah_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrbitasiDesa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `kategori` VARCHAR(191) NOT NULL,
    `nilai` VARCHAR(191) NOT NULL,
    `satuan` VARCHAR(191) NOT NULL,
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
    `nama` VARCHAR(191) NOT NULL,
    `luas` DOUBLE NOT NULL,
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
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PotensiWisata_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Demographics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nik` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `birth_date` DATETIME(3) NOT NULL,
    `marital_status` VARCHAR(191) NOT NULL,
    `education_id` INTEGER NOT NULL,
    `job` VARCHAR(191) NOT NULL,
    `rt` VARCHAR(191) NOT NULL,
    `rw` VARCHAR(191) NOT NULL,
    `hamlet` VARCHAR(191) NOT NULL,
    `status_aktif` VARCHAR(191) NOT NULL,
    `tmt_status_aktif` DATETIME(3) NULL,
    `keterangan_status` VARCHAR(191) NULL,
    `file_url` VARCHAR(191) NULL,
    `religion_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,

    UNIQUE INDEX `Demographics_uuid_key`(`uuid`),
    UNIQUE INDEX `Demographics_nik_key`(`nik`),
    INDEX `Demographics_nik_idx`(`nik`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Religion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `level` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `pname` VARCHAR(191) NOT NULL,
    `status` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT',
    `content` LONGTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `created_by` VARCHAR(191) NULL,
    `updated_by` VARCHAR(191) NULL,

    UNIQUE INDEX `Service_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProdukHukum` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `deskripsi` VARCHAR(191) NOT NULL,
    `waktu` DATETIME(3) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    UNIQUE INDEX `ProdukHukum_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agenda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `nama_agenda` VARCHAR(191) NOT NULL,
    `deskripsi` LONGTEXT NOT NULL,
    `tempat_pelaksanaan` VARCHAR(191) NOT NULL,
    `tanggal_agenda` DATETIME(3) NOT NULL,
    `tanggal_akhir_agenda` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdbyId` INTEGER NOT NULL,

    UNIQUE INDEX `Agenda_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pengumuman` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pengumuman_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Galeri` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Galeri_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Berita` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` LONGTEXT NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `status` ENUM('DRAFT', 'PUBLISH') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdbyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Berita_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Keuangan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Keuangan_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `keuanganId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Kategori_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subkategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `kategoriId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `totalBudget` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `totalRealization` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `remaining` DECIMAL(65, 30) NOT NULL DEFAULT 0,

    UNIQUE INDEX `Subkategori_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BudgetItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL,
    `subkategoriId` VARCHAR(191) NOT NULL,
    `budget` DECIMAL(65, 30) NOT NULL,
    `realization` DECIMAL(65, 30) NOT NULL,
    `remaining` DECIMAL(65, 30) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `createdById` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NULL,
    `year` INTEGER NOT NULL,

    UNIQUE INDEX `BudgetItem_uuid_key`(`uuid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lembaga` ADD CONSTRAINT `Lembaga_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfilLembaga` ADD CONSTRAINT `ProfilLembaga_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProfilLembaga` ADD CONSTRAINT `ProfilLembaga_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisiMisi` ADD CONSTRAINT `VisiMisi_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VisiMisi` ADD CONSTRAINT `VisiMisi_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TugasPokok` ADD CONSTRAINT `TugasPokok_lembagaId_fkey` FOREIGN KEY (`lembagaId`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TugasPokok` ADD CONSTRAINT `TugasPokok_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_lembagaDesaid_fkey` FOREIGN KEY (`lembagaDesaid`) REFERENCES `Lembaga`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_demografiDesaid_fkey` FOREIGN KEY (`demografiDesaid`) REFERENCES `Demographics`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Anggota` ADD CONSTRAINT `Anggota_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demographics` ADD CONSTRAINT `Demographics_education_id_fkey` FOREIGN KEY (`education_id`) REFERENCES `Education`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Demographics` ADD CONSTRAINT `Demographics_religion_id_fkey` FOREIGN KEY (`religion_id`) REFERENCES `Religion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProdukHukum` ADD CONSTRAINT `ProdukHukum_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agenda` ADD CONSTRAINT `Agenda_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pengumuman` ADD CONSTRAINT `Pengumuman_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Galeri` ADD CONSTRAINT `Galeri_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Berita` ADD CONSTRAINT `Berita_createdbyId_fkey` FOREIGN KEY (`createdbyId`) REFERENCES `Administrator`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Keuangan` ADD CONSTRAINT `Keuangan_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Kategori` ADD CONSTRAINT `Kategori_keuanganId_fkey` FOREIGN KEY (`keuanganId`) REFERENCES `Keuangan`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subkategori` ADD CONSTRAINT `Subkategori_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `Kategori`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `Administrator`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BudgetItem` ADD CONSTRAINT `BudgetItem_subkategoriId_fkey` FOREIGN KEY (`subkategoriId`) REFERENCES `Subkategori`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
