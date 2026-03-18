/*
  Warnings:

  - You are about to drop the column `fechaNac` on the `huespedes` table. All the data in the column will be lost.
  - You are about to drop the column `genero` on the `huespedes` table. All the data in the column will be lost.
  - You are about to drop the column `idioma` on the `huespedes` table. All the data in the column will be lost.
  - You are about to drop the column `nroDoc` on the `huespedes` table. All the data in the column will be lost.
  - You are about to drop the column `tipoDoc` on the `huespedes` table. All the data in the column will be lost.
  - You are about to drop the column `tipoHabId` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `tipoHabitacionId` on the `tarifas` table. All the data in the column will be lost.
  - You are about to drop the column `tieneBanio` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `tieneDucha` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the `_MueblesHabitacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MueblesPorTipo` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[habitacionId,planId,temporadaId,canalId]` on the table `tarifas` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `huespedes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefono` on table `huespedes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nacionalidad` on table `huespedes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `habitacionId` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `habitacionId` to the `tarifas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MueblesHabitacion" DROP CONSTRAINT "_MueblesHabitacion_A_fkey";

-- DropForeignKey
ALTER TABLE "_MueblesHabitacion" DROP CONSTRAINT "_MueblesHabitacion_B_fkey";

-- DropForeignKey
ALTER TABLE "_MueblesPorTipo" DROP CONSTRAINT "_MueblesPorTipo_A_fkey";

-- DropForeignKey
ALTER TABLE "_MueblesPorTipo" DROP CONSTRAINT "_MueblesPorTipo_B_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_tipoHabId_fkey";

-- DropForeignKey
ALTER TABLE "tarifas" DROP CONSTRAINT "tarifas_tipoHabitacionId_fkey";

-- DropIndex
DROP INDEX "huespedes_tipoDoc_nroDoc_key";

-- DropIndex
DROP INDEX "tarifas_tipoHabitacionId_planId_temporadaId_canalId_key";

-- AlterTable
ALTER TABLE "catalogo_muebles" ADD COLUMN     "habitacionId" UUID;

-- AlterTable
ALTER TABLE "habitaciones" ADD COLUMN     "tieneBanio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tieneDucha" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "huespedes" DROP COLUMN "fechaNac",
DROP COLUMN "genero",
DROP COLUMN "idioma",
DROP COLUMN "nroDoc",
DROP COLUMN "tipoDoc",
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "telefono" SET NOT NULL,
ALTER COLUMN "nacionalidad" SET NOT NULL;

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "tipoHabId",
ADD COLUMN     "habitacionId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tarifas" DROP COLUMN "tipoHabitacionId",
ADD COLUMN     "habitacionId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "tipos_habitacion" DROP COLUMN "tieneBanio",
DROP COLUMN "tieneDucha";

-- DropTable
DROP TABLE "_MueblesHabitacion";

-- DropTable
DROP TABLE "_MueblesPorTipo";

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_habitacionId_planId_temporadaId_canalId_key" ON "tarifas"("habitacionId", "planId", "temporadaId", "canalId");

-- AddForeignKey
ALTER TABLE "catalogo_muebles" ADD CONSTRAINT "catalogo_muebles_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
