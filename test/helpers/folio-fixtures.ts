import type { FolioWithRelations } from "../../src/domain/interfaces/folio.repository.interface";

export function createMockFolio(overrides?: Partial<FolioWithRelations>): FolioWithRelations {
  return {
    id: overrides?.id ?? "folio-test-id",
    codigo: overrides?.codigo ?? "FOL-260416-1",
    estanciaId: overrides?.estanciaId ?? "estancia-test-id",
    pagoId: overrides?.pagoId ?? null,
    estado: overrides?.estado ?? true,
    observacion: overrides?.observacion ?? null,
    cerradoEn: overrides?.cerradoEn ?? null,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    promociones: overrides?.promociones ?? [],
  };
}

export function createMockFolioWithPromociones(overrides?: Partial<FolioWithRelations>): FolioWithRelations {
  return {
    id: overrides?.id ?? "folio-test-id",
    codigo: overrides?.codigo ?? "FOL-260416-1",
    estanciaId: overrides?.estanciaId ?? "estancia-test-id",
    pagoId: overrides?.pagoId ?? null,
    estado: overrides?.estado ?? true,
    observacion: overrides?.observacion ?? "Folio de ejemplo",
    cerradoEn: overrides?.cerradoEn ?? null,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    promociones: overrides?.promociones ?? ["PROMO-VERANO", "PROMO-INVIERNO"],
  };
}
