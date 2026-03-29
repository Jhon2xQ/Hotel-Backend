import { Mueble, MuebleCondition } from "../entities/mueble.entity";

export interface CreateMuebleParams {
  codigo: string;
  nombre: string;
  descripcion?: string | null;
  categoriaId: string;
  urlImagen?: string | null;
  condicion?: MuebleCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  habitacionId?: string | null;
}

export interface UpdateMuebleParams {
  codigo?: string;
  nombre?: string;
  categoriaId?: string;
  urlImagen?: string | null;
  condicion?: MuebleCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  descripcion?: string | null;
  habitacionId?: string | null;
}

export interface IMuebleRepository {
  create(data: CreateMuebleParams): Promise<Mueble>;
  findAll(): Promise<Mueble[]>;
  findById(id: string): Promise<Mueble | null>;
  findByCodigo(codigo: string): Promise<Mueble | null>;
  update(id: string, data: UpdateMuebleParams): Promise<Mueble>;
  delete(id: string): Promise<void>;
}
