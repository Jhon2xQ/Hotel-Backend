import { Habitacion } from "../../src/domain/entities/habitacion.entity";
import { TipoHabitacion } from "../../src/domain/entities/tipo-habitacion.entity";

const defaultTipo = new TipoHabitacion(
  "tipo-test-id",
  "Suite Deluxe",
  new Date("2025-01-01"),
  new Date("2025-01-01"),
);

export function createMockHabitacion(overrides?: Partial<Habitacion>): Habitacion {
  return new Habitacion(
    overrides?.id ?? "habitacion-test-id",
    overrides?.nroHabitacion ?? "101",
    overrides?.tipoHabitacion ?? defaultTipo,
    overrides?.piso ?? 1,
    overrides?.feature ?? "WiFi, aire acondicionado",
    overrides?.amenities ?? "TV, minibar",
    overrides?.urlImagen ?? ["https://example.com/room.jpg"],
    overrides?.estado ?? false,
    overrides?.descripcion ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
