/*
  Warnings:

  - You are about to drop the column `accesible` on the `habitaciones` table. All the data in the column will be lost.
  - You are about to drop the column `areaM2` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `codigo` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `pisos` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `tieneCocina` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `tieneJacuzzi` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `tieneSala` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `tieneTina` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `tipoCama` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `urlImagen` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the column `vista` on the `tipos_habitacion` table. All the data in the column will be lost.
  - You are about to drop the `muebles_habitacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `muebles_por_tipo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "muebles_habitacion" DROP CONSTRAINT "muebles_habitacion_habitacionId_fkey";

-- DropForeignKey
ALTER TABLE "muebles_habitacion" DROP CONSTRAINT "muebles_habitacion_muebleId_fkey";

-- DropForeignKey
ALTER TABLE "muebles_por_tipo" DROP CONSTRAINT "muebles_por_tipo_muebleId_fkey";

-- DropForeignKey
ALTER TABLE "muebles_por_tipo" DROP CONSTRAINT "muebles_por_tipo_tipoHabitacionId_fkey";

-- DropIndex
DROP INDEX "tipos_habitacion_codigo_key";

-- AlterTable
ALTER TABLE "catalogo_muebles" ADD COLUMN     "condicion" "condicion_mueble" NOT NULL DEFAULT 'BUENO',
ADD COLUMN     "fechaAdq" DATE,
ADD COLUMN     "imagenUrl" TEXT,
ADD COLUMN     "tipo" VARCHAR(60),
ADD COLUMN     "ultimaRevision" DATE;

-- AlterTable
ALTER TABLE "habitaciones" DROP COLUMN "accesible",
ADD COLUMN     "urlImagen" VARCHAR(255);

-- AlterTable
ALTER TABLE "tipos_habitacion" DROP COLUMN "areaM2",
DROP COLUMN "codigo",
DROP COLUMN "pisos",
DROP COLUMN "tieneCocina",
DROP COLUMN "tieneJacuzzi",
DROP COLUMN "tieneSala",
DROP COLUMN "tieneTina",
DROP COLUMN "tipoCama",
DROP COLUMN "urlImagen",
DROP COLUMN "vista",
ADD COLUMN     "tieneBanio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "tieneDucha" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "muebles_habitacion";

-- DropTable
DROP TABLE "muebles_por_tipo";

-- CreateTable
CREATE TABLE "_MueblesPorTipo" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_MueblesPorTipo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MueblesHabitacion" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_MueblesHabitacion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MueblesPorTipo_B_index" ON "_MueblesPorTipo"("B");

-- CreateIndex
CREATE INDEX "_MueblesHabitacion_B_index" ON "_MueblesHabitacion"("B");

-- AddForeignKey
ALTER TABLE "_MueblesPorTipo" ADD CONSTRAINT "_MueblesPorTipo_A_fkey" FOREIGN KEY ("A") REFERENCES "catalogo_muebles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MueblesPorTipo" ADD CONSTRAINT "_MueblesPorTipo_B_fkey" FOREIGN KEY ("B") REFERENCES "tipos_habitacion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MueblesHabitacion" ADD CONSTRAINT "_MueblesHabitacion_A_fkey" FOREIGN KEY ("A") REFERENCES "catalogo_muebles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MueblesHabitacion" ADD CONSTRAINT "_MueblesHabitacion_B_fkey" FOREIGN KEY ("B") REFERENCES "habitaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
