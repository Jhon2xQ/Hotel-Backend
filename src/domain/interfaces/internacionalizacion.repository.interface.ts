import type { Internacionalizacion } from "../entities/internacionalizacion.entity";

export interface CreateInternacionalizacionParams {
  habitacionId: string;
  descripcionEn?: string | null;
  descripcionFr?: string | null;
  featureEn?: string | null;
  featureFr?: string | null;
  amenitiesEn?: string | null;
  amenitiesFr?: string | null;
}

export interface UpdateInternacionalizacionParams {
  descripcionEn?: string | null;
  descripcionFr?: string | null;
  featureEn?: string | null;
  featureFr?: string | null;
  amenitiesEn?: string | null;
  amenitiesFr?: string | null;
}

export interface IInternacionalizacionRepository {
  create(data: CreateInternacionalizacionParams): Promise<Internacionalizacion>;
  findByHabitacionId(habitacionId: string): Promise<Internacionalizacion | null>;
  update(habitacionId: string, data: UpdateInternacionalizacionParams): Promise<Internacionalizacion>;
  delete(habitacionId: string): Promise<void>;
}