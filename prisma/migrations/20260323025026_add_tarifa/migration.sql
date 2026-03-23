-- CreateTable
CREATE TABLE "tarifas" (
    "id" UUID NOT NULL,
    "tipoHabitacionId" UUID NOT NULL,
    "canalId" UUID NOT NULL,
    "precioNoche" DECIMAL(10,2) NOT NULL,
    "IVA" DECIMAL(4,2),
    "cargoServicios" DECIMAL(4,2),
    "moneda" CHAR(3) NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_tipoHabitacionId_fkey" FOREIGN KEY ("tipoHabitacionId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "canales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
