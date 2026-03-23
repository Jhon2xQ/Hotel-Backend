import { Estancia, CreateEstanciaData, EstadoEstadia } from "../entities/estancia.entity";

export interface UpdateEstanciaData {
  reservaId?: string;
  habitacionId?: string;
  huespedId?: string;
  fechaEntrada?: Date;
  fechaSalida?: Date | null;
  estado?: EstadoEstadia;
  notas?: string | null;
}

export interface IEstanciaRepository {
  create(data: CreateEstanciaData): Promise<Estancia>;
  findAll(): Promise<Estancia[]>;
  findById(id: string): Promise<Estancia | null>;
  findByReservaId(reservaId: string): Promise<Estancia[]>;
  update(id: string, data: UpdateEstanciaData): Promise<Estancia>;
  delete(id: string): Promise<void>;
  checkout(id: string, fechaSalida: Date): Promise<Estancia>;
}
