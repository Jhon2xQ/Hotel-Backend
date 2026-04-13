import { Reserva, EstadoReserva } from "../../src/domain/entities/reserva.entity";

export function createMockReserva(overrides?: Partial<Reserva>): Reserva {
  return new Reserva(
    overrides?.id ?? "reserva-test-id",
    overrides?.codigo ?? "RES-2024-001",
    overrides?.huespedId ?? "huesped-test-id",
    overrides?.habitacionId ?? "habitacion-test-id",
    overrides?.tarifaId ?? "tarifa-test-id",
    overrides?.pagoId ?? null,
    overrides?.fechaInicio ?? new Date("2024-03-25"),
    overrides?.fechaFin ?? new Date("2024-03-27"),
    overrides?.adultos ?? 2,
    overrides?.ninos ?? 1,
    overrides?.nombreHuesped ?? "Juan Pérez",
    overrides?.nroHabitacion ?? "101",
    overrides?.nombreTipoHab ?? "Suite Deluxe",
    overrides?.nombreCanal ?? "Booking.com",
    overrides?.precioTarifa ?? 150.0,
    overrides?.unidadTarifa ?? "noches",
    overrides?.cantidadUnidad ?? 2,
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
