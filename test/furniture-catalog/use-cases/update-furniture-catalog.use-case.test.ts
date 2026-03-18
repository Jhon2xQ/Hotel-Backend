import { describe, it, expect, beforeEach } from "vitest";
import { UpdateFurnitureCatalogUseCase } from "../../../src/application/use-cases/furniture-catalog/update-furniture-catalog.use-case";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { FurnitureCatalogException } from "../../../src/domain/exceptions/furniture-catalog.exception";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { FurnitureCondition } from "../../../src/domain/entities/furniture-catalog.entity";

describe("UpdateFurnitureCatalogUseCase", () => {
  let useCase: UpdateFurnitureCatalogUseCase;
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

    useCase = new UpdateFurnitureCatalogUseCase(mockRepository, mockHabitacionRepository);
  });

  it("should update furniture catalog successfully", async () => {
    const existingFurniture = createMockFurnitureCatalog({ id: "test-id", codigo: "CAMA-001" });
    const updatedFurniture = createMockFurnitureCatalog({ id: "test-id", codigo: "CAMA-002", nombre: "Cama Queen" });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingFurniture;
      return null;
    };
    mockRepository.findByCodigo = async () => null;
    mockRepository.update = async () => updatedFurniture;

    const result = await useCase.execute("test-id", {
      codigo: "CAMA-002",
      nombre: "Cama Queen",
    });

    expect(result).toBeDefined();
    expect(result.codigo).toBe("CAMA-002");
    expect(result.nombre).toBe("Cama Queen");
  });

  it("should throw error when furniture catalog not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        nombre: "Updated Name",
      }),
    ).rejects.toThrow(FurnitureCatalogException);
  });

  it("should throw error when codigo already exists", async () => {
    const existingFurniture = createMockFurnitureCatalog({ id: "test-id", codigo: "CAMA-001" });
    const duplicateFurniture = createMockFurnitureCatalog({ id: "other-id", codigo: "CAMA-002" });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingFurniture;
      return null;
    };
    mockRepository.findByCodigo = async (codigo: string) => {
      if (codigo === "CAMA-002") return duplicateFurniture;
      return null;
    };

    await expect(
      useCase.execute("test-id", {
        codigo: "CAMA-002",
      }),
    ).rejects.toThrow(FurnitureCatalogException);
  });

  it("should update habitacion_id successfully", async () => {
    const mockHabitacion = createMockHabitacion({ id: "hab-123" });
    const existingFurniture = createMockFurnitureCatalog({ id: "test-id", habitacionId: null });
    const updatedFurniture = createMockFurnitureCatalog({ id: "test-id", habitacionId: "hab-123" });

    mockRepository.findById = async () => existingFurniture;
    mockRepository.findByCodigo = async () => null;
    mockRepository.update = async () => updatedFurniture;
    mockHabitacionRepository.findById = async (id: string) => {
      if (id === "hab-123") return mockHabitacion;
      return null;
    };

    const result = await useCase.execute("test-id", {
      habitacion_id: "hab-123",
    });

    expect(result.habitacion_id).toBe("hab-123");
  });

  it("should throw error if habitacion_id does not exist", async () => {
    const existingFurniture = createMockFurnitureCatalog({ id: "test-id" });

    mockRepository.findById = async () => existingFurniture;
    mockHabitacionRepository.findById = async () => null;

    await expect(
      useCase.execute("test-id", {
        habitacion_id: "non-existent-hab",
      }),
    ).rejects.toThrow(FurnitureCatalogException);
  });
});
