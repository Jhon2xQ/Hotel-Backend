import { MuebleCondition, type Mueble } from "../../domain/entities/mueble.entity";
import type { CategoriaMuebleDto } from "./categoria-mueble.dto";
import { toCategoriaMuebleDto } from "./categoria-mueble.dto";

export interface CreateMuebleDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria_id: string;
  imagen?: File[];
  condicion?: MuebleCondition;
  fecha_adquisicion?: string;
  ultima_revision?: string;
  habitacion_id?: string;
}

export interface UpdateMuebleDto {
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  categoria_id?: string;
  imagen?: File[];
  condicion?: MuebleCondition;
  fecha_adquisicion?: string;
  ultima_revision?: string;
  habitacion_id?: string;
}

export interface MuebleDto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria: CategoriaMuebleDto;
  url_imagen: string | null;
  condicion: string;
  fecha_adquisicion: string | null;
  ultima_revision: string | null;
  habitacion_id: string | null;
  created_at: string;
  updated_at: string;
}

export function toMuebleDto(m: Mueble): MuebleDto {
  return {
    id: m.id,
    codigo: m.codigo,
    nombre: m.nombre,
    descripcion: m.descripcion,
    categoria: toCategoriaMuebleDto(m.categoria),
    url_imagen: m.urlImagen,
    condicion: m.condicion,
    fecha_adquisicion: m.fechaAdq?.toISOString().split("T")[0] ?? null,
    ultima_revision: m.ultimaRevision?.toISOString().split("T")[0] ?? null,
    habitacion_id: m.habitacionId,
    created_at: m.createdAt.toISOString(),
    updated_at: m.updatedAt.toISOString(),
  };
}

export interface PublicMuebleDto {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  url_imagen: string | null;
  condicion: string;
  created_at: string;
  updated_at: string;
}

export function toPublicMuebleDto(m: Mueble): PublicMuebleDto {
  return {
    id: m.id,
    codigo: m.codigo,
    nombre: m.nombre,
    descripcion: m.descripcion,
    url_imagen: m.urlImagen,
    condicion: m.condicion,
    created_at: m.createdAt.toISOString(),
    updated_at: m.updatedAt.toISOString(),
  };
}
