import { describe, it, expect, beforeEach } from "vitest";
import { FindFurnitureCatalogByIdUseCase } from "../../../src/application/use-cases/furniture-catalog/find-furniture-catalog-by-id.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";

describe("FindFurnitureCatalogByIdUseCase", () => {
  let useCase: FindFurnitureCatalogByIdUseCase;
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

    useCase = new FindFurnitureCatalogByIdUseCase(mockRepository);
  });

  it("should return furniture catalog when found", async () => {
    const mockFurniture = createMockFurnitureCatalog({ id: "test-id", codigo: "CAMA-001" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return mockFurniture;
      return null;
    };

    const result = await useCase.execute("test-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-id");
    expect(result.codigo).toBe("CAMA-001");
  });

  it("should throw error when furniture catalog not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(FurnitureCatalogException);
  });
});
