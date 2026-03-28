import type { Huesped } from "./huesped.entity";
import type { Habitacion } from "./habitacion.entity";
import type { Tarifa } from "./tarifa.entity";
import type { Pago } from "./pago.entity";

export enum EstadoReserva {
  TENTATIVA = "TENTATIVA",
  CONFIRMADA = "CONFIRMADA",
  EN_CASA = "EN_CASA",
  COMPLETADA = "COMPLETADA",
  CANCELADA = "CANCELADA",
  NO_LLEGO = "NO_LLEGO",
}

export class Reserva {
  constructor(
    public readonly id: string,
    public readonly codigo: string,
    public readonly huesped: Huesped,
    public readonly habitacion: Habitacion,
    public readonly tarifa: Tarifa,
    public readonly pago: Pago | null,
    public readonly fechaEntrada: Date,
    public readonly fechaSalida: Date,
    public readonly adultos: number,
    public readonly ninos: number,
    public readonly nombreHuesped: string,
    public readonly nroHabitacion: string,
    public readonly nombreTipoHab: string,
    public readonly nombreCanal: string,
    public readonly precioNoche: number,
    public readonly IVA: number,
    public readonly cargoServicios: number,
    public readonly montoTotal: number,
    public readonly montoDescuento: number,
    public readonly montoFinal: number | null,
    public readonly estado: EstadoReserva,
    public readonly motivoCancel: string | null,
    public readonly canceladoEn: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  isCompletada(): boolean {
    return this.estado === EstadoReserva.COMPLETADA;
  }

  canBeModified(): boolean {
    return this.estado !== EstadoReserva.COMPLETADA;
  }
}
