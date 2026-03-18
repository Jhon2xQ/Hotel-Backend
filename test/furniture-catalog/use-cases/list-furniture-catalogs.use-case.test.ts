import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListFurnitureCatalogsUseCase } from "../../../src/application/use-cases/furniture-catalog/list-furniture-catalogs.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../../src/domain/entities/furniture-catalog.entity";

describe("ListFurnitureCatalogsUseCase", () => {
  let useCase: ListFurnitureCatalogsUseCase;
  let mockRepository: IFurnitureCatalogRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findByCodigo: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new ListFurnitureCatalogsUseCase(mockRepository);
  });

  it("should list all furniture catalogs", async () => {
    const mockFurnitures = [
      new FurnitureCatalog(
        "id-1",
        "CAMA-KING-01",
        "Cama King Size",
        FurnitureCategory.Cama,
        null,
        null,
        FurnitureCondition.Bueno,
        null,
        null,
        "Descripción 1",
        new Date(),
        new Date(),
      ),
      new FurnitureCatalog(
        "id-2",
        "TV-55-01",
        "TV 55 pulgadas",
        FurnitureCategory.Tecnologia,
        null,
        null,
        FurnitureCondition.Bueno,
        null,
        null,
        "Descripción 2",
        new Date(),
        new Date(),
      ),
    ];

    (mockRepository.findAll as any).mockResolvedValue(mockFurnitures);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].codigo).toBe("CAMA-KING-01");
    expect(result[1].codigo).toBe("TV-55-01");
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no furniture catalogs exist", async () => {
    (mockRepository.findAll as any).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
