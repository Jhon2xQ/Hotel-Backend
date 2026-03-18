import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
  CreateFurnitureCatalogData,
} from "../entities/furniture-catalog.entity";

export interface UpdateFurnitureCatalogData {
  codigo?: string;
  nombre?: string;
  categoria?: FurnitureCategory;
  imagenUrl?: string | null;
  tipo?: string | null;
  condicion?: FurnitureCondition;
  fechaAdq?: Date | null;
  ultimaRevision?: Date | null;
  descripcion?: string | null;
  habitacionId?: string | null;
}

export interface IFurnitureCatalogRepository {
  create(data: CreateFurnitureCatalogData): Promise<FurnitureCatalog>;
  findAll(): Promise<FurnitureCatalog[]>;
  findById(id: string): Promise<FurnitureCatalog | null>;
  findByCodigo(codigo: string): Promise<FurnitureCatalog | null>;
  update(id: string, data: UpdateFurnitureCatalogData): Promise<FurnitureCatalog>;
  delete(id: string): Promise<void>;
}
