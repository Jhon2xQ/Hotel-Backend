import { Promocion } from "../../src/domain/entities/promocion.entity";
import type { PromocionWithHabitaciones } from "../../src/domain/interfaces/promocion.repository.interface";

export function createMockPromocion(overrides?: Partial<Promocion>): Promocion {
  return new Promocion(
    overrides?.id ?? "promocion-test-id",
    overrides?.codigo ?? "PROMO-VERANO",
    overrides?.tipoDescuento ?? "PORCENTAJE",
    overrides?.valorDescuento ?? 15.0,
    overrides?.vigDesde ?? new Date("2026-06-01T00:00:00Z"),
    overrides?.vigHasta ?? new Date("2026-08-31T23:59:59Z"),
    overrides?.estado ?? true,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}

export function createMockPromocionWithHabitaciones(overrides?: Partial<PromocionWithHabitaciones>): PromocionWithHabitaciones {
  return {
    id: overrides?.id ?? "promocion-test-id",
    codigo: overrides?.codigo ?? "PROMO-VERANO",
    tipoDescuento: overrides?.tipoDescuento ?? "PORCENTAJE",
    valorDescuento: overrides?.valorDescuento ?? 15.0,
    vigDesde: overrides?.vigDesde ?? new Date("2026-06-01T00:00:00Z"),
    vigHasta: overrides?.vigHasta ?? new Date("2026-08-31T23:59:59Z"),
    estado: overrides?.estado ?? true,
    habitaciones: overrides?.habitaciones ?? [],
    createdAt: overrides?.createdAt ?? new Date(),
    updatedAt: overrides?.updatedAt ?? new Date(),
  };
}
