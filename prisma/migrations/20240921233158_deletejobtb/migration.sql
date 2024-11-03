/*
  Warnings:

  - You are about to drop the `_demographicstojob` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_demographicstojob` DROP FOREIGN KEY `_DemographicsToJob_A_fkey`;

-- DropForeignKey
ALTER TABLE `_demographicstojob` DROP FOREIGN KEY `_DemographicsToJob_B_fkey`;

-- DropTable
DROP TABLE `_demographicstojob`;

-- DropTable
DROP TABLE `job`;
