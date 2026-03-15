-- CreateTable
CREATE TABLE "habitaciones" (
    "id" UUID NOT NULL,
    "numero" TEXT NOT NULL,
    "piso" SMALLINT NOT NULL,
    "tipo" TEXT NOT NULL,
    "precio" DECIMAL(9,2),
    "estado" TEXT NOT NULL DEFAULT 'Disponible',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "habitaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "habitaciones_numero_key" ON "habitaciones"("numero");

-- CreateIndex
CREATE INDEX "habitaciones_tipo_idx" ON "habitaciones"("tipo");

-- CreateIndex
CREATE INDEX "habitaciones_estado_idx" ON "habitaciones"("estado");
