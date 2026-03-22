/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `categoria_mueble` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categoria_mueble_nombre_key" ON "categoria_mueble"("nombre");
