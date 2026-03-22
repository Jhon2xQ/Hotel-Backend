/*
  Warnings:

  - The values [APLICADO] on the enum `estado_pago` will be removed. If these variants are still used in the database, this will fail.
  - The values [CREDITO_AGENCIA,VOUCHER] on the enum `metodo_pago` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `notas` on the `huespedes` table. All the data in the column will be lost.
  - You are about to drop the column `notas` on the `pagos` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `pagos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipo_doc_identidad" AS ENUM ('DNI', 'PASAPORTE', 'RUC', 'CE');

-- AlterEnum
BEGIN;
CREATE TYPE "estado_pago_new" AS ENUM ('CONFIRMADO', 'DEVUELTO', 'RETENIDO', 'ANULADO');
ALTER TABLE "public"."pagos" ALTER COLUMN "estado" DROP DEFAULT;
ALTER TABLE "pagos" ALTER COLUMN "estado" TYPE "estado_pago_new" USING ("estado"::text::"estado_pago_new");
ALTER TYPE "estado_pago" RENAME TO "estado_pago_old";
ALTER TYPE "estado_pago_new" RENAME TO "estado_pago";
DROP TYPE "public"."estado_pago_old";
ALTER TABLE "pagos" ALTER COLUMN "estado" SET DEFAULT 'CONFIRMADO';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "metodo_pago_new" AS ENUM ('EFECTIVO', 'VISA', 'MASTERCARD', 'AMEX', 'TRANSFERENCIA');
ALTER TABLE "pagos" ALTER COLUMN "metodo" TYPE "metodo_pago_new" USING ("metodo"::text::"metodo_pago_new");
ALTER TYPE "metodo_pago" RENAME TO "metodo_pago_old";
ALTER TYPE "metodo_pago_new" RENAME TO "metodo_pago";
DROP TYPE "public"."metodo_pago_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "pagos" DROP CONSTRAINT "pagos_recibidoPorId_fkey";

-- AlterTable
ALTER TABLE "huespedes" DROP COLUMN "notas",
ADD COLUMN     "nroDoc" VARCHAR(20),
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "tipoDoc" "tipo_doc_identidad";

-- AlterTable
ALTER TABLE "pagos" DROP COLUMN "notas",
ADD COLUMN     "observacion" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL,
ALTER COLUMN "moneda" SET DEFAULT 'SOL';

-- DropEnum
DROP TYPE "tipo_documento";

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_recibidoPorId_fkey" FOREIGN KEY ("recibidoPorId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
