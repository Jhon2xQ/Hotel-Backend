/*
  Warnings:

  - You are about to drop the column `cantidadNoches` on the `reservas` table. All the data in the column will be lost.
  - You are about to drop the column `precioNoche` on the `reservas` table. All the data in the column will be lost.
  - Added the required column `cantidadUnidad` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precioTarifa` to the `reservas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadTarifa` to the `reservas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "reservas" DROP COLUMN "cantidadNoches",
DROP COLUMN "precioNoche",
ADD COLUMN     "cantidadUnidad" SMALLINT NOT NULL,
ADD COLUMN     "precioTarifa" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unidadTarifa" VARCHAR(6) NOT NULL,
ALTER COLUMN "fechaFin" SET DATA TYPE TIMESTAMPTZ,
ALTER COLUMN "fechaInicio" SET DATA TYPE TIMESTAMPTZ;
