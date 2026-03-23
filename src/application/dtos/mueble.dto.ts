import { MuebleCondition } from "../../domain/entities/mueble.entity";

export interface CreateMuebleInput {
  codigo: string;
  nombre: string;
  descripcion?: string;
  categoria_id: string;
  imagen_url?: string;
  condicion?: MuebleCondition;
  fecha_adquisicion?: string;
  ultima_revision?: string;
  habitacion_id: string;
}

export interface UpdateMuebleInput {
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

export interface MuebleOutput {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  categoria_id: string;
  categoria: {
    id: string;
    nombre: string;
    descripcion: string | null;
    activo: boolean;
  } | null;
  imagen_url: string | null;
  condicion: string;
  fecha_adquisicion: string | null;
  ultima_revision: string | null;
  habitacion_id: string | null;
  habitacion: {
    id: string;
    nro_habitacion: string;
    piso: number;
  } | null;
  created_at: string;
  updated_at: string;
}
