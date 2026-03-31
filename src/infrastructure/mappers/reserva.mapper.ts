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
  precioNoche: unknown;
  cantidadNoches: number;
  IVA: unknown;
  cargoServicios: unknown;
  montoTotal: unknown;
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
    Number(data.precioNoche),
    data.cantidadNoches,
    Number(data.IVA),
    Number(data.cargoServicios),
    Number(data.montoTotal),
    data.estado as EstadoReserva,
    data.motivoCancel,
    data.canceladoEn,
    data.createdAt,
    data.updatedAt,
  );
}
