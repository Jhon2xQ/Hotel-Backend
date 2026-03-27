import { EstadoReserva } from "../../domain/entities/reserva.entity";

export interface CreateReservaInput {
  huespedId: string;
  habitacionId: string;
  tarifaId: string;
  fechaEntrada: Date;
  fechaSalida: Date;
  adultos: number;
  ninos: number;
  montoDescuento?: number;
}

export interface UpdateReservaInput {
  huespedId?: string;
  habitacionId?: string;
  tarifaId?: string;
  pagoId?: string | null;
  fechaEntrada?: Date;
  fechaSalida?: Date;
  adultos?: number;
  ninos?: number;
  montoDescuento?: number;
  estado?: EstadoReserva;
}

export interface CancelReservaInput {
  motivoCancel: string;
}

export interface UpdateEstadoReservaInput {
  estado: EstadoReserva;
}
