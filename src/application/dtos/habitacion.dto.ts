import type { Habitacion } from "../../domain/entities/habitacion.entity";
import type { TipoHabitacionDto } from "./tipo-habitacion.dto";
import { toTipoHabitacionDto } from "./tipo-habitacion.dto";
import type { MuebleDto, PublicMuebleDto } from "./mueble.dto";
import { toMuebleDto, toPublicMuebleDto } from "./mueble.dto";
import type { Mueble } from "../../domain/entities/mueble.entity";
import type { Internacionalizacion } from "../../domain/entities/internacionalizacion.entity";

export interface CreateHabitacionDto {
  nro_habitacion: string;
  tipo_habitacion_id: string;
  piso: number;
  feature?: string;
  amenities?: string;
  imagenes?: File[];
  estado?: boolean;
  descripcion?: string;
}

export interface UpdateHabitacionDto {
  nro_habitacion?: string;
  tipo_habitacion_id?: string;
  piso?: number;
  feature?: string;
  amenities?: string;
  imagenes_existentes?: string[];
  imagenes?: File[];
  estado?: boolean;
  descripcion?: string;
}

export interface UpdateHabitacionStatusDto {
  estado?: boolean;
}

export interface SearchAvailableHabitacionesDto {
  tipo?: string;
  fecha_inicio?: Date;
  fecha_fin?: Date;
  orden_precio?: "asc" | "desc";
  locale?: "es" | "en" | "fr";
}

export interface HabitacionDto {
  id: string;
  nro_habitacion: string;
  tipo_habitacion: TipoHabitacionDto;
  piso: number;
  feature: string | null;
  amenities: string | null;
  url_imagen: string[] | null;
  estado: boolean;
  descripcion: string | null;
  promociones: string[];
  created_at: string;
  updated_at: string;
}

export interface HabitacionWithMueblesDto extends HabitacionDto {
  muebles: MuebleDto[];
}

export interface HabitacionWithPriceDto {
  habitacion: HabitacionDto;
  precio_noche: number | null;
}

export interface FechaReservaDto {
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
}

export interface HabitacionConFechasReservaDto {
  habitacion: HabitacionDto;
  fechas_reserva: FechaReservaDto[];
}

export interface HabitacionConFechasReservaAndMueblesDto {
  habitacion: HabitacionWithMueblesDto;
  fechas_reserva: FechaReservaDto[];
}

export interface PublicHabitacionDto {
  id: string;
  nro_habitacion: string;
  tipo_habitacion_id: string;
  piso: number;
  feature: string | null;
  amenities: string | null;
  url_imagen: string[] | null;
  estado: boolean;
  descripcion: string | null;
}

export interface PublicHabitacionWithMueblesDto extends PublicHabitacionDto {
  muebles: PublicMuebleDto[];
}

export interface PublicHabitacionWithPriceDto {
  habitacion: PublicHabitacionDto;
  precio_noche: number | null;
}

export function toHabitacionDto(h: Habitacion, muebles: Mueble[] = [], promociones: string[] = []): HabitacionDto {
  return {
    id: h.id,
    nro_habitacion: h.nroHabitacion,
    tipo_habitacion: toTipoHabitacionDto(h.tipoHabitacion),
    piso: h.piso,
    feature: h.feature,
    amenities: h.amenities,
    url_imagen: h.urlImagen,
    estado: h.estado,
    descripcion: h.descripcion,
    promociones,
    created_at: h.createdAt.toISOString(),
    updated_at: h.updatedAt.toISOString(),
  };
}

export function toHabitacionWithMueblesDto(h: Habitacion, muebles: Mueble[], promociones: string[] = []): HabitacionWithMueblesDto {
  return {
    ...toHabitacionDto(h, muebles, promociones),
    muebles: muebles.map(toMuebleDto),
  };
}

export function toPublicHabitacionDto(
  h: Habitacion,
  internacionalizacion?: Internacionalizacion | null,
  locale: "es" | "en" | "fr" = "es",
): PublicHabitacionDto {
  let feature = h.feature;
  let amenities = h.amenities;
  let descripcion = h.descripcion;

  if (internacionalizacion && locale !== "es") {
    if (locale === "en") {
      if (internacionalizacion.featureEn) feature = internacionalizacion.featureEn;
      if (internacionalizacion.amenitiesEn) amenities = internacionalizacion.amenitiesEn;
      if (internacionalizacion.descripcionEn) descripcion = internacionalizacion.descripcionEn;
    } else if (locale === "fr") {
      if (internacionalizacion.featureFr) feature = internacionalizacion.featureFr;
      if (internacionalizacion.amenitiesFr) amenities = internacionalizacion.amenitiesFr;
      if (internacionalizacion.descripcionFr) descripcion = internacionalizacion.descripcionFr;
    }
  }

  return {
    id: h.id,
    nro_habitacion: h.nroHabitacion,
    tipo_habitacion_id: h.tipoHabitacion.id,
    piso: h.piso,
    feature,
    amenities,
    url_imagen: h.urlImagen,
    estado: h.estado,
    descripcion,
  };
}

export function toPublicHabitacionWithMueblesDto(
  h: Habitacion,
  muebles: Mueble[],
  internacionalizacion?: Internacionalizacion | null,
  locale: "es" | "en" | "fr" = "es",
): PublicHabitacionWithMueblesDto {
  return {
    ...toPublicHabitacionDto(h, internacionalizacion, locale),
    muebles: muebles.map(toPublicMuebleDto),
  };
}
