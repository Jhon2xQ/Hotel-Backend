/*
  Warnings:

  - You are about to drop the `catalogo_muebles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "catalogo_muebles";

-- CreateTable
CREATE TABLE "muebles" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "categoriaId" UUID NOT NULL,
    "imagenUrl" TEXT,
    "condicion" "condicion_mueble" NOT NULL DEFAULT 'BUENO',
    "fechaAdq" DATE,
    "ultimaRevision" DATE,
    "descripcion" TEXT,
    "habitacionId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "muebles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "muebles_codigo_key" ON "muebles"("codigo");

-- AddForeignKey
ALTER TABLE "muebles" ADD CONSTRAINT "muebles_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "categoria_mueble"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
