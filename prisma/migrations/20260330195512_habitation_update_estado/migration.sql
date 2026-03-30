/*
  Warnings:

  - You are about to drop the column `notas` on the `habitaciones` table. All the data in the column will be lost.
  - You are about to drop the column `ultimaLimpieza` on the `habitaciones` table. All the data in the column will be lost.
  - The `estado` column on the `habitaciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "habitaciones" DROP COLUMN "notas",
DROP COLUMN "ultimaLimpieza",
ADD COLUMN     "descripcion" TEXT,
DROP COLUMN "estado",
ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "estado_habitacion";
