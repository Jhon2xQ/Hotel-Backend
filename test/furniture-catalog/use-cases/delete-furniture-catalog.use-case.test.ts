import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteFurnitureCatalogUseCase } from "../../../src/application/use-cases/furniture-catalog/delete-furniture-catalog.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import { FurnitureCatalog, FurnitureCategory } from "../../../src/domain/entities/furniture-catalog.entity";

describe("DeleteFurnitureCatalogUseCase", () => {
  let useCase: DeleteFurnitureCatalogUseCase;
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
    useCase = new DeleteFurnitureCatalogUseCase(mockRepository);
  });

  it("should delete furniture catalog successfully", async () => {
    const existingFurniture = new FurnitureCatalog(
      "test-id",
      "CAMA-KING-01",
      "Cama King Size",
      FurnitureCategory.Cama,
      null,
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(existingFurniture);
    (mockRepository.delete as any).mockResolvedValue(undefined);

    await useCase.execute("test-id");

    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.delete).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when furniture catalog not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(FurnitureCatalogException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
