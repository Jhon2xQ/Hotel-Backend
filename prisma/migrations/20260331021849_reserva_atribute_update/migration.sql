/*
  Warnings:

  - You are about to drop the column `montoDescuento` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `montoFinal` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `cantidadNoches` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "montoDescuento",
DROP COLUMN "montoFinal",
ADD COLUMN     "cantidadNoches" SMALLINT NOT NULL;
