/*
  Warnings:

  - You are about to drop the column `nroFolio` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `reservaId` on the `folios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigo]` on the table `folios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pagoId]` on the table `folios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigo` to the `folios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estanciaId` to the `folios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "folios" DROP CONSTRAINT "folios_reservaId_fkey";

-- DropIndex
DROP INDEX "folios_nroFolio_key";

-- DropIndex
DROP INDEX "folios_reservaId_idx";

-- AlterTable
ALTER TABLE "folios" DROP COLUMN "nroFolio",
DROP COLUMN "reservaId",
ADD COLUMN     "codigo" VARCHAR(20) NOT NULL,
ADD COLUMN     "estanciaId" UUID NOT NULL,
ADD COLUMN     "pagoId" UUID;

-- CreateTable
CREATE TABLE "folio_productos" (
    "id" UUID NOT NULL,
    "folioId" UUID NOT NULL,
    "productoId" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnit" DECIMAL(6,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "folio_productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folio_servicios" (
    "id" UUID NOT NULL,
    "folioId" UUID NOT NULL,
    "concepto" VARCHAR(150) NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precioUnit" DECIMAL(6,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "folio_servicios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "folio_productos_folioId_idx" ON "folio_productos"("folioId");

-- CreateIndex
CREATE INDEX "folio_productos_productoId_idx" ON "folio_productos"("productoId");

-- CreateIndex
CREATE INDEX "folio_servicios_folioId_idx" ON "folio_servicios"("folioId");

-- CreateIndex
CREATE UNIQUE INDEX "folios_codigo_key" ON "folios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "folios_pagoId_key" ON "folios"("pagoId");

-- CreateIndex
CREATE INDEX "folios_estanciaId_idx" ON "folios"("estanciaId");

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_estanciaId_fkey" FOREIGN KEY ("estanciaId") REFERENCES "estancias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_pagoId_fkey" FOREIGN KEY ("pagoId") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folio_productos" ADD CONSTRAINT "folio_productos_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "folios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folio_productos" ADD CONSTRAINT "folio_productos_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folio_servicios" ADD CONSTRAINT "folio_servicios_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "folios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
