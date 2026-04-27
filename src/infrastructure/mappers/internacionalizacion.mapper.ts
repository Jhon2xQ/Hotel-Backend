import { Internacionalizacion } from "../../domain/entities/internacionalizacion.entity";

export type InternacionalizacionPrismaRow = {
  id: string;
  habitacionId: string;
  descripcionEn: string | null;
  descripcionFr: string | null;
  featureEn: string | null;
  featureFr: string | null;
  amenitiesEn: string | null;
  amenitiesFr: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapInternacionalizacionFromPrisma(data: InternacionalizacionPrismaRow): Internacionalizacion {
  return new Internacionalizacion(
    data.id,
    data.habitacionId,
    data.descripcionEn,
    data.descripcionFr,
    data.featureEn,
    data.featureFr,
    data.amenitiesEn,
    data.amenitiesFr,
    data.createdAt,
    data.updatedAt,
  );
}