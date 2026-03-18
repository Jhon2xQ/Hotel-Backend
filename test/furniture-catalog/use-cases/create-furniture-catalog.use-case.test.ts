import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateFurnitureCatalogUseCase } from "../../../src/application/use-cases/furniture-catalog/create-furniture-catalog.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../../src/domain/entities/furniture-catalog.entity";

describe("CreateFurnitureCatalogUseCase", () => {
  let useCase: CreateFurnitureCatalogUseCase;
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
    useCase = new CreateFurnitureCatalogUseCase(mockRepository);
  });

  it("should create a furniture catalog successfully", async () => {
    const input = {
      codigo: "CAMA-KING-01",
      nombre: "Cama King Size",
      categoria: FurnitureCategory.Cama,
      descripcion: "Cama king size con colchón ortopédico",
    };

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
      "Cama king size con colchón ortopédico",
      new Date(),
      new Date(),
    );

    (mockRepository.findByCodigo as any).mockResolvedValue(null);
    (mockRepository.create as any).mockResolvedValue(mockFurniture);

    const result = await useCase.execute(input);

    expect(result.codigo).toBe("CAMA-KING-01");
    expect(result.nombre).toBe("Cama King Size");
    expect(mockRepository.findByCodigo).toHaveBeenCalledWith("CAMA-KING-01");
    expect(mockRepository.create).toHaveBeenCalledWith({
      codigo: input.codigo,
      nombre: input.nombre,
      categoria: input.categoria,
      imagenUrl: null,
      tipo: null,
      condicion: undefined,
      fechaAdq: null,
      ultimaRevision: null,
      descripcion: input.descripcion,
    });
  });

  it("should throw exception when codigo already exists", async () => {
    const input = {
      codigo: "CAMA-KING-01",
      nombre: "Cama King Size",
      categoria: FurnitureCategory.Cama,
    };

    const existingFurniture = new FurnitureCatalog(
      "existing-id",
      "CAMA-KING-01",
      "Cama Existente",
      FurnitureCategory.Cama,
      null,
      null,
      FurnitureCondition.Bueno,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    (mockRepository.findByCodigo as any).mockResolvedValue(existingFurniture);

    await expect(useCase.execute(input)).rejects.toThrow(FurnitureCatalogException);
  });
});
