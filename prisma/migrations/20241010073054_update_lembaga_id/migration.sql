/*
  Warnings:

  - A unique constraint covering the columns `[lembagaId]` on the table `ProfilLembaga` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lembagaId]` on the table `TugasPokok` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lembagaId]` on the table `VisiMisi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ProfilLembaga_lembagaId_key` ON `ProfilLembaga`(`lembagaId`);

-- CreateIndex
CREATE UNIQUE INDEX `TugasPokok_lembagaId_key` ON `TugasPokok`(`lembagaId`);

-- CreateIndex
CREATE UNIQUE INDEX `VisiMisi_lembagaId_key` ON `VisiMisi`(`lembagaId`);
