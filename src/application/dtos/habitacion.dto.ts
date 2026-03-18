import type { EstadoHabitacion, EstadoLimpieza } from "../../domain/entities/habitacion.entity";

export interface CreateHabitacionInput {
  nro_habitacion: string;
  tipo_id: string;
  piso: number;
  url_imagen?: string;
  estado?: EstadoHabitacion;
  limpieza?: EstadoLimpieza;
  notas?: string;
  muebles?: string[];
}

export interface UpdateHabitacionInput {
  nro_habitacion?: string;
  tipo_id?: string;
  piso?: number;
  url_imagen?: string;
  estado?: EstadoHabitacion;
  limpieza?: EstadoLimpieza;
  notas?: string;
  muebles?: string[];
}

export interface UpdateHabitacionStatusInput {
  estado?: EstadoHabitacion;
  limpieza?: EstadoLimpieza;
}

export interface HabitacionOutput {
  id: string;
  nro_habitacion: string;
  tipo_id: string;
  tipo: {
    id: string;
    nombre: string;
    descripcion: string | null;
  } | null;
  piso: number;
  url_imagen: string | null;
  estado: string;
  limpieza: string;
  notas: string | null;
  ultima_limpieza: string | null;
  muebles: {
    id: string;
    codigo: string;
    nombre: string;
    categoria: string;
  }[];
  created_at: string;
  updated_at: string;
}
