/*
  Warnings:

  - You are about to drop the column `canalId` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `reservas` table. All the data in the column will be lost.
  - You are about to alter the column `adultos` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `ninos` on the `reservas` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Added the required column `montoTotal` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreCanal` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreHuesped` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreTipoHab` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nroHabitacion` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioNoche` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tarifaId` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_canalId_fkey";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "canalId",
DROP COLUMN "planId",
ADD COLUMN     "IVA" DECIMAL(4,2) NOT NULL DEFAULT 0,
ADD COLUMN     "cargoServicios" DECIMAL(4,2) NOT NULL DEFAULT 0,
ADD COLUMN     "montoDescuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "montoFinal" DECIMAL(10,2),
ADD COLUMN     "montoTotal" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "nombreCanal" VARCHAR(50) NOT NULL,
ADD COLUMN     "nombreHuesped" VARCHAR(100) NOT NULL,
ADD COLUMN     "nombreTipoHab" VARCHAR(100) NOT NULL,
ADD COLUMN     "nroHabitacion" VARCHAR(10) NOT NULL,
ADD COLUMN     "precioNoche" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "tarifaId" UUID NOT NULL,
ALTER COLUMN "fechaEntrada" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "fechaSalida" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "adultos" SET DATA TYPE SMALLINT,
ALTER COLUMN "ninos" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE INDEX "reservas_huespedId_idx" ON "reservas"("huespedId");

-- CreateIndex
CREATE INDEX "reservas_habitacionId_idx" ON "reservas"("habitacionId");

-- CreateIndex
CREATE INDEX "reservas_tarifaId_idx" ON "reservas"("tarifaId");

-- CreateIndex
CREATE INDEX "reservas_fechaEntrada_idx" ON "reservas"("fechaEntrada");

-- CreateIndex
CREATE INDEX "reservas_fechaSalida_idx" ON "reservas"("fechaSalida");

-- CreateIndex
CREATE INDEX "reservas_estado_idx" ON "reservas"("estado");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_tarifaId_fkey" FOREIGN KEY ("tarifaId") REFERENCES "tarifas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
