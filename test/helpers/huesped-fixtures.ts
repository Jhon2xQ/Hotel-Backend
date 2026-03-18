import { Huesped } from "../../src/domain/entities/huesped.entity";

export function createMockHuesped(overrides?: Partial<Huesped>): Huesped {
  return new Huesped(
    overrides?.id ?? "test-huesped-id",
    overrides?.nombres ?? "Juan Carlos",
    overrides?.apellidos ?? "Pérez García",
    overrides?.email ?? "juan.perez@example.com",
    overrides?.telefono ?? "+51987654321",
    overrides?.nacionalidad ?? "Perú",
    overrides?.nivelVip ?? 0,
    overrides?.notas ?? "Cliente de prueba",
    overrides?.createdAt ?? new Date("2026-03-18T14:30:00.000Z"),
    overrides?.updatedAt ?? new Date("2026-03-18T14:30:00.000Z"),
  );
}
