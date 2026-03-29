import { Habitacion, EstadoHabitacion } from "../../src/domain/entities/habitacion.entity";
import { TipoHabitacion } from "../../src/domain/entities/tipo-habitacion.entity";

const defaultTipo = new TipoHabitacion(
  "tipo-test-id",
  "Suite Deluxe",
  "Suite de lujo",
  new Date("2025-01-01"),
  new Date("2025-01-01"),
);

export function createMockHabitacion(overrides?: Partial<Habitacion>): Habitacion {
  return new Habitacion(
    overrides?.id ?? "habitacion-test-id",
    overrides?.nroHabitacion ?? "101",
    overrides?.tipoHabitacion ?? defaultTipo,
    overrides?.piso ?? 1,
    overrides?.tieneDucha ?? true,
    overrides?.tieneBanio ?? true,
    overrides?.urlImagen ?? ["https://example.com/room.jpg"],
    overrides?.estado ?? EstadoHabitacion.DISPONIBLE,
    overrides?.notas ?? null,
    overrides?.ultiLimpieza ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
