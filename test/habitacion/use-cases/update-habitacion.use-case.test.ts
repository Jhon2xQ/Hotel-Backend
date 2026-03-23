import { describe, it, expect, beforeEach } from "vitest";
import { UpdateHabitacionUseCase } from "../../../src/application/use-cases/habitacion/update-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";

describe("UpdateHabitacionUseCase", () => {
  let useCase: UpdateHabitacionUseCase;
  let mockHabitacionRepo: IHabitacionRepository;
  let mockTipoRepo: ITipoHabitacionRepository;
  let mockFurnitureRepo: IFurnitureCatalogRepository;

  beforeEach(() => {
    mockHabitacionRepo = {
      create: async () => createMockHabitacion(),
      findAll: async () => [],
      findById: async () => null,
      findByNumero: async () => null,
      update: async () => createMockHabitacion(),
      updateStatus: async () => createMockHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
    };

    mockTipoRepo = {
      create: async () => createMockTipoHabitacion(),
      findAll: async () => [],
      findById: async () => createMockTipoHabitacion(),
      findByName: async () => null,
      update: async () => createMockTipoHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
    };

    mockFurnitureRepo = {
      create: async () => createMockFurnitureCatalog(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockFurnitureCatalog(),
      delete: async () => {},
    };

    useCase = new UpdateHabitacionUseCase(mockHabitacionRepo, mockTipoRepo, mockFurnitureRepo);
  });

  it("should update habitacion successfully", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id", nroHabitacion: "101" });
    const updatedHabitacion = createMockHabitacion({ id: "test-id", nroHabitacion: "101-A" });

    mockHabitacionRepo.findById = async (id: string) => {
      if (id === "test-id") return existingHabitacion;
      return null;
    };
    mockHabitacionRepo.findByNumero = async () => null;
    mockHabitacionRepo.update = async () => updatedHabitacion;

    const result = await useCase.execute("test-id", {
      nro_habitacion: "101-A",
    });

    expect(result).toBeDefined();
    expect(result.nro_habitacion).toBe("101-A");
  });

  it("should throw error when habitacion not found", async () => {
    mockHabitacionRepo.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        nro_habitacion: "101",
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should throw error when numero already exists", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id", nroHabitacion: "101" });
    const duplicateHabitacion = createMockHabitacion({ id: "other-id", nroHabitacion: "102" });

    mockHabitacionRepo.findById = async (id: string) => {
      if (id === "test-id") return existingHabitacion;
      return null;
    };
    mockHabitacionRepo.findByNumero = async (numero: string) => {
      if (numero === "102") return duplicateHabitacion;
      return null;
    };

    await expect(
      useCase.execute("test-id", {
        nro_habitacion: "102",
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should throw error when tipo not found", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id" });

    mockHabitacionRepo.findById = async () => existingHabitacion;
    mockTipoRepo.findById = async () => null;

    await expect(
      useCase.execute("test-id", {
        tipo_habitacion_id: "non-existent-tipo",
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should update tiene_ducha and tiene_banio", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id", tieneDucha: false, tieneBanio: false });
    const updatedHabitacion = createMockHabitacion({ id: "test-id", tieneDucha: true, tieneBanio: true });

    mockHabitacionRepo.findById = async () => existingHabitacion;
    mockHabitacionRepo.findByNumero = async () => null;
    mockHabitacionRepo.update = async () => updatedHabitacion;

    const result = await useCase.execute("test-id", {
      tiene_ducha: true,
      tiene_banio: true,
    });

    expect(result.tiene_ducha).toBe(true);
    expect(result.tiene_banio).toBe(true);
  });
});
