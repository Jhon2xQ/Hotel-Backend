import { Internacionalizacion } from "../../src/domain/entities/internacionalizacion.entity";

export function createMockInternacionalizacion(overrides?: Partial<Internacionalizacion>): Internacionalizacion {
  return new Internacionalizacion(
    overrides?.id ?? "int-test-id",
    overrides?.habitacionId ?? "habitacion-test-id",
    overrides?.descripcionEn ?? null,
    overrides?.descripcionFr ?? null,
    overrides?.featureEn ?? null,
    overrides?.featureFr ?? null,
    overrides?.amenitiesEn ?? null,
    overrides?.amenitiesFr ?? null,
    overrides?.createdAt ?? new Date(),
    overrides?.updatedAt ?? new Date(),
  );
}