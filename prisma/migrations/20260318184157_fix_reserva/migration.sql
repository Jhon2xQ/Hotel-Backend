/*
  Warnings:

  - The values [DEPOSITO,SALDO,ABONO,DEVOLUCION,RETENIDO] on the enum `concepto_pago` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "concepto_pago_new" AS ENUM ('RESERVA', 'CONSUMO');
ALTER TABLE "pagos" ALTER COLUMN "concepto" TYPE "concepto_pago_new" USING ("concepto"::text::"concepto_pago_new");
ALTER TYPE "concepto_pago" RENAME TO "concepto_pago_old";
ALTER TYPE "concepto_pago_new" RENAME TO "concepto_pago";
DROP TYPE "public"."concepto_pago_old";
COMMIT;
