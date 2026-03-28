import type { Huesped } from "../../domain/entities/huesped.entity";

export interface CreateHuespedDto {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE";
  nro_doc?: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion?: string;
}

export interface UpdateHuespedDto {
  tipo_doc?: "DNI" | "PASAPORTE" | "RUC" | "CE";
  nro_doc?: string;
  nombres?: string;
  apellidos?: string;
  email?: string;
  telefono?: string;
  nacionalidad?: string;
  observacion?: string;
}

export interface HuespedDto {
  id: string;
  tipo_doc: string | null;
  nro_doc: string | null;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  nacionalidad: string;
  observacion: string | null;
  created_at: string;
  updated_at: string;
}

export function toHuespedDto(h: Huesped): HuespedDto {
  return {
    id: h.id,
    tipo_doc: h.tipo_doc,
    nro_doc: h.nro_doc,
    nombres: h.nombres,
    apellidos: h.apellidos,
    email: h.email,
    telefono: h.telefono,
    nacionalidad: h.nacionalidad,
    observacion: h.observacion,
    created_at: h.created_at.toISOString(),
    updated_at: h.updated_at.toISOString(),
  };
}
