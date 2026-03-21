/*
  Warnings:

  - Changed the type of `categoria` on the `catalogo_muebles` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "catalogo_muebles" DROP COLUMN "categoria",
ADD COLUMN     "categoria" TEXT NOT NULL;

-- DropEnum
DROP TYPE "categoria_mueble";

-- CreateTable
CREATE TABLE "CategoriaMueble" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "CategoriaMueble_pkey" PRIMARY KEY ("id")
);
