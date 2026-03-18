import { describe, it, expect, beforeEach } from "vitest";
import { DeleteFurnitureCatalogUseCase } from "../../../src/application/use-cases/furniture-catalog/delete-furniture-catalog.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";

describe("DeleteFurnitureCatalogUseCase", () => {
  let useCase: DeleteFurnitureCatalogUseCase;
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

    useCase = new DeleteFurnitureCatalogUseCase(mockRepository);
  });

  it("should delete furniture catalog successfully", async () => {
    const existingFurniture = createMockFurnitureCatalog({ id: "test-id" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingFurniture;
      return null;
    };

    let deleted = false;
    mockRepository.delete = async () => {
      deleted = true;
    };

    await useCase.execute("test-id");

    expect(deleted).toBe(true);
  });

  it("should throw error when furniture catalog not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(FurnitureCatalogException);
  });
});
