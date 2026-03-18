/*
  Warnings:

  - You are about to drop the column `saldo` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `folioId` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `pagoOrigenId` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `referencia` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `reservaId` on the `pagos` table. All the data in the column will be lost.
  - You are about to drop the column `agenciaId` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `horaLlegada` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `moneda` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `montoTotal` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `noches` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `nroVoucher` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `precioNoche` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `refExterna` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `solicitudes` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the `resumen_estancias` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pagoId]` on the table `folios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pagoId]` on the table `reservas` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_folioId_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_pagoOrigenId_fkey";

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_agenciaId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_canalId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_planId_fkey";

-- DropForeignKey
ALTER TABLE "resumen_estancias" DROP CONSTRAINT "resumen_estancias_huespedId_fkey";

-- AlterTable
ALTER TABLE "folios" DROP COLUMN "saldo",
ADD COLUMN     "pagoId" UUID;

-- AlterTable
ALTER TABLE "pagos" DROP COLUMN "folioId",
DROP COLUMN "pagoOrigenId",
DROP COLUMN "referencia",
DROP COLUMN "reservaId";

-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "agenciaId",
DROP COLUMN "horaLlegada",
DROP COLUMN "moneda",
DROP COLUMN "montoTotal",
DROP COLUMN "noches",
DROP COLUMN "nroVoucher",
DROP COLUMN "precioNoche",
DROP COLUMN "refExterna",
DROP COLUMN "solicitudes",
ADD COLUMN     "pagoId" UUID,
ALTER COLUMN "canalId" DROP NOT NULL,
ALTER COLUMN "planId" DROP NOT NULL;

-- DropTable
DROP TABLE "resumen_estancias";

-- CreateIndex
CREATE UNIQUE INDEX "folios_pagoId_key" ON "folios"("pagoId");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_pagoId_key" ON "reservas"("pagoId");

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "canales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes_tarifa"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
