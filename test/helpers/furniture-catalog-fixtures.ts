import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../src/domain/entities/furniture-catalog.entity";

export function createMockFurnitureCatalog(overrides?: Partial<FurnitureCatalog>): FurnitureCatalog {
  return new FurnitureCatalog(
    overrides?.id ?? "test-id",
    overrides?.codigo ?? "CAMA-001",
    overrides?.nombre ?? "Cama King Size",
    overrides?.categoria ?? FurnitureCategory.Cama,
    overrides?.imagenUrl ?? "https://example.com/cama.jpg",
    overrides?.tipo ?? "King Size",
    overrides?.condicion ?? FurnitureCondition.Bueno,
    overrides?.fechaAdq ?? new Date("2025-01-15"),
    overrides?.ultimaRevision ?? new Date("2026-03-01"),
    overrides?.descripcion ?? "Cama king size con colchón ortopédico",
    overrides?.habitacionId ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
