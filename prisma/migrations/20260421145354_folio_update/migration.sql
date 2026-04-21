/*
  Warnings:

  - You are about to drop the column `estanciaId` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the `estancias` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `reservaId` to the `folios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "unidad_insumo" AS ENUM ('UNIDAD', 'LITRO', 'KG', 'GR', 'BOTELLA', 'CAJA', 'FCO', 'SACO', 'TUBO', 'BLISTER', 'PAQUETE');

-- CreateEnum
CREATE TYPE "tipo_movimiento" AS ENUM ('ENTRADA', 'SALIDA');

-- CreateEnum
CREATE TYPE "motivo_entrada" AS ENUM ('COMPRA', 'DONACION', 'AJUSTE', 'REPOSICION');

-- CreateEnum
CREATE TYPE "motivo_salida" AS ENUM ('CONSUMO', 'DESECHO', 'AJUSTE', 'STOCK_MINIMO');

-- CreateEnum
CREATE TYPE "area_inventario" AS ENUM ('BAR', 'COCINA');

-- DropForeignKey
ALTER TABLE "estancias" DROP CONSTRAINT "estancias_habitacionId_fkey";

-- DropForeignKey
ALTER TABLE "estancias" DROP CONSTRAINT "estancias_huespedId_fkey";

-- DropForeignKey
ALTER TABLE "estancias" DROP CONSTRAINT "estancias_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "folios" DROP CONSTRAINT "folios_estanciaId_fkey";

-- DropIndex
DROP INDEX "folios_estanciaId_idx";

-- AlterTable
ALTER TABLE "folios" DROP COLUMN "estanciaId",
ADD COLUMN     "reservaId" UUID NOT NULL;

-- DropTable
DROP TABLE "estancias";

-- DropEnum
DROP TYPE "estado_estadia";

-- CreateTable
CREATE TABLE "insumos_bar" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "unidad" "unidad_insumo" NOT NULL,
    "stockActual" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "stockMinimo" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "insumos_bar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_bar" (
    "id" UUID NOT NULL,
    "insumoId" UUID NOT NULL,
    "tipo" "tipo_movimiento" NOT NULL,
    "cantidad" DECIMAL(10,3) NOT NULL,
    "motivoEntrada" "motivo_entrada",
    "motivoSalida" "motivo_salida",
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_bar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insumos_cocina" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "unidad" "unidad_insumo" NOT NULL,
    "stockActual" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "stockMinimo" DECIMAL(10,3) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "insumos_cocina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_cocina" (
    "id" UUID NOT NULL,
    "insumoId" UUID NOT NULL,
    "tipo" "tipo_movimiento" NOT NULL,
    "cantidad" DECIMAL(10,3) NOT NULL,
    "motivoEntrada" "motivo_entrada",
    "motivoSalida" "motivo_salida",
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "movimientos_cocina_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "insumos_bar_codigo_key" ON "insumos_bar"("codigo");

-- CreateIndex
CREATE INDEX "movimientos_bar_insumoId_idx" ON "movimientos_bar"("insumoId");

-- CreateIndex
CREATE INDEX "movimientos_bar_createdAt_idx" ON "movimientos_bar"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "insumos_cocina_codigo_key" ON "insumos_cocina"("codigo");

-- CreateIndex
CREATE INDEX "movimientos_cocina_insumoId_idx" ON "movimientos_cocina"("insumoId");

-- CreateIndex
CREATE INDEX "movimientos_cocina_createdAt_idx" ON "movimientos_cocina"("createdAt");

-- CreateIndex
CREATE INDEX "folios_reservaId_idx" ON "folios"("reservaId");

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_bar" ADD CONSTRAINT "movimientos_bar_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos_bar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_cocina" ADD CONSTRAINT "movimientos_cocina_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "insumos_cocina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
