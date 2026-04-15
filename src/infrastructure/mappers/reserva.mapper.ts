import { Reserva, EstadoReserva } from "../../domain/entities/reserva.entity";

export type ReservaPrismaRow = {
  id: string;
  codigo: string;
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  pagoId: string | null;
  fechaInicio: Date;
  fechaFin: Date;
  adultos: number;
  ninos: number;
  nombreHuesped: string;
  nroHabitacion: string;
  nombreTipoHab: string;
  nombreCanal: string;
  precioTarifa: unknown;
  unidadTarifa: string;
  cantidadUnidad: number;
  IVA: unknown;
  cargoServicios: unknown;
  montoTotal: unknown;
  montoDescuento: unknown;
  promociones: string[];
  estado: string;
  motivoCancel: string | null;
  canceladoEn: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export function mapReservaFromPrisma(data: ReservaPrismaRow): Reserva {
  return new Reserva(
    data.id,
    data.codigo,
    data.huespedId,
    data.habitacionId,
    data.tarifaId,
    data.pagoId,
    data.fechaInicio,
    data.fechaFin,
    data.adultos,
    data.ninos,
    data.nombreHuesped,
    data.nroHabitacion,
    data.nombreTipoHab,
    data.nombreCanal,
    Number(data.precioTarifa),
    data.unidadTarifa,
    data.cantidadUnidad,
    Number(data.IVA),
    Number(data.cargoServicios),
    Number(data.montoTotal),
    Number(data.montoDescuento) || 0,
    data.promociones || [],
    data.estado as EstadoReserva,
    data.motivoCancel,
    data.canceladoEn,
    data.createdAt,
    data.updatedAt,
  );
}
