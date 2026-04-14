-- CreateEnum
CREATE TYPE "tipo_descuento" AS ENUM ('PORCENTAJE', 'MONTO_FIJO');

-- CreateTable
CREATE TABLE "promociones" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "tipoDescuento" "tipo_descuento" NOT NULL,
    "valorDescuento" DECIMAL(6,2) NOT NULL,
    "vigDesde" TIMESTAMPTZ NOT NULL,
    "vigHasta" TIMESTAMPTZ NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "promociones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_HabitacionToPromocion" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_HabitacionToPromocion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "promociones_codigo_key" ON "promociones"("codigo");

-- CreateIndex
CREATE INDEX "_HabitacionToPromocion_B_index" ON "_HabitacionToPromocion"("B");

-- AddForeignKey
ALTER TABLE "_HabitacionToPromocion" ADD CONSTRAINT "_HabitacionToPromocion_A_fkey" FOREIGN KEY ("A") REFERENCES "habitaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HabitacionToPromocion" ADD CONSTRAINT "_HabitacionToPromocion_B_fkey" FOREIGN KEY ("B") REFERENCES "promociones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
