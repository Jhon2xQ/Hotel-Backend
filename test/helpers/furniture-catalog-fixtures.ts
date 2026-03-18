import { FurnitureCategory } from "../../src/domain/entities/furniture-catalog.entity";

export const mockFurnitureCatalog = {
  id: "test-furniture-id-123",
  codigo: "CAMA-KING-01",
  nombre: "Cama King Size",
  categoria: FurnitureCategory.Cama,
  descripcion: "Cama king size con colchón ortopédico",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};

export const mockFurnitureCatalogDb = {
  id: "test-furniture-id-123",
  codigo: "CAMA-KING-01",
  nombre: "Cama King Size",
  categoria: "CAMA",
  descripcion: "Cama king size con colchón ortopédico",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-01"),
};
