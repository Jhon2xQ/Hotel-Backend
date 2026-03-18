import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateFurnitureCatalogUseCase } from "../../../src/application/use-cases/furniture-catalog/update-furniture-catalog.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import { FurnitureCatalog, FurnitureCategory } from "../../../src/domain/entities/furniture-catalog.entity";

describe("UpdateFurnitureCatalogUseCase", () => {
  let useCase: UpdateFurnitureCatalogUseCase;
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
    useCase = new UpdateFurnitureCatalogUseCase(mockRepository);
  });

  it("should update furniture catalog successfully", async () => {
    const existingFurniture = new FurnitureCatalog(
      "test-id",
      "CAMA-KING-01",
      "Cama King Size",
      FurnitureCategory.Cama,
      "Descripción original",
      new Date(),
      new Date(),
    );

    const updatedFurniture = new FurnitureCatalog(
      "test-id",
      "CAMA-KING-01",
      "Cama King Size Premium",
      FurnitureCategory.Cama,
      "Descripción actualizada",
      new Date(),
      new Date(),
    );

    const input = {
      nombre: "Cama King Size Premium",
      descripcion: "Descripción actualizada",
    };

    (mockRepository.findById as any).mockResolvedValue(existingFurniture);
    (mockRepository.update as any).mockResolvedValue(updatedFurniture);

    const result = await useCase.execute("test-id", input);

    expect(result.nombre).toBe("Cama King Size Premium");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.update).toHaveBeenCalledWith("test-id", input);
  });

  it("should throw exception when furniture catalog not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id", { nombre: "Test" })).rejects.toThrow(FurnitureCatalogException);
  });

  it("should throw exception when updating to duplicate codigo", async () => {
    const existingFurniture = new FurnitureCatalog(
      "test-id",
      "CAMA-KING-01",
      "Cama King Size",
      FurnitureCategory.Cama,
      null,
      new Date(),
      new Date(),
    );

    const duplicateFurniture = new FurnitureCatalog(
      "other-id",
      "CAMA-QUEEN-01",
      "Cama Queen",
      FurnitureCategory.Cama,
      null,
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(existingFurniture);
    (mockRepository.findByCodigo as any).mockResolvedValue(duplicateFurniture);

    await expect(useCase.execute("test-id", { codigo: "CAMA-QUEEN-01" })).rejects.toThrow(FurnitureCatalogException);
  });
});
