/*
  Warnings:

  - You are about to drop the column `balance` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `closedAt` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `folioNumber` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `stayId` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `totalCharges` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the column `totalPayments` on the `folios` table. All the data in the column will be lost.
  - You are about to drop the `agencies` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `channels` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `folio_charges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `furniture_catalog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guest_stays_summary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guests` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invoices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rate_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rates` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_furniture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_type_furniture` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `room_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `rooms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seasons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `services` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `staff` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stays` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[estanciaId]` on the table `folios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nroFolio]` on the table `folios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estanciaId` to the `folios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nroFolio` to the `folios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipo_canal" AS ENUM ('OTA', 'DIRECTO', 'AGENCIA', 'CORPORATIVO', 'OPERADOR');

-- CreateEnum
CREATE TYPE "tipo_documento" AS ENUM ('DNI', 'PASAPORTE', 'CE', 'RUC');

-- CreateEnum
CREATE TYPE "genero" AS ENUM ('M', 'F', 'O');

-- CreateEnum
CREATE TYPE "estado_habitacion" AS ENUM ('DISPONIBLE', 'RESERVADA', 'OCUPADA', 'LIMPIEZA', 'MANTENIMIENTO');

-- CreateEnum
CREATE TYPE "estado_limpieza" AS ENUM ('LIMPIA', 'SUCIA', 'EN_LIMPIEZA', 'INSPECCION');

-- CreateEnum
CREATE TYPE "condicion_mueble" AS ENUM ('BUENO', 'REGULAR', 'DANADO', 'FALTANTE');

-- CreateEnum
CREATE TYPE "categoria_mueble" AS ENUM ('CAMA', 'ASIENTO', 'ALMACENAJE', 'TECNOLOGIA', 'BANO', 'DECORACION', 'OTRO');

-- CreateEnum
CREATE TYPE "politica_cancelacion" AS ENUM ('FLEXIBLE', 'MODERADA', 'ESTRICTA', 'NO_REEMBOLSABLE');

-- CreateEnum
CREATE TYPE "tipo_temporada" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'MUY_ALTA');

-- CreateEnum
CREATE TYPE "estado_reserva" AS ENUM ('TENTATIVA', 'CONFIRMADA', 'EN_CASA', 'COMPLETADA', 'CANCELADA', 'NO_LLEGO');

-- CreateEnum
CREATE TYPE "concepto_pago" AS ENUM ('DEPOSITO', 'SALDO', 'ABONO', 'DEVOLUCION', 'RETENIDO');

-- CreateEnum
CREATE TYPE "estado_pago" AS ENUM ('CONFIRMADO', 'APLICADO', 'DEVUELTO', 'RETENIDO', 'ANULADO');

-- CreateEnum
CREATE TYPE "metodo_pago" AS ENUM ('EFECTIVO', 'VISA', 'MASTERCARD', 'AMEX', 'TRANSFERENCIA', 'CREDITO_AGENCIA', 'VOUCHER');

-- CreateEnum
CREATE TYPE "estado_estadia" AS ENUM ('EN_CASA', 'COMPLETADA', 'SALIDA_ANTICIPADA');

-- CreateEnum
CREATE TYPE "estado_folio" AS ENUM ('ABIERTO', 'CERRADO', 'TRANSFERIDO');

-- CreateEnum
CREATE TYPE "categoria_servicio" AS ENUM ('HABITACION', 'ALIMENTO', 'BEBIDA', 'SPA', 'TOUR', 'LAVANDERIA', 'TRANSPORTE', 'MINIBAR', 'OTRO');

-- CreateEnum
CREATE TYPE "tipo_comprobante" AS ENUM ('BOLETA', 'FACTURA', 'NOTA_CREDITO');

-- CreateEnum
CREATE TYPE "estado_sunat" AS ENUM ('PENDIENTE', 'ACEPTADO', 'RECHAZADO', 'ANULADO');

-- CreateEnum
CREATE TYPE "rol_personal" AS ENUM ('RECEPCIONISTA', 'GERENTE', 'CAMARERA', 'BELLBOY', 'MOZO', 'CONTADOR', 'SEGURIDAD', 'OTRO');

-- DropForeignKey
ALTER TABLE "agencies" DROP CONSTRAINT "agencies_channelId_fkey";

-- DropForeignKey
ALTER TABLE "folio_charges" DROP CONSTRAINT "folio_charges_folioId_fkey";

-- DropForeignKey
ALTER TABLE "folio_charges" DROP CONSTRAINT "folio_charges_postedById_fkey";

-- DropForeignKey
ALTER TABLE "folio_charges" DROP CONSTRAINT "folio_charges_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "folios" DROP CONSTRAINT "folios_stayId_fkey";

-- DropForeignKey
ALTER TABLE "guest_stays_summary" DROP CONSTRAINT "guest_stays_summary_guestId_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_folioId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_folioId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_parentPaymentId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_receivedById_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_reservationId_fkey";

-- DropForeignKey
ALTER TABLE "rates" DROP CONSTRAINT "rates_channelId_fkey";

-- DropForeignKey
ALTER TABLE "rates" DROP CONSTRAINT "rates_ratePlanId_fkey";

-- DropForeignKey
ALTER TABLE "rates" DROP CONSTRAINT "rates_roomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "rates" DROP CONSTRAINT "rates_seasonId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_agencyId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_channelId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_guestId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_ratePlanId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_roomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "room_furniture" DROP CONSTRAINT "room_furniture_furnitureId_fkey";

-- DropForeignKey
ALTER TABLE "room_furniture" DROP CONSTRAINT "room_furniture_roomId_fkey";

-- DropForeignKey
ALTER TABLE "room_type_furniture" DROP CONSTRAINT "room_type_furniture_furnitureId_fkey";

-- DropForeignKey
ALTER TABLE "room_type_furniture" DROP CONSTRAINT "room_type_furniture_roomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_roomTypeId_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_userId_fkey";

-- DropForeignKey
ALTER TABLE "stays" DROP CONSTRAINT "stays_checkinById_fkey";

-- DropForeignKey
ALTER TABLE "stays" DROP CONSTRAINT "stays_checkoutById_fkey";

-- DropForeignKey
ALTER TABLE "stays" DROP CONSTRAINT "stays_guestId_fkey";

-- DropForeignKey
ALTER TABLE "stays" DROP CONSTRAINT "stays_reservationId_fkey";

-- DropForeignKey
ALTER TABLE "stays" DROP CONSTRAINT "stays_roomId_fkey";

-- DropIndex
DROP INDEX "folios_folioNumber_key";

-- DropIndex
DROP INDEX "folios_stayId_key";

-- AlterTable
ALTER TABLE "folios" DROP COLUMN "balance",
DROP COLUMN "closedAt",
DROP COLUMN "currency",
DROP COLUMN "folioNumber",
DROP COLUMN "notes",
DROP COLUMN "status",
DROP COLUMN "stayId",
DROP COLUMN "totalCharges",
DROP COLUMN "totalPayments",
ADD COLUMN     "cerradoEn" TIMESTAMPTZ,
ADD COLUMN     "estado" "estado_folio" NOT NULL DEFAULT 'ABIERTO',
ADD COLUMN     "estanciaId" UUID NOT NULL,
ADD COLUMN     "moneda" CHAR(3) NOT NULL DEFAULT 'USD',
ADD COLUMN     "notas" TEXT,
ADD COLUMN     "nroFolio" VARCHAR(20) NOT NULL,
ADD COLUMN     "saldo" DECIMAL(12,2),
ADD COLUMN     "totalCargos" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "totalPagos" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "agencies";

-- DropTable
DROP TABLE "channels";

-- DropTable
DROP TABLE "folio_charges";

-- DropTable
DROP TABLE "furniture_catalog";

-- DropTable
DROP TABLE "guest_stays_summary";

-- DropTable
DROP TABLE "guests";

-- DropTable
DROP TABLE "invoices";

-- DropTable
DROP TABLE "payments";

-- DropTable
DROP TABLE "rate_plans";

-- DropTable
DROP TABLE "rates";

-- DropTable
DROP TABLE "reservations";

-- DropTable
DROP TABLE "room_furniture";

-- DropTable
DROP TABLE "room_type_furniture";

-- DropTable
DROP TABLE "room_types";

-- DropTable
DROP TABLE "rooms";

-- DropTable
DROP TABLE "seasons";

-- DropTable
DROP TABLE "services";

-- DropTable
DROP TABLE "staff";

-- DropTable
DROP TABLE "stays";

-- DropEnum
DROP TYPE "CancelPolicy";

-- DropEnum
DROP TYPE "ChannelType";

-- DropEnum
DROP TYPE "DocType";

-- DropEnum
DROP TYPE "FolioStatus";

-- DropEnum
DROP TYPE "FurnitureCategory";

-- DropEnum
DROP TYPE "FurnitureCondition";

-- DropEnum
DROP TYPE "Gender";

-- DropEnum
DROP TYPE "HousekeepingStatus";

-- DropEnum
DROP TYPE "InvoiceType";

-- DropEnum
DROP TYPE "PaymentConcept";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "ReservationStatus";

-- DropEnum
DROP TYPE "RoomStatus";

-- DropEnum
DROP TYPE "SeasonType";

-- DropEnum
DROP TYPE "ServiceCategory";

-- DropEnum
DROP TYPE "StaffRole";

-- DropEnum
DROP TYPE "StayStatus";

-- DropEnum
DROP TYPE "SunatStatus";

-- CreateTable
CREATE TABLE "canales" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "tipo" "tipo_canal" NOT NULL,
    "comisionPct" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "canales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agencias" (
    "id" UUID NOT NULL,
    "canalId" UUID NOT NULL,
    "ruc" VARCHAR(11),
    "nombre" VARCHAR(150) NOT NULL,
    "contacto" VARCHAR(100),
    "email" VARCHAR(100),
    "telefono" VARCHAR(20),
    "direccion" TEXT,
    "ciudad" VARCHAR(80),
    "pais" VARCHAR(60) NOT NULL DEFAULT 'Peru',
    "limiteCredito" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "diasPago" INTEGER NOT NULL DEFAULT 30,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "agencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "huespedes" (
    "id" UUID NOT NULL,
    "nombres" VARCHAR(80) NOT NULL,
    "apellidos" VARCHAR(80) NOT NULL,
    "email" VARCHAR(120),
    "telefono" VARCHAR(20),
    "nacionalidad" VARCHAR(60),
    "tipoDoc" "tipo_documento",
    "nroDoc" VARCHAR(30),
    "fechaNac" DATE,
    "genero" "genero",
    "idioma" VARCHAR(10) NOT NULL DEFAULT 'es',
    "nivelVip" INTEGER NOT NULL DEFAULT 0,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "huespedes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumen_estancias" (
    "huespedId" UUID NOT NULL,
    "totalEstancias" INTEGER NOT NULL DEFAULT 0,
    "totalNoches" INTEGER NOT NULL DEFAULT 0,
    "totalGastado" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "ultimaEstancia" DATE,
    "primeraEstancia" DATE,

    CONSTRAINT "resumen_estancias_pkey" PRIMARY KEY ("huespedId")
);

-- CreateTable
CREATE TABLE "tipos_habitacion" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "areaM2" DECIMAL(6,1),
    "tipoCama" VARCHAR(50),
    "vista" VARCHAR(50),
    "pisos" VARCHAR(20),
    "tieneTina" BOOLEAN NOT NULL DEFAULT false,
    "tieneJacuzzi" BOOLEAN NOT NULL DEFAULT false,
    "tieneSala" BOOLEAN NOT NULL DEFAULT false,
    "tieneCocina" BOOLEAN NOT NULL DEFAULT false,
    "urlImagen" VARCHAR(255),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tipos_habitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catalogo_muebles" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "categoria" "categoria_mueble" NOT NULL,
    "descripcion" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "catalogo_muebles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muebles_por_tipo" (
    "id" UUID NOT NULL,
    "tipoHabitacionId" UUID NOT NULL,
    "muebleId" UUID NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "obligatorio" BOOLEAN NOT NULL DEFAULT true,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "muebles_por_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habitaciones" (
    "id" UUID NOT NULL,
    "nroHabitacion" VARCHAR(10) NOT NULL,
    "tipoId" UUID NOT NULL,
    "piso" INTEGER NOT NULL,
    "estado" "estado_habitacion" NOT NULL DEFAULT 'DISPONIBLE',
    "limpieza" "estado_limpieza" NOT NULL DEFAULT 'LIMPIA',
    "accesible" BOOLEAN NOT NULL DEFAULT false,
    "notas" TEXT,
    "ultimaLimpieza" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "habitaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "muebles_habitacion" (
    "id" UUID NOT NULL,
    "habitacionId" UUID NOT NULL,
    "muebleId" UUID NOT NULL,
    "nroSerie" VARCHAR(60),
    "condicion" "condicion_mueble" NOT NULL DEFAULT 'BUENO',
    "fechaAdq" DATE,
    "ultimaRevision" DATE,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "muebles_habitacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "planes_tarifa" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "incluyeDesayuno" BOOLEAN NOT NULL DEFAULT false,
    "incluyeAlmuerzo" BOOLEAN NOT NULL DEFAULT false,
    "incluyeCena" BOOLEAN NOT NULL DEFAULT false,
    "politicaCancel" "politica_cancelacion" NOT NULL DEFAULT 'FLEXIBLE',
    "horasCancel" INTEGER NOT NULL DEFAULT 24,
    "nochesMinimas" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "planes_tarifa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "temporadas" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(80) NOT NULL,
    "tipo" "tipo_temporada" NOT NULL,
    "fechaInicio" DATE NOT NULL,
    "fechaFin" DATE NOT NULL,
    "multiplicador" DECIMAL(4,2) NOT NULL DEFAULT 1.00,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "temporadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarifas" (
    "id" UUID NOT NULL,
    "tipoHabitacionId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "temporadaId" UUID,
    "canalId" UUID,
    "precioNoche" DECIMAL(10,2) NOT NULL,
    "precioAdultoExtra" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "precioNinoExtra" DECIMAL(8,2) NOT NULL DEFAULT 0,
    "moneda" CHAR(3) NOT NULL DEFAULT 'USD',
    "vigenciaDesde" DATE,
    "vigenciaHasta" DATE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "tarifas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "personal" (
    "id" UUID NOT NULL,
    "userId" TEXT,
    "codigo" VARCHAR(20) NOT NULL,
    "nombres" VARCHAR(80) NOT NULL,
    "apellidos" VARCHAR(80) NOT NULL,
    "rol" "rol_personal" NOT NULL,
    "email" VARCHAR(100),
    "telefono" VARCHAR(20),
    "fechaIngreso" DATE,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "personal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicios" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "categoria" "categoria_servicio" NOT NULL,
    "precioUnitario" DECIMAL(10,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'USD',
    "igvPct" DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "descripcion" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "servicios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservas" (
    "id" UUID NOT NULL,
    "codigo" VARCHAR(20) NOT NULL,
    "huespedId" UUID NOT NULL,
    "agenciaId" UUID,
    "canalId" UUID NOT NULL,
    "tipoHabId" UUID NOT NULL,
    "planId" UUID NOT NULL,
    "fechaEntrada" DATE NOT NULL,
    "fechaSalida" DATE NOT NULL,
    "noches" INTEGER,
    "adultos" INTEGER NOT NULL DEFAULT 1,
    "ninos" INTEGER NOT NULL DEFAULT 0,
    "precioNoche" DECIMAL(10,2) NOT NULL,
    "montoTotal" DECIMAL(12,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'USD',
    "estado" "estado_reserva" NOT NULL DEFAULT 'TENTATIVA',
    "motivoCancel" TEXT,
    "canceladoEn" TIMESTAMPTZ,
    "refExterna" VARCHAR(100),
    "nroVoucher" VARCHAR(50),
    "solicitudes" TEXT,
    "horaLlegada" TIME,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" UUID NOT NULL,
    "reservaId" UUID NOT NULL,
    "folioId" UUID,
    "concepto" "concepto_pago" NOT NULL,
    "estado" "estado_pago" NOT NULL DEFAULT 'CONFIRMADO',
    "fechaPago" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "monto" DECIMAL(12,2) NOT NULL,
    "moneda" CHAR(3) NOT NULL DEFAULT 'USD',
    "metodo" "metodo_pago" NOT NULL,
    "referencia" VARCHAR(100),
    "recibidoPorId" UUID,
    "notas" TEXT,
    "pagoOrigenId" UUID,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estancias" (
    "id" UUID NOT NULL,
    "reservaId" UUID NOT NULL,
    "habitacionId" UUID NOT NULL,
    "huespedId" UUID NOT NULL,
    "horaEntrada" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaSalida" TIMESTAMPTZ,
    "estado" "estado_estadia" NOT NULL DEFAULT 'EN_CASA',
    "checkinPorId" UUID,
    "checkoutPorId" UUID,
    "notas" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estancias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos_folio" (
    "id" UUID NOT NULL,
    "folioId" UUID NOT NULL,
    "servicioId" UUID NOT NULL,
    "fechaCargo" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cantidad" DECIMAL(8,2) NOT NULL DEFAULT 1,
    "precioUnit" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(12,2),
    "igvPct" DECIMAL(5,2) NOT NULL DEFAULT 18.00,
    "montoIgv" DECIMAL(12,2),
    "total" DECIMAL(12,2),
    "descripcion" TEXT,
    "registradoPorId" UUID,
    "anulado" BOOLEAN NOT NULL DEFAULT false,
    "motivoAnul" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cargos_folio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comprobantes" (
    "id" UUID NOT NULL,
    "folioId" UUID NOT NULL,
    "tipo" "tipo_comprobante" NOT NULL,
    "serie" VARCHAR(5) NOT NULL,
    "numero" INTEGER NOT NULL,
    "fechaEmision" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tipoDocReceptor" VARCHAR(10),
    "nroDocReceptor" VARCHAR(11),
    "nombreReceptor" VARCHAR(200),
    "dirReceptor" TEXT,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "igv" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "estadoSunat" "estado_sunat" NOT NULL DEFAULT 'PENDIENTE',
    "codigoSunat" VARCHAR(50),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comprobantes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "canales_codigo_key" ON "canales"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "huespedes_email_key" ON "huespedes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "huespedes_tipoDoc_nroDoc_key" ON "huespedes"("tipoDoc", "nroDoc");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_habitacion_codigo_key" ON "tipos_habitacion"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "catalogo_muebles_codigo_key" ON "catalogo_muebles"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "muebles_por_tipo_tipoHabitacionId_muebleId_key" ON "muebles_por_tipo"("tipoHabitacionId", "muebleId");

-- CreateIndex
CREATE UNIQUE INDEX "habitaciones_nroHabitacion_key" ON "habitaciones"("nroHabitacion");

-- CreateIndex
CREATE UNIQUE INDEX "planes_tarifa_codigo_key" ON "planes_tarifa"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "tarifas_tipoHabitacionId_planId_temporadaId_canalId_key" ON "tarifas"("tipoHabitacionId", "planId", "temporadaId", "canalId");

-- CreateIndex
CREATE UNIQUE INDEX "personal_userId_key" ON "personal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "personal_codigo_key" ON "personal"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "servicios_codigo_key" ON "servicios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "reservas_codigo_key" ON "reservas"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "comprobantes_serie_numero_key" ON "comprobantes"("serie", "numero");

-- CreateIndex
CREATE UNIQUE INDEX "folios_estanciaId_key" ON "folios"("estanciaId");

-- CreateIndex
CREATE UNIQUE INDEX "folios_nroFolio_key" ON "folios"("nroFolio");

-- AddForeignKey
ALTER TABLE "agencias" ADD CONSTRAINT "agencias_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "canales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumen_estancias" ADD CONSTRAINT "resumen_estancias_huespedId_fkey" FOREIGN KEY ("huespedId") REFERENCES "huespedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muebles_por_tipo" ADD CONSTRAINT "muebles_por_tipo_tipoHabitacionId_fkey" FOREIGN KEY ("tipoHabitacionId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muebles_por_tipo" ADD CONSTRAINT "muebles_por_tipo_muebleId_fkey" FOREIGN KEY ("muebleId") REFERENCES "catalogo_muebles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habitaciones" ADD CONSTRAINT "habitaciones_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muebles_habitacion" ADD CONSTRAINT "muebles_habitacion_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "muebles_habitacion" ADD CONSTRAINT "muebles_habitacion_muebleId_fkey" FOREIGN KEY ("muebleId") REFERENCES "catalogo_muebles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_tipoHabitacionId_fkey" FOREIGN KEY ("tipoHabitacionId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes_tarifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_temporadaId_fkey" FOREIGN KEY ("temporadaId") REFERENCES "temporadas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tarifas" ADD CONSTRAINT "tarifas_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "canales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "personal" ADD CONSTRAINT "personal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_huespedId_fkey" FOREIGN KEY ("huespedId") REFERENCES "huespedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_agenciaId_fkey" FOREIGN KEY ("agenciaId") REFERENCES "agencias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_canalId_fkey" FOREIGN KEY ("canalId") REFERENCES "canales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_tipoHabId_fkey" FOREIGN KEY ("tipoHabId") REFERENCES "tipos_habitacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservas" ADD CONSTRAINT "reservas_planId_fkey" FOREIGN KEY ("planId") REFERENCES "planes_tarifa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "folios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_recibidoPorId_fkey" FOREIGN KEY ("recibidoPorId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_pagoOrigenId_fkey" FOREIGN KEY ("pagoOrigenId") REFERENCES "pagos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estancias" ADD CONSTRAINT "estancias_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estancias" ADD CONSTRAINT "estancias_habitacionId_fkey" FOREIGN KEY ("habitacionId") REFERENCES "habitaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estancias" ADD CONSTRAINT "estancias_huespedId_fkey" FOREIGN KEY ("huespedId") REFERENCES "huespedes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estancias" ADD CONSTRAINT "estancias_checkinPorId_fkey" FOREIGN KEY ("checkinPorId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estancias" ADD CONSTRAINT "estancias_checkoutPorId_fkey" FOREIGN KEY ("checkoutPorId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folios" ADD CONSTRAINT "folios_estanciaId_fkey" FOREIGN KEY ("estanciaId") REFERENCES "estancias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_folio" ADD CONSTRAINT "cargos_folio_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "folios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_folio" ADD CONSTRAINT "cargos_folio_servicioId_fkey" FOREIGN KEY ("servicioId") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos_folio" ADD CONSTRAINT "cargos_folio_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "personal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprobantes" ADD CONSTRAINT "comprobantes_folioId_fkey" FOREIGN KEY ("folioId") REFERENCES "folios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
