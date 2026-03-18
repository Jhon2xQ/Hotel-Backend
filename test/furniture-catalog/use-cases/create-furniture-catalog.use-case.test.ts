import { describe, it, expect, beforeEach } from "vitest";
import { CreateFurnitureCatalogUseCase } from "../../../src/application/use-cases/furniture-catalog/create-furniture-catalog.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { FurnitureCategory, FurnitureCondition } from "../../../src/domain/entities/furniture-catalog.entity";

describe("CreateFurnitureCatalogUseCase", () => {
  let useCase: CreateFurnitureCatalogUseCase;
  let mockRepository: IFurnitureCatalogRepository;
  let mockHabitacionRepository: IHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockFurnitureCatalog(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockFurnitureCatalog(),
      delete: async () => {},
    };

    mockHabitacionRepository = {
      create: async () => createMockHabitacion(),
      findAll: async () => [],
      findById: async () => null,
      findByNumero: async () => null,
      update: async () => createMockHabitacion(),
      updateStatus: async () => createMockHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
    };

    useCase = new CreateFurnitureCatalogUseCase(mockRepository, mockHabitacionRepository);
  });

  it("should create a furniture catalog successfully", async () => {
    const mockFurniture = createMockFurnitureCatalog();
    mockRepository.create = async () => mockFurniture;
    mockRepository.findByCodigo = async () => null;

    const result = await useCase.execute({
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      categoria: FurnitureCategory.Cama,
      imagen_url: "https://example.com/cama.jpg",
      tipo: "King Size",
      condicion: FurnitureCondition.Bueno,
      fecha_adquisicion: "2025-01-15",
      ultima_revision: "2026-03-01",
      descripcion: "Cama king size con colchón ortopédico",
    });

    expect(result).toBeDefined();
    expect(result.codigo).toBe("CAMA-001");
    expect(result.nombre).toBe("Cama King Size");
    expect(result.habitacion_id).toBeNull();
  });

  it("should throw error if codigo already exists", async () => {
    const existingFurniture = createMockFurnitureCatalog({ codigo: "CAMA-001" });
    mockRepository.findByCodigo = async (codigo: string) => {
      if (codigo === "CAMA-001") return existingFurniture;
      return null;
    };

    await expect(
      useCase.execute({
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        categoria: FurnitureCategory.Cama,
      }),
    ).rejects.toThrow(FurnitureCatalogException);
  });

  it("should create furniture with habitacion_id", async () => {
    const mockHabitacion = createMockHabitacion({ id: "hab-123" });
    const mockFurniture = createMockFurnitureCatalog({ habitacionId: "hab-123" });
    mockRepository.create = async () => mockFurniture;
    mockRepository.findByCodigo = async () => null;
    mockHabitacionRepository.findById = async (id: string) => {
      if (id === "hab-123") return mockHabitacion;
      return null;
    };

    const result = await useCase.execute({
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      categoria: FurnitureCategory.Cama,
      habitacion_id: "hab-123",
    });

    expect(result.habitacion_id).toBe("hab-123");
  });

  it("should throw error if habitacion_id does not exist", async () => {
    mockRepository.findByCodigo = async () => null;
    mockHabitacionRepository.findById = async () => null;

    await expect(
      useCase.execute({
        codigo: "CAMA-001",
        nombre: "Cama King Size",
        categoria: FurnitureCategory.Cama,
        habitacion_id: "non-existent-hab",
      }),
    ).rejects.toThrow(FurnitureCatalogException);
  });
});
