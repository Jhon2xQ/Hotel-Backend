import type { Estancia, EstadoEstadia } from "../entities/estancia.entity";

export interface CreateEstanciaParams {
  reservaId: string;
  habitacionId: string;
  huespedId: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface UpdateEstanciaParams {
  reservaId?: string;
  habitacionId?: string;
  huespedId?: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface IEstanciaRepository {
  create(data: CreateEstanciaParams): Promise<Estancia>;
  findAll(): Promise<Estancia[]>;
  findById(id: string): Promise<Estancia | null>;
  findByReservaId(reservaId: string): Promise<Estancia[]>;
  update(id: string, data: UpdateEstanciaParams): Promise<Estancia>;
  delete(id: string): Promise<void>;
  checkout(id: string, fechaSalida: Date): Promise<Estancia>;
}
