import { MuebleCondition, type Mueble } from "../../domain/entities/mueble.entity";

export interface CreateMuebleDto {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria_id: string;
  imagen_url?: string;
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
  imagen_url?: string;
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
  categoria_id: string;
  imagen_url: string | null;
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
    categoria_id: m.categoriaId,
    imagen_url: m.imagenUrl,
    condicion: m.condicion,
    fecha_adquisicion: m.fechaAdq?.toISOString().split("T")[0] ?? null,
    ultima_revision: m.ultimaRevision?.toISOString().split("T")[0] ?? null,
    habitacion_id: m.habitacionId,
    created_at: m.createdAt.toISOString(),
    updated_at: m.updatedAt.toISOString(),
  };
}
