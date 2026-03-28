import type { CategoriaMueble } from "../../domain/entities/categoria-mueble.entity";

export interface CreateCategoriaMuebleDto {
  nombre: string;
  descripcion?: string;
  activo?: boolean;
}

export interface UpdateCategoriaMuebleDto {
  nombre?: string;
  descripcion?: string;
  activo?: boolean;
}

export interface CategoriaMuebleDto {
  id: string;
  nombre: string;
  descripcion: string | null;
  activo: boolean;
  created_at: string;
  updated_at: string;
}

export function toCategoriaMuebleDto(c: CategoriaMueble): CategoriaMuebleDto {
  return {
    id: c.id,
    nombre: c.nombre,
    descripcion: c.descripcion,
    activo: c.activo,
    created_at: c.createdAt.toISOString(),
    updated_at: c.updatedAt.toISOString(),
  };
}
