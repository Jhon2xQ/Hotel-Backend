import type { Habitacion } from "../../domain/entities/habitacion.entity";
import type { TipoHabitacionDto } from "./tipo-habitacion.dto";
import { toTipoHabitacionDto } from "./tipo-habitacion.dto";
import type { MuebleDto, PublicMuebleDto } from "./mueble.dto";
import { toMuebleDto, toPublicMuebleDto } from "./mueble.dto";
import type { Mueble } from "../../domain/entities/mueble.entity";

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

export function toPublicHabitacionDto(h: Habitacion): PublicHabitacionDto {
  return {
    id: h.id,
    nro_habitacion: h.nroHabitacion,
    tipo_habitacion_id: h.tipoHabitacion.id,
    piso: h.piso,
    feature: h.feature,
    amenities: h.amenities,
    url_imagen: h.urlImagen,
    estado: h.estado,
    descripcion: h.descripcion,
  };
}

export function toPublicHabitacionWithMueblesDto(h: Habitacion, muebles: Mueble[]): PublicHabitacionWithMueblesDto {
  return {
    ...toPublicHabitacionDto(h),
    muebles: muebles.map(toPublicMuebleDto),
  };
}
