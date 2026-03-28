import type { EstadoHabitacion } from "../../domain/entities/habitacion.entity";
import { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";

export interface CreateHabitacionInput {
  nro_habitacion: string;
  tipo_habitacion_id: string;
  piso: number;
  tiene_ducha?: boolean;
  tiene_banio?: boolean;
  imagenes?: File[];
  estado?: EstadoHabitacion;
  notas?: string;
  ulti_limpieza?: string;
}

export interface UpdateHabitacionInput {
  nro_habitacion?: string;
  tipo_habitacion_id?: string;
  piso?: number;
  tiene_ducha?: boolean;
  tiene_banio?: boolean;
  imagenes?: File[];
  estado?: EstadoHabitacion;
  notas?: string;
  ulti_limpieza?: string;
}

export interface UpdateHabitacionStatusInput {
  estado?: EstadoHabitacion;
  ulti_limpieza?: string;
}

export interface SearchAvailableHabitacionesInput {
  tipo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  orden_precio?: "asc" | "desc";
}

export interface HabitacionOutput {
  id: string;
  nro_habitacion: string;
  tipo_habitacion_id: string;
  tipo: {
    id: string;
    nombre: string;
    descripcion: string | null;
  } | null;
  piso: number;
  tiene_ducha: boolean;
  tiene_banio: boolean;
  url_imagen: string[] | null;
  estado: string;
  notas: string | null;
  ulti_limpieza: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitacionWithPriceOutput {
  habitacion: HabitacionOutput;
  precio_noche: number | null;
}
