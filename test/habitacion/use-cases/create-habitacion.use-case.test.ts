import { describe, it, expect, beforeEach } from "vitest";
import { CreateHabitacionUseCase } from "../../../src/application/use-cases/habitacion/create-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";
import { createMockFurnitureCatalog } from "../../helpers/furniture-catalog-fixtures";
import { EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";

describe("CreateHabitacionUseCase", () => {
  let useCase: CreateHabitacionUseCase;
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
      findById: async () => null,
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

    useCase = new CreateHabitacionUseCase(mockHabitacionRepo, mockTipoRepo, mockFurnitureRepo);
  });

  it("should create habitacion successfully", async () => {
    const mockTipo = createMockTipoHabitacion();
    const mockHabitacion = createMockHabitacion({
      nroHabitacion: "101",
      piso: 1,
      tieneDucha: true,
      tieneBanio: true,
    });

    mockTipoRepo.findById = async () => mockTipo;
    mockHabitacionRepo.findByNumero = async () => null;
    mockHabitacionRepo.create = async () => mockHabitacion;

    const result = await useCase.execute({
      nro_habitacion: "101",
      tipo_id: "tipo-test-id",
      piso: 1,
      tiene_ducha: true,
      tiene_banio: true,
    });

    expect(result).toBeDefined();
    expect(result.nro_habitacion).toBe("101");
    expect(result.piso).toBe(1);
    expect(result.tiene_ducha).toBe(true);
    expect(result.tiene_banio).toBe(true);
  });

  it("should throw error if tipo habitacion not found", async () => {
    mockTipoRepo.findById = async () => null;

    await expect(
      useCase.execute({
        nro_habitacion: "101",
        tipo_id: "non-existent-tipo",
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
        tipo_id: "tipo-test-id",
        piso: 1,
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should create habitacion with muebles", async () => {
    const mockTipo = createMockTipoHabitacion();
    const mockMueble = createMockFurnitureCatalog({ id: "mueble-id" });
    const mockHabitacion = createMockHabitacion({
      muebles: [
        {
          id: "mueble-id",
          codigo: "CAMA-001",
          nombre: "Cama King",
          categoria: "CAMA",
        },
      ],
    });

    mockTipoRepo.findById = async () => mockTipo;
    mockHabitacionRepo.findByNumero = async () => null;
    mockFurnitureRepo.findById = async (id: string) => {
      if (id === "mueble-id") return mockMueble;
      return null;
    };
    mockHabitacionRepo.create = async () => mockHabitacion;

    const result = await useCase.execute({
      nro_habitacion: "101",
      tipo_id: "tipo-test-id",
      piso: 1,
      muebles: ["mueble-id"],
    });

    expect(result.muebles).toHaveLength(1);
    expect(result.muebles[0].id).toBe("mueble-id");
  });

  it("should throw error if mueble not found", async () => {
    const mockTipo = createMockTipoHabitacion();

    mockTipoRepo.findById = async () => mockTipo;
    mockHabitacionRepo.findByNumero = async () => null;
    mockFurnitureRepo.findById = async () => null;

    await expect(
      useCase.execute({
        nro_habitacion: "101",
        tipo_id: "tipo-test-id",
        piso: 1,
        muebles: ["non-existent-mueble"],
      }),
    ).rejects.toThrow(HabitacionException);
  });
});
