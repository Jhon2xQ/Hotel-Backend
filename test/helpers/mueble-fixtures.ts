import { Mueble, MuebleCondition } from "../../src/domain/entities/mueble.entity";
import { CategoriaMueble } from "../../src/domain/entities/categoria-mueble.entity";

const defaultCategoria = new CategoriaMueble(
  "categoria-id",
  "Cama",
  "Muebles para dormir",
  true,
  new Date(),
  new Date(),
);

export function createMockMueble(overrides?: Partial<Mueble>): Mueble {
  return new Mueble(
    overrides?.id ?? "test-id",
    overrides?.codigo ?? "CAMA-001",
    overrides?.nombre ?? "Cama King Size",
    overrides?.descripcion ?? "Cama king size con colchón ortopédico",
    overrides?.categoria ?? defaultCategoria,
    overrides?.urlImagen ?? "https://example.com/cama.jpg",
    overrides?.condicion ?? MuebleCondition.Bueno,
    overrides?.fechaAdq ?? new Date("2025-01-15"),
    overrides?.ultimaRevision ?? new Date("2026-03-01"),
    overrides?.habitacionId ?? "habitacion-id",
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
