/*
  Warnings:

  - Added the required column `tipoHabitacionId` to the `habitaciones` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "habitaciones" DROP CONSTRAINT "habitaciones_id_fkey";

-- AlterTable
ALTER TABLE "habitaciones" ADD COLUMN     "tipoHabitacionId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "habitaciones" ADD CONSTRAINT "habitaciones_tipoHabitacionId_fkey" FOREIGN KEY ("tipoHabitacionId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
