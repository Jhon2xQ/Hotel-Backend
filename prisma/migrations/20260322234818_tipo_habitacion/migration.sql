/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `tipos_habitacion` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "tipos_habitacion_nombre_key" ON "tipos_habitacion"("nombre");
