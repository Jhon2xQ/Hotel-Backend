-- CreateTable
CREATE TABLE "internacionalizaciones" (
    "id" UUID NOT NULL,
    "habitacionId" UUID NOT NULL,
    "descripcionEn" TEXT,
    "descripcionFr" TEXT,
    "featureEn" TEXT,
    "featureFr" TEXT,
    "amenitiesEn" TEXT,
    "amenitiesFr" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "internacionalizaciones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "internacionalizaciones_habitacionId_key" ON "internacionalizaciones"("habitacionId");

-- AddForeignKey
ALTER TABLE "internacionalizaciones" ADD CONSTRAINT "internacionalizaciones_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE CASCADE ON UPDATE CASCADE;
