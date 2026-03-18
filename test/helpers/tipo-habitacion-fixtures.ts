import { TipoHabitacion } from "../../src/domain/entities/tipo-habitacion.entity";

export function createMockTipoHabitacion(overrides?: Partial<TipoHabitacion>): TipoHabitacion {
  return new TipoHabitacion(
    overrides?.id ?? "tipo-test-id",
    overrides?.nombre ?? "Suite Deluxe",
    overrides?.descripcion !== undefined ? overrides.descripcion : "Suite de lujo con vista panorámica",
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
