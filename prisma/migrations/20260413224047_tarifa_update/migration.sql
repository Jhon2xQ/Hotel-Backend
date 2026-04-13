/*
  Warnings:

  - You are about to drop the column `precioNoche` on the `tarifas` table. All the data in the column will be lost.
  - Added the required column `precio` to the `tarifas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tarifas" DROP COLUMN "precioNoche",
ADD COLUMN     "precio" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "unidad" VARCHAR(6) NOT NULL DEFAULT 'noches';
