import { Canal } from "../../src/domain/entities/canal.entity";

export function createMockCanal(overrides?: Partial<Canal>): Canal {
  return new Canal(
    overrides?.id ?? "canal-test-id",
    overrides?.nombre ?? "Booking.com",
    overrides?.tipo ?? "OTA",
    overrides?.activo ?? true,
    overrides?.notas !== undefined ? overrides.notas : "Canal principal de reservas",
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}
