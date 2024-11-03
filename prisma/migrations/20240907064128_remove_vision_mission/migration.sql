/*
  Warnings:

  - You are about to drop the `visionmission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `visionmission` DROP FOREIGN KEY `VisionMission_profile_id_fkey`;

-- DropTable
DROP TABLE `visionmission`;
