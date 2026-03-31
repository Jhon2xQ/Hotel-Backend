import { Reserva, EstadoReserva } from "../../src/domain/entities/reserva.entity";
import { Huesped } from "../../src/domain/entities/huesped.entity";
import { Habitacion } from "../../src/domain/entities/habitacion.entity";
import { Tarifa } from "../../src/domain/entities/tarifa.entity";
import { Pago, ConceptoPago, EstadoPago, MetodoPago } from "../../src/domain/entities/pago.entity";
import { TipoHabitacion } from "../../src/domain/entities/tipo-habitacion.entity";
import { Canal } from "../../src/domain/entities/canal.entity";

export function createMockReserva(overrides?: Partial<Reserva>): Reserva {
  const huesped =
    overrides?.huesped ??
    new Huesped(
      "huesped-test-id",
      "DNI",
      "12345678",
      "Juan",
      "Pérez",
      "juan@example.com",
      "+51999999999",
      "PE",
      null,
      new Date(),
      new Date(),
    );

  const tipoHabitacion = new TipoHabitacion(
    "tipo-habitacion-test-id",
    "Suite Deluxe",
    "Suite de lujo",
    new Date(),
    new Date(),
  );

  const habitacion =
    overrides?.habitacion ??
    new Habitacion(
      "habitacion-test-id",
      "101",
      tipoHabitacion,
      1,
      true,
      true,
      null,
      false,
      null,
      new Date(),
      new Date(),
    );

  const canal = new Canal("canal-test-id", "Booking.com", "OTA", true, null, new Date(), new Date());

  const tarifa =
    overrides?.tarifa ??
    new Tarifa("tarifa-test-id", tipoHabitacion, canal, 150.0, 18.0, 10.0, "USD", new Date(), new Date());

  const pago = overrides?.pago ?? null;

  return new Reserva(
    overrides?.id ?? "reserva-test-id",
    overrides?.codigo ?? "RES-2024-001",
    huesped,
    habitacion,
    tarifa,
    pago,
    overrides?.fechaEntrada ?? new Date("2024-03-25T14:00:00.000Z"),
    overrides?.fechaSalida ?? new Date("2024-03-27T12:00:00.000Z"),
    overrides?.adultos ?? 2,
    overrides?.ninos ?? 1,
    overrides?.nombreHuesped ?? "Juan Pérez",
    overrides?.nroHabitacion ?? "101",
    overrides?.nombreTipoHab ?? "Suite Deluxe",
    overrides?.nombreCanal ?? "Booking.com",
    overrides?.precioNoche ?? 150.0,
    overrides?.cantidadNoches ?? 2,
    overrides?.IVA ?? 18.0,
    overrides?.cargoServicios ?? 10.0,
    overrides?.montoTotal ?? 420.0,
    overrides?.estado ?? EstadoReserva.TENTATIVA,
    overrides?.motivoCancel ?? null,
    overrides?.canceladoEn ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}

export function createMockPago(overrides?: Partial<Pago>): Pago {
  return new Pago(
    overrides?.id ?? "pago-test-id",
    overrides?.concepto ?? ConceptoPago.RESERVA,
    overrides?.estado ?? EstadoPago.CONFIRMADO,
    overrides?.fechaPago ?? new Date(),
    overrides?.monto ?? 300.0,
    overrides?.moneda ?? "USD",
    overrides?.metodo ?? MetodoPago.EFECTIVO,
    overrides?.recibidoPorId ?? null,
    overrides?.recibidoPor ?? null,
    overrides?.observacion ?? null,
    overrides?.createdAt ?? new Date(),
  );
}
