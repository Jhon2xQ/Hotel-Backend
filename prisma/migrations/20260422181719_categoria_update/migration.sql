/*
  Warnings:

  - You are about to drop the column `activo` on the `categoria_mueble` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `categoria_mueble` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `tipos_habitacion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categoria_mueble" DROP COLUMN "activo",
DROP COLUMN "descripcion";

-- AlterTable
ALTER TABLE "tipos_habitacion" DROP COLUMN "descripcion";
