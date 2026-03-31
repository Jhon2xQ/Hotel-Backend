/*
  Warnings:

  - You are about to drop the column `fechaEntrada` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `fechaSalida` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `fechaFin` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaInicio` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "reservas_fechaEntrada_idx";

-- DropIndex
DROP INDEX "reservas_fechaSalida_idx";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "fechaEntrada",
DROP COLUMN "fechaSalida",
ADD COLUMN     "fechaFin" DATE NOT NULL,
ADD COLUMN     "fechaInicio" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "reservas_fechaInicio_idx" ON "reservas"("fechaInicio");

-- CreateIndex
CREATE INDEX "reservas_fechaFin_idx" ON "reservas"("fechaFin");
