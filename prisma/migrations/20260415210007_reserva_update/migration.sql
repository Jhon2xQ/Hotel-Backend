-- AlterTable
ALTER TABLE "reservas" ADD COLUMN     "montoDescuento" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN     "promociones" VARCHAR(50)[];
