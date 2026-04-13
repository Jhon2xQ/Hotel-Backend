import type { Reserva } from "../../domain/entities/reserva.entity";
import type { EstadoReserva } from "../../domain/entities/reserva.entity";

export interface CreateReservaDto {
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  fechaInicio: Date;
  fechaFin: Date;
  adultos: number;
  ninos: number;
}

export interface UpdateReservaDto {
  huespedId?: string;
  habitacionId?: string;
  tarifaId?: string;
  pagoId?: string | null;
  fechaInicio?: Date;
  fechaFin?: Date;
  adultos?: number;
  ninos?: number;
  estado?: EstadoReserva;
}

export interface CancelReservaDto {
  motivoCancel: string;
}

export interface UpdateEstadoReservaDto {
  estado: EstadoReserva;
}

export interface ReservaDto {
  id: string;
  codigo: string;
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  pagoId: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  adultos: number;
  ninos: number;
  nombre_huesped: string;
  nro_habitacion: string;
  nombre_tipo_hab: string;
  nombre_canal: string;
  precio_tarifa: number;
  unidad_tarifa: string;
  cantidad_unidad: number;
  iva: number;
  cargo_servicios: number;
  monto_total: number;
  estado: EstadoReserva;
  motivo_cancel: string | null;
  cancelado_en: string | null;
  created_at: string;
  updated_at: string;
}

export function toReservaDto(r: Reserva): ReservaDto {
  return {
    id: r.id,
    codigo: r.codigo,
    huespedId: r.huespedId,
    habitacionId: r.habitacionId,
    tarifaId: r.tarifaId,
    pagoId: r.pagoId,
    fecha_inicio: r.fechaInicio.toISOString(),
    fecha_fin: r.fechaFin.toISOString(),
    adultos: r.adultos,
    ninos: r.ninos,
    nombre_huesped: r.nombreHuesped,
    nro_habitacion: r.nroHabitacion,
    nombre_tipo_hab: r.nombreTipoHab,
    nombre_canal: r.nombreCanal,
    precio_tarifa: r.precioTarifa,
    unidad_tarifa: r.unidadTarifa,
    cantidad_unidad: r.cantidadUnidad,
    iva: r.IVA,
    cargo_servicios: r.cargoServicios,
    monto_total: r.montoTotal,
    estado: r.estado,
    motivo_cancel: r.motivoCancel,
    cancelado_en: r.canceladoEn?.toISOString() ?? null,
    created_at: r.createdAt.toISOString(),
    updated_at: r.updatedAt.toISOString(),
  };
}
