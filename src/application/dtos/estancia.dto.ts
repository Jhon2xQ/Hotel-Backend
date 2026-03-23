import { EstadoEstadia } from "../../domain/entities/estancia.entity";

export interface CreateEstanciaInput {
  reservaId: string;
  habitacionId: string;
  huespedId: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface UpdateEstanciaInput {
  reservaId?: string;
  habitacionId?: string;
  huespedId?: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface CheckoutEstanciaInput {
  fechaSalida: Date;
}
