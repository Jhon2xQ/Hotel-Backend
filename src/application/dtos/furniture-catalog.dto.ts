import { FurnitureCategory } from "../../domain/entities/furniture-catalog.entity";

export interface CreateFurnitureCatalogInput {
  codigo: string;
  nombre: string;
  categoria: FurnitureCategory;
  descripcion?: string;
}

export interface UpdateFurnitureCatalogInput {
  codigo?: string;
  nombre?: string;
  categoria?: FurnitureCategory;
  descripcion?: string;
}

export interface FurnitureCatalogOutput {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  descripcion: string | null;
  created_at: string;
  updated_at: string;
}
