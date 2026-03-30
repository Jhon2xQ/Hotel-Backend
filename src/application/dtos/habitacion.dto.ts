import type { Habitacion } from "../../domain/entities/habitacion.entity";
import type { TipoHabitacionDto } from "./tipo-habitacion.dto";
import { toTipoHabitacionDto } from "./tipo-habitacion.dto";

export interface CreateHabitacionDto {
  nro_habitacion: string;
  tipo_habitacion_id: string;
  piso: number;
  tiene_ducha?: boolean;
  tiene_banio?: boolean;
  imagenes?: File[];
  estado?: boolean;
  descripcion?: string;
}

export interface UpdateHabitacionDto {
  nro_habitacion?: string;
  tipo_habitacion_id?: string;
  piso?: number;
  tiene_ducha?: boolean;
  tiene_banio?: boolean;
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
  tiene_ducha: boolean;
  tiene_banio: boolean;
  url_imagen: string[] | null;
  estado: boolean;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitacionWithPriceDto {
  habitacion: HabitacionDto;
  precio_noche: number | null;
}

export function toHabitacionDto(h: Habitacion): HabitacionDto {
  return {
    id: h.id,
    nro_habitacion: h.nroHabitacion,
    tipo_habitacion: toTipoHabitacionDto(h.tipoHabitacion),
    piso: h.piso,
    tiene_ducha: h.tieneDucha,
    tiene_banio: h.tieneBanio,
    url_imagen: h.urlImagen,
    estado: h.estado,
    descripcion: h.descripcion,
    created_at: h.createdAt.toISOString(),
    updated_at: h.updatedAt.toISOString(),
  };
}
