import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindFurnitureCatalogByIdUseCase } from "../../../src/application/use-cases/furniture-catalog/find-furniture-catalog-by-id.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../../src/domain/entities/furniture-catalog.entity";

describe("FindFurnitureCatalogByIdUseCase", () => {
  let useCase: FindFurnitureCatalogByIdUseCase;
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
    useCase = new FindFurnitureCatalogByIdUseCase(mockRepository);
  });

  it("should find furniture catalog by id", async () => {
    const mockFurniture = new FurnitureCatalog(
      "test-id",
      "CAMA-KING-01",
      "Cama King Size",
      FurnitureCategory.Cama,
      null,
      null,
      FurnitureCondition.Bueno,
      null,
      null,
      "Descripción",
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(mockFurniture);

    const result = await useCase.execute("test-id");

    expect(result.id).toBe("test-id");
    expect(result.codigo).toBe("CAMA-KING-01");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when furniture catalog not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(FurnitureCatalogException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
