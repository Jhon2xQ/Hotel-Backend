import type { Reserva } from "../../domain/entities/reserva.entity";
import type { EstadoReserva } from "../../domain/entities/reserva.entity";
import { toHuespedDto } from "./huesped.dto";
import { toTarifaDto } from "./tarifa.dto";
import { toPagoDto } from "./pago.dto";
import { toHabitacionDto } from "./habitacion.dto";

export interface CreateReservaDto {
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  adultos: number;
  ninos: number;
}

export interface UpdateReservaDto {
  huespedId?: string;
  habitacionId?: string;
  tarifaId?: string;
  pagoId?: string | null;
  fechaEntrada?: Date;
  fechaSalida?: Date;
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
  huesped: ReturnType<typeof toHuespedDto>;
  habitacion: ReturnType<typeof toHabitacionDto>;
  tarifa: ReturnType<typeof toTarifaDto>;
  pago: ReturnType<typeof toPagoDto> | null;
  fecha_entrada: string;
  fecha_salida: string;
  adultos: number;
  ninos: number;
  nombre_huesped: string;
  nro_habitacion: string;
  nombre_tipo_hab: string;
  nombre_canal: string;
  precio_noche: number;
  cantidad_noches: number;
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
    huesped: toHuespedDto(r.huesped),
    habitacion: toHabitacionDto(r.habitacion),
    tarifa: toTarifaDto(r.tarifa),
    pago: r.pago ? toPagoDto(r.pago) : null,
    fecha_entrada: r.fechaEntrada.toISOString().slice(0, 10),
    fecha_salida: r.fechaSalida.toISOString().slice(0, 10),
    adultos: r.adultos,
    ninos: r.ninos,
    nombre_huesped: r.nombreHuesped,
    nro_habitacion: r.nroHabitacion,
    nombre_tipo_hab: r.nombreTipoHab,
    nombre_canal: r.nombreCanal,
    precio_noche: r.precioNoche,
    cantidad_noches: r.cantidadNoches,
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
