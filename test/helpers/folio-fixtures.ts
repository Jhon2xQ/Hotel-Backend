import type { FolioWithPromociones } from "../../src/domain/interfaces/folio.repository.interface";

export function createMockFolio(overrides?: Partial<FolioWithPromociones>): FolioWithPromociones {
  return {
    id: overrides?.id ?? "folio-test-id",
    nroFolio: overrides?.nroFolio ?? 1,
    reservaId: overrides?.reservaId ?? "reserva-test-id",
    estado: overrides?.estado ?? true,
    observacion: overrides?.observacion ?? null,
    cerradoEn: overrides?.cerradoEn ?? null,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    promociones: overrides?.promociones ?? [],
  };
}

export function createMockFolioWithPromociones(overrides?: Partial<FolioWithPromociones>): FolioWithPromociones {
  return {
    id: overrides?.id ?? "folio-test-id",
    nroFolio: overrides?.nroFolio ?? 1,
    reservaId: overrides?.reservaId ?? "reserva-test-id",
    estado: overrides?.estado ?? true,
    observacion: overrides?.observacion ?? "Folio de ejemplo",
    cerradoEn: overrides?.cerradoEn ?? null,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    promociones: overrides?.promociones ?? ["PROMO-VERANO", "PROMO-INVIERNO"],
  };
}