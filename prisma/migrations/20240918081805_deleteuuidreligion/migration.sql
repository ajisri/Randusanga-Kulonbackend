/*
  Warnings:

  - You are about to drop the column `uuid` on the `religion` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Religion_uuid_key` ON `religion`;

-- AlterTable
ALTER TABLE `religion` DROP COLUMN `uuid`;
