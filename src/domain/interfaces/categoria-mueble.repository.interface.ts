import { CategoriaMueble, CreateCategoriaMuebleData } from "../entities/categoria-mueble.entity";

export interface UpdateCategoriaMuebleData {
    nombre?: string;
    descripcion?: string | null;
    activo?: boolean;
}

export interface UpdateCategoriaMuebleStatusData {
    activo?: boolean;
}

export interface ICategoriaMuebleRepository {
    create(data: CreateCategoriaMuebleData): Promise<CategoriaMueble>;
    findAll(): Promise<CategoriaMueble[]>;
    findById(id: string): Promise<CategoriaMueble | null>;
    update(id: string, data: UpdateCategoriaMuebleData): Promise<CategoriaMueble>;
    delete(id: string): Promise<void>;
}