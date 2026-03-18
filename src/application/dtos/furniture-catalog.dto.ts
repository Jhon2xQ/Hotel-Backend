import { FurnitureCategory, FurnitureCondition } from "../../domain/entities/furniture-catalog.entity";

export interface CreateFurnitureCatalogInput {
  codigo: string;
  nombre: string;
  categoria: FurnitureCategory;
  imagen_url?: string;
  tipo?: string;
  condicion?: FurnitureCondition;
  fecha_adquisicion?: string;
  ultima_revision?: string;
  descripcion?: string;
  habitacion_id?: string;
}

export interface UpdateFurnitureCatalogInput {
  codigo?: string;
  nombre?: string;
  categoria?: FurnitureCategory;
  imagen_url?: string;
  tipo?: string;
  condicion?: FurnitureCondition;
  fecha_adquisicion?: string;
  ultima_revision?: string;
  descripcion?: string;
  habitacion_id?: string;
}

export interface FurnitureCatalogOutput {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  imagen_url: string | null;
  tipo: string | null;
  condicion: string;
  fecha_adquisicion: string | null;
  ultima_revision: string | null;
  descripcion: string | null;
  habitacion_id: string | null;
  created_at: string;
  updated_at: string;
}
