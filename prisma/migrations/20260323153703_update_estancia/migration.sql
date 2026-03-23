/*
  Warnings:

  - You are about to drop the column `checkinPorId` on the `estancias` table. All the data in the column will be lost.
  - You are about to drop the column `checkoutPorId` on the `estancias` table. All the data in the column will be lost.
  - You are about to drop the column `horaEntrada` on the `estancias` table. All the data in the column will be lost.
  - You are about to drop the column `horaSalida` on the `estancias` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `estancias` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "estancias" DROP CONSTRAINT "estancias_checkinPorId_fkey";

-- DropForeignKey
ALTER TABLE "estancias" DROP CONSTRAINT "estancias_checkoutPorId_fkey";

-- AlterTable
ALTER TABLE "estancias" DROP COLUMN "checkinPorId",
DROP COLUMN "checkoutPorId",
DROP COLUMN "horaEntrada",
DROP COLUMN "horaSalida",
ADD COLUMN     "fechaEntrada" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fechaSalida" TIMESTAMPTZ,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;

-- AddForeignKey
ALTER TABLE "estancias" ADD CONSTRAINT "estancias_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
