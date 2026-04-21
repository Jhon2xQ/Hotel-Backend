import type { CategoriaMueble } from "../../domain/entities/categoria-mueble.entity";

export interface CreateCategoriaMuebleDto {
  nombre: string;
}

export interface UpdateCategoriaMuebleDto {
  nombre?: string;
}

export interface CategoriaMuebleDto {
  id: string;
  nombre: string;
  created_at: string;
  updated_at: string;
}

export function toCategoriaMuebleDto(c: CategoriaMueble): CategoriaMuebleDto {
  return {
    id: c.id,
    nombre: c.nombre,
    created_at: c.createdAt.toISOString(),
    updated_at: c.updatedAt.toISOString(),
  };
}
