import { Habitacion, EstadoHabitacion, EstadoLimpieza } from "../../src/domain/entities/habitacion.entity";

export function createMockHabitacion(overrides?: Partial<Habitacion>): Habitacion {
  return new Habitacion(
    overrides?.id ?? "habitacion-test-id",
    overrides?.nroHabitacion ?? "101",
    overrides?.tipoId ?? "tipo-test-id",
    overrides?.tipo ?? {
      id: "tipo-test-id",
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo",
    },
    overrides?.piso ?? 1,
    overrides?.tieneDucha ?? true,
    overrides?.tieneBanio ?? true,
    overrides?.urlImagen ?? "https://example.com/room.jpg",
    overrides?.estado ?? EstadoHabitacion.DISPONIBLE,
    overrides?.limpieza ?? EstadoLimpieza.LIMPIA,
    overrides?.notas ?? null,
    overrides?.ultimaLimpieza ?? null,
    overrides?.muebles ?? [],
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
