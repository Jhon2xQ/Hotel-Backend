/*
  Warnings:

  - The values [AGENCIA,CORPORATIVO,OPERADOR] on the enum `tipo_canal` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `codigo` on the `canales` table. All the data in the column will be lost.
  - You are about to drop the column `comisionPct` on the `canales` table. All the data in the column will be lost.
  - You are about to drop the `agencias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `planes_tarifa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tarifas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `temporadas` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `canales` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "tipo_canal_new" AS ENUM ('OTA', 'DIRECTO', 'AGENTE');
ALTER TABLE "canales" ALTER COLUMN "tipo" TYPE "tipo_canal_new" USING ("tipo"::text::"tipo_canal_new");
ALTER TYPE "tipo_canal" RENAME TO "tipo_canal_old";
ALTER TYPE "tipo_canal_new" RENAME TO "tipo_canal";
DROP TYPE "public"."tipo_canal_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "agencias" DROP CONSTRAINT "agencias_canalId_fkey";

-- DropForeignKey
ALTER TABLE "reservas" DROP CONSTRAINT "reservas_planId_fkey";

-- DropForeignKey
ALTER TABLE "tarifas" DROP CONSTRAINT "tarifas_canalId_fkey";

-- DropForeignKey
ALTER TABLE "tarifas" DROP CONSTRAINT "tarifas_planId_fkey";

-- DropForeignKey
ALTER TABLE "tarifas" DROP CONSTRAINT "tarifas_temporadaId_fkey";

-- DropIndex
DROP INDEX "canales_codigo_key";

-- AlterTable
ALTER TABLE "canales" DROP COLUMN "codigo",
DROP COLUMN "comisionPct",
ALTER COLUMN "nombre" SET DATA TYPE VARCHAR;

-- DropTable
DROP TABLE "agencias";

-- DropTable
DROP TABLE "planes_tarifa";

-- DropTable
DROP TABLE "tarifas";

-- DropTable
DROP TABLE "temporadas";

-- CreateIndex
CREATE UNIQUE INDEX "canales_nombre_key" ON "canales"("nombre");
