import { FurnitureCatalog, FurnitureCategory, CreateFurnitureCatalogData } from "../entities/furniture-catalog.entity";

export interface UpdateFurnitureCatalogData {
  codigo?: string;
  nombre?: string;
  categoria?: FurnitureCategory;
  descripcion?: string | null;
}

export interface IFurnitureCatalogRepository {
  create(data: CreateFurnitureCatalogData): Promise<FurnitureCatalog>;
  findAll(): Promise<FurnitureCatalog[]>;
  findById(id: string): Promise<FurnitureCatalog | null>;
  findByCodigo(codigo: string): Promise<FurnitureCatalog | null>;
  update(id: string, data: UpdateFurnitureCatalogData): Promise<FurnitureCatalog>;
  delete(id: string): Promise<void>;
}
