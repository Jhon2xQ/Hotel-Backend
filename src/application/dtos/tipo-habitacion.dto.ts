import type { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";
import type { HabitacionDto } from "./habitacion.dto";
import type { PublicHabitacionDto } from "./habitacion.dto";

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

export interface TipoHabitacionWithHabitacionDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
  habitacion: HabitacionDto | null;
}

export interface PublicTipoHabitacionDto {
  id: string;
  nombre: string;
  descripcion: string | null;
}

export interface PublicTipoHabitacionWithHabitacionDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  habitacion: PublicHabitacionDto | null;
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

export function toPublicTipoHabitacionDto(t: TipoHabitacion): PublicTipoHabitacionDto {
  return {
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
  };
}
