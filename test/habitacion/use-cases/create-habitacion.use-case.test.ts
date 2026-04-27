import { describe, it, expect, beforeEach } from "vitest";
import { CreateHabitacionUseCase } from "../../../src/application/use-cases/habitacion/create-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";

describe("CreateHabitacionUseCase", () => {
  let useCase: CreateHabitacionUseCase;
  let mockHabitacionRepo: IHabitacionRepository;
  let mockTipoRepo: ITipoHabitacionRepository;

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
      findAllWithDirectPrice: async () => [],
      findByTipoWithDirectPrice: async () => [],
      findAvailableInDateRange: async () => [],
      findByIdWithDirectPrice: async () => null,
      findByIdWithMuebles: async () => null,
      findByIdWithDirectPriceAndMuebles: async () => null,
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findByIdWithReservas: async () => null,
      findByIdWithReservasAndMuebles: async () => null,
    };

    mockTipoRepo = {
      create: async () => createMockTipoHabitacion(),
      findAll: async () => [],
      findById: async () => null,
      findByName: async () => null,
      update: async () => createMockTipoHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findAllWithSampleHabitacion: async () => [],
    };

    useCase = new CreateHabitacionUseCase(mockHabitacionRepo, mockTipoRepo);
  });

  it("should create habitacion successfully", async () => {
    const mockTipo = createMockTipoHabitacion();
    const mockHabitacion = createMockHabitacion({
      nroHabitacion: "101",
      piso: 1,
      feature: "WiFi",
      amenities: "TV",
    });

    mockTipoRepo.findById = async () => mockTipo;
    mockHabitacionRepo.findByNumero = async () => null;
    mockHabitacionRepo.create = async () => mockHabitacion;

    const result = await useCase.execute({
      nro_habitacion: "101",
      tipo_habitacion_id: "tipo-test-id",
      piso: 1,
      feature: "WiFi",
      amenities: "TV",
    });

    expect(result).toBeDefined();
    expect(result.nro_habitacion).toBe("101");
    expect(result.piso).toBe(1);
    expect(result.feature).toBe("WiFi");
    expect(result.amenities).toBe("TV");
  });

  it("should throw error if tipo habitacion not found", async () => {
    mockTipoRepo.findById = async () => null;

    await expect(
      useCase.execute({
        nro_habitacion: "101",
        tipo_habitacion_id: "non-existent-tipo",
        piso: 1,
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should throw error if numero already exists", async () => {
    const mockTipo = createMockTipoHabitacion();
    const existingHabitacion = createMockHabitacion({ nroHabitacion: "101" });

    mockTipoRepo.findById = async () => mockTipo;
    mockHabitacionRepo.findByNumero = async (numero: string) => {
      if (numero === "101") return existingHabitacion;
      return null;
    };

    await expect(
      useCase.execute({
        nro_habitacion: "101",
        tipo_habitacion_id: "tipo-test-id",
        piso: 1,
      }),
    ).rejects.toThrow(HabitacionException);
  });
});
