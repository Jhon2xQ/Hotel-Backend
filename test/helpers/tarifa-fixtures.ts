import { Tarifa } from "../../src/domain/entities/tarifa.entity";
import { TipoHabitacion } from "../../src/domain/entities/tipo-habitacion.entity";
import { Canal } from "../../src/domain/entities/canal.entity";

export function createMockTarifa(overrides?: Partial<Tarifa>): Tarifa {
  const tipoHabitacion =
    overrides?.tipoHabitacion ??
    new TipoHabitacion("tipo-habitacion-test-id", "Suite Deluxe", new Date(), new Date());

  const canal =
    overrides?.canal ??
    new Canal("canal-test-id", "Booking.com", "OTA", true, "Canal principal", new Date(), new Date());

  return new Tarifa(
    overrides?.id ?? "tarifa-test-id",
    tipoHabitacion,
    canal,
    overrides?.precio ?? 150.0,
    overrides?.unidad ?? "noches",
    overrides?.IVA !== undefined ? overrides.IVA : 18.0,
    overrides?.cargoServicios !== undefined ? overrides.cargoServicios : 10.0,
    overrides?.moneda ?? "USD",
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
