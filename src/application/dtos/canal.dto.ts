import type { Canal } from "../../domain/entities/canal.entity";

export interface CreateCanalDto {
  nombre: string;
  tipo: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string;
}

export interface UpdateCanalDto {
  nombre?: string;
  tipo?: "OTA" | "DIRECTO" | "AGENTE";
  activo?: boolean;
  notas?: string;
}

export interface CanalDto {
  id: string;
  nombre: string;
  tipo: "OTA" | "DIRECTO" | "AGENTE";
  activo: boolean;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export function toCanalDto(c: Canal): CanalDto {
  return {
    id: c.id,
    nombre: c.nombre,
    tipo: c.tipo,
    activo: c.activo,
    notas: c.notas,
    created_at: c.createdAt.toISOString(),
    updated_at: c.updatedAt.toISOString(),
  };
}
