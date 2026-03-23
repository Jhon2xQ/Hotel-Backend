import {
  MuebleCondition,
  CreateMuebleData,
  Mueble,
} from "../entities/mueble.entity";

export interface UpdateMuebleData {
  codigo?: string;
  nombre?: string;
  categoriaId?: string;
  imagenUrl?: string | null;
  tipo?: string | null;
  condicion?: MuebleCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  descripcion?: string | null;
  habitacionId?: string;
}

export interface IMuebleRepository {
  create(data: CreateMuebleData): Promise<Mueble>;
  findAll(): Promise<Mueble[]>;
  findById(id: string): Promise<Mueble | null>;
  findByCodigo(codigo: string): Promise<Mueble | null>;
  update(id: string, data: UpdateMuebleData): Promise<Mueble>;
  delete(id: string): Promise<void>;
}
