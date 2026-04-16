/*
  Warnings:

  - You are about to drop the column `estanciaId` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `moneda` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `pagoId` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `totalCargos` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `totalPagos` on the `folios` table. All the data in the column will be lost.
  - The `estado` column on the `folios` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `nroFolio` column on the `folios` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `cargos_folio` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comprobantes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `servicios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reservaId` to the `folios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cargos_folio" DROP CONSTRAINT "cargos_folio_folioId_fkey";

-- DropForeignKey
ALTER TABLE "cargos_folio" DROP CONSTRAINT "cargos_folio_servicioId_fkey";

-- DropForeignKey
ALTER TABLE "comprobantes" DROP CONSTRAINT "comprobantes_folioId_fkey";

-- DropForeignKey
ALTER TABLE "folios" DROP CONSTRAINT "folios_estanciaId_fkey";

-- DropForeignKey
ALTER TABLE "folios" DROP CONSTRAINT "folios_pagoId_fkey";

-- DropIndex
DROP INDEX "folios_estanciaId_key";

-- DropIndex
DROP INDEX "folios_pagoId_key";

-- AlterTable
ALTER TABLE "folios" DROP COLUMN "estanciaId",
DROP COLUMN "moneda",
DROP COLUMN "notas",
DROP COLUMN "pagoId",
DROP COLUMN "totalCargos",
DROP COLUMN "totalPagos",
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "reservaId" UUID NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" BOOLEAN NOT NULL DEFAULT true,
DROP COLUMN "nroFolio",
ADD COLUMN     "nroFolio" SERIAL NOT NULL;

-- DropTable
DROP TABLE "cargos_folio";

-- DropTable
DROP TABLE "comprobantes";

-- DropTable
DROP TABLE "servicios";

-- DropEnum
DROP TYPE "categoria_servicio";

-- DropEnum
DROP TYPE "estado_folio";

-- DropEnum
DROP TYPE "estado_sunat";

-- DropEnum
DROP TYPE "tipo_comprobante";

-- CreateTable
CREATE TABLE "_FolioToPromocion" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_FolioToPromocion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FolioToPromocion_B_index" ON "_FolioToPromocion"("B");

-- CreateIndex
CREATE UNIQUE INDEX "folios_nroFolio_key" ON "folios"("nroFolio");

-- CreateIndex
CREATE INDEX "folios_reservaId_idx" ON "folios"("reservaId");

-- CreateIndex
CREATE INDEX "folios_estado_idx" ON "folios"("estado");

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolioToPromocion" ADD CONSTRAINT "_FolioToPromocion_A_fkey" FOREIGN KEY ("A") REFERENCES "folios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FolioToPromocion" ADD CONSTRAINT "_FolioToPromocion_B_fkey" FOREIGN KEY ("B") REFERENCES "promociones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
