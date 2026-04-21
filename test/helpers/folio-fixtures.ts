import type { FolioWithRelations } from "../../src/domain/interfaces/folio.repository.interface";
import { Promocion } from "../../src/domain/entities/promocion.entity";

export function createMockFolio(overrides?: Partial<FolioWithRelations>): FolioWithRelations {
  return {
    id: overrides?.id ?? "folio-test-id",
    codigo: overrides?.codigo ?? "FOL-260416-1",
    reservaId: overrides?.reservaId ?? "reserva-test-id",
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
  const promociones = [
    new Promocion(
      "promocion-test-id-1",
      "PROMO-VERANO",
      "PORCENTAJE",
      15.0,
      new Date("2026-06-01T00:00:00Z"),
      new Date("2026-08-31T23:59:59Z"),
      true,
      new Date(),
      new Date(),
    ),
    new Promocion(
      "promocion-test-id-2",
      "PROMO-INVIERNO",
      "MONTO_FIJO",
      500,
      new Date("2026-06-01T00:00:00Z"),
      new Date("2026-08-31T23:59:59Z"),
      true,
      new Date(),
      new Date(),
    ),
  ];

  return {
    id: overrides?.id ?? "folio-test-id",
    codigo: overrides?.codigo ?? "FOL-260416-1",
    reservaId: overrides?.reservaId ?? "reserva-test-id",
    pagoId: overrides?.pagoId ?? null,
    estado: overrides?.estado ?? true,
    observacion: overrides?.observacion ?? "Folio de ejemplo",
    cerradoEn: overrides?.cerradoEn ?? null,
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
    promociones: overrides?.promociones ?? promociones,
  };
}
