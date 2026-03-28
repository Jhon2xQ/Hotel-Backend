import type { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";

export interface CreateTipoHabitacionDto {
  nombre: string;
  descripcion?: string;
}

export interface UpdateTipoHabitacionDto {
  nombre?: string;
  descripcion?: string;
}

export interface TipoHabitacionDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}

export function toTipoHabitacionDto(t: TipoHabitacion): TipoHabitacionDto {
  return {
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
    created_at: t.createdAt.toISOString(),
    updated_at: t.updatedAt.toISOString(),
  };
}
