import { describe, it, expect, beforeEach } from "vitest";
import { ListFurnitureCatalogsUseCase } from "../../../src/application/use-cases/furniture-catalog/list-furniture-catalogs.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";
import { FurnitureCategory } from "../../../src/domain/entities/furniture-catalog.entity";

describe("ListFurnitureCatalogsUseCase", () => {
  let useCase: ListFurnitureCatalogsUseCase;
  let mockRepository: IFurnitureCatalogRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockFurnitureCatalog(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockFurnitureCatalog(),
      delete: async () => {},
    };

    useCase = new ListFurnitureCatalogsUseCase(mockRepository);
  });

  it("should return list of furniture catalogs", async () => {
    const mockFurnitures = [
      createMockFurnitureCatalog({
        id: "id-1",
        codigo: "CAMA-001",
        nombre: "Cama King",
        categoria: FurnitureCategory.Cama,
      }),
      createMockFurnitureCatalog({
        id: "id-2",
        codigo: "TV-001",
        nombre: "TV 55",
        categoria: FurnitureCategory.Tecnologia,
      }),
    ];

    mockRepository.findAll = async () => mockFurnitures;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].codigo).toBe("CAMA-001");
    expect(result[1].codigo).toBe("TV-001");
  });

  it("should return empty array when no furniture catalogs exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
