import type { Internacionalizacion } from "../../domain/entities/internacionalizacion.entity";

export interface CreateInternacionalizacionDto {
  descripcion_en?: string;
  descripcion_fr?: string;
  feature_en?: string;
  feature_fr?: string;
  amenities_en?: string;
  amenities_fr?: string;
}

export interface UpdateInternacionalizacionDto {
  descripcion_en?: string | null;
  descripcion_fr?: string | null;
  feature_en?: string | null;
  feature_fr?: string | null;
  amenities_en?: string | null;
  amenities_fr?: string | null;
}

export interface HabitacionMinDto {
  id: string;
  nro_habitacion: string;
}

export interface InternacionalizacionDto {
  id: string;
  habitacion: HabitacionMinDto;
  descripcion_en: string | null;
  descripcion_fr: string | null;
  feature_en: string | null;
  feature_fr: string | null;
  amenities_en: string | null;
  amenities_fr: string | null;
  created_at: string;
  updated_at: string;
}

export function toInternacionalizacionDto(i: Internacionalizacion, habitacionId: string, nroHabitacion: string): InternacionalizacionDto {
  return {
    id: i.id,
    habitacion: {
      id: habitacionId,
      nro_habitacion: nroHabitacion,
    },
    descripcion_en: i.descripcionEn,
    descripcion_fr: i.descripcionFr,
    feature_en: i.featureEn,
    feature_fr: i.featureFr,
    amenities_en: i.amenitiesEn,
    amenities_fr: i.amenitiesFr,
    created_at: i.createdAt.toISOString(),
    updated_at: i.updatedAt.toISOString(),
  };
}