import { Reserva, EstadoReserva } from "../../domain/entities/reserva.entity";
import { mapHabitacionFromPrisma, type HabitacionPrismaRow } from "./habitacion.mapper";
import { mapHuespedFromPrisma, type HuespedPrismaRow } from "./huesped.mapper";
import { mapTarifaFromPrisma, type TarifaPrismaRow } from "./tarifa.mapper";
import { mapPagoFromPrisma, type PagoPrismaRow } from "./pago.mapper";

export type ReservaPrismaRow = {
  id: string;
  codigo: string;
  fechaEntrada: Date;
  fechaSalida: Date;
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
  huesped: HuespedPrismaRow;
  habitacion: HabitacionPrismaRow;
  tarifa: TarifaPrismaRow;
  pago: (PagoPrismaRow & { recibidoPor?: PagoPrismaRow["recibidoPor"] }) | null;
};

export function mapReservaFromPrisma(data: ReservaPrismaRow): Reserva {
  const pago = data.pago ? mapPagoFromPrisma(data.pago) : null;

  return new Reserva(
    data.id,
    data.codigo,
    mapHuespedFromPrisma(data.huesped),
    mapHabitacionFromPrisma(data.habitacion),
    mapTarifaFromPrisma(data.tarifa),
    pago,
    data.fechaEntrada,
    data.fechaSalida,
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
