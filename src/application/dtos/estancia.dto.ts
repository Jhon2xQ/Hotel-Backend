import type { Estancia } from "../../domain/entities/estancia.entity";
import type { EstadoEstadia } from "../../domain/entities/estancia.entity";
import type { HabitacionDto } from "./habitacion.dto";
import type { HuespedDto } from "./huesped.dto";
import { toHabitacionDto } from "./habitacion.dto";
import { toHuespedDto } from "./huesped.dto";

export interface CreateEstanciaDto {
  reservaId: string;
  habitacionId: string;
  huespedId: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface UpdateEstanciaDto {
  reservaId?: string;
  habitacionId?: string;
  huespedId?: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface CheckoutEstanciaDto {
  fechaSalida: Date;
}

export interface EstanciaDto {
  id: string;
  reserva_id: string;
  habitacion: HabitacionDto;
  huesped: HuespedDto;
  fecha_entrada: string;
  fecha_salida: string | null;
  estado: EstadoEstadia;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export function toEstanciaDto(e: Estancia): EstanciaDto {
  return {
    id: e.id,
    reserva_id: e.reservaId,
    habitacion: toHabitacionDto(e.habitacion),
    huesped: toHuespedDto(e.huesped),
    fecha_entrada: e.fechaEntrada.toISOString(),
    fecha_salida: e.fechaSalida?.toISOString() ?? null,
    estado: e.estado,
    notas: e.notas,
    created_at: e.createdAt.toISOString(),
    updated_at: e.updatedAt.toISOString(),
  };
}
