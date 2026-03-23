import { Habitacion, EstadoHabitacion } from "../../src/domain/entities/habitacion.entity";

export function createMockHabitacion(overrides?: Partial<Habitacion>): Habitacion {
  return new Habitacion(
    overrides?.id ?? "habitacion-test-id",
    overrides?.nroHabitacion ?? "101",
    overrides?.tipoHabitacionId ?? "tipo-test-id",
    overrides?.tipo ?? {
      id: "tipo-test-id",
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo",
    },
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
