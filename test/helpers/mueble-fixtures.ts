import { Mueble, MuebleCondition } from "../../src/domain/entities/mueble.entity";

export function createMockMueble(overrides?: Partial<Mueble>): Mueble {
  return new Mueble(
    overrides?.id ?? "test-id",
    overrides?.codigo ?? "CAMA-001",
    overrides?.nombre ?? "Cama King Size",
    overrides?.descripcion ?? "Cama king size con colchón ortopédico",
    overrides?.categoriaId ?? "categoria-id",
    overrides?.categoria ?? null,
    overrides?.imagenUrl ?? "https://example.com/cama.jpg",
    overrides?.condicion ?? MuebleCondition.Bueno,
    overrides?.fechaAdq ?? new Date("2025-01-15"),
    overrides?.ultimaRevision ?? new Date("2026-03-01"),
    overrides?.habitacionId ?? "habitacion-id",
    overrides?.habitacion ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
