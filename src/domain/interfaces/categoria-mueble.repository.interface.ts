import { CategoriaMueble } from "../entities/categoria-mueble.entity";

export interface CreateCategoriaMuebleParams {
  nombre: string;
}

export interface UpdateCategoriaMuebleParams {
  nombre?: string;
}

export interface ICategoriaMuebleRepository {
  create(data: CreateCategoriaMuebleParams): Promise<CategoriaMueble>;
  findAll(): Promise<CategoriaMueble[]>;
  findById(id: string): Promise<CategoriaMueble | null>;
  update(id: string, data: UpdateCategoriaMuebleParams): Promise<CategoriaMueble>;
  delete(id: string): Promise<void>;
  findByName(nombre: string): Promise<CategoriaMueble | null>;
}
