import { Reserva, CreateReservaData, EstadoReserva } from "../entities/reserva.entity";

export interface UpdateReservaData {
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
  motivoCancel?: string | null;
  canceladoEn?: Date | null;
}

export interface IReservaRepository {
  create(data: CreateReservaData): Promise<Reserva>;
  findAll(): Promise<Reserva[]>;
  findById(id: string): Promise<Reserva | null>;
  findByCodigo(codigo: string): Promise<Reserva | null>;
  update(id: string, data: UpdateReservaData): Promise<Reserva>;
  delete(id: string): Promise<void>;
  cancel(id: string, motivoCancel: string): Promise<Reserva>;
}
