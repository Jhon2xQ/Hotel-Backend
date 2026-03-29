/*
  Warnings:

  - You are about to drop the column `imagenUrl` on the `muebles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "muebles" DROP COLUMN "imagenUrl",
ADD COLUMN     "urlImagen" TEXT;

-- DropEnum
DROP TYPE "rol_personal";
