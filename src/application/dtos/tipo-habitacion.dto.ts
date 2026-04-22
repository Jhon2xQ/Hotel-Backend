import type { TipoHabitacion } from "../../domain/entities/tipo-habitacion.entity";
import type { HabitacionDto } from "./habitacion.dto";
import type { PublicHabitacionDto } from "./habitacion.dto";

export interface CreateTipoHabitacionDto {
  nombre: string;
}

export interface UpdateTipoHabitacionDto {
  nombre?: string;
}

export interface TipoHabitacionDto {
  id: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export interface TipoHabitacionWithHabitacionDto {
  id: string;
  nombre: string;
  created_at: string;
  updated_at: string;
  habitacion: HabitacionDto | null;
}

export interface PublicTipoHabitacionDto {
  id: string;
  nombre: string;
}

export interface PublicTipoHabitacionWithHabitacionDto {
  id: string;
  nombre: string;
  habitacion: PublicHabitacionDto | null;
}

export function toTipoHabitacionDto(t: TipoHabitacion): TipoHabitacionDto {
  return {
    id: t.id,
    nombre: t.nombre,
    created_at: t.createdAt.toISOString(),
    updated_at: t.updatedAt.toISOString(),
  };
}

export function toPublicTipoHabitacionDto(t: TipoHabitacion): PublicTipoHabitacionDto {
  return {
    id: t.id,
    nombre: t.nombre,
  };
}
