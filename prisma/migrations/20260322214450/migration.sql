/*
  Warnings:

  - You are about to drop the column `limpieza` on the `habitaciones` table. All the data in the column will be lost.
  - You are about to drop the column `tipoId` on the `habitaciones` table. All the data in the column will be lost.
  - The `urlImagen` column on the `habitaciones` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "catalogo_muebles" DROP CONSTRAINT "catalogo_muebles_habitacionId_fkey";

-- DropForeignKey
ALTER TABLE "estancias" DROP CONSTRAINT "estancias_habitacionId_fkey";

-- DropForeignKey
ALTER TABLE "habitaciones" DROP CONSTRAINT "habitaciones_tipoId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_habitacionId_fkey";

-- DropForeignKey
ALTER TABLE "tarifas" DROP CONSTRAINT "tarifas_habitacionId_fkey";

-- AlterTable
ALTER TABLE "habitaciones" DROP COLUMN "limpieza",
DROP COLUMN "tipoId",
DROP COLUMN "urlImagen",
ADD COLUMN     "urlImagen" VARCHAR(255)[];

-- AddForeignKey
ALTER TABLE "habitaciones" ADD CONSTRAINT "habitaciones_id_fkey" FOREIGN KEY ("id") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
