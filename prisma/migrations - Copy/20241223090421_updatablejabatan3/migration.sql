/*
  Warnings:

  - The primary key for the `Fungsi` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `namafungsi` on the `Fungsi` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Fungsi` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Tugas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `namatugas` on the `Tugas` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Tugas` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `content` to the `Fungsi` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Tugas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Fungsi` DROP PRIMARY KEY,
    DROP COLUMN `namafungsi`,
    ADD COLUMN `content` LONGTEXT NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Tugas` DROP PRIMARY KEY,
    DROP COLUMN `namatugas`,
    ADD COLUMN `content` LONGTEXT NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);
