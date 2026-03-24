import { describe, it, expect, beforeEach } from "vitest";
import { CreateMuebleUseCase } from "../../../src/application/use-cases/mueble/create-mueble.use-case";
import { IMuebleRepository } from "../../../src/domain/interfaces/mueble.repository.interface";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { MuebleException } from "../../../src/domain/exceptions/mueble.exception";
import { createMockMueble } from "../../helpers/mueble-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { CategoriaMuebleRepository } from "../../../src/infrastructure/repositories/categoria-mueble.repository";
import { CategoriaMuebleException } from "../../../src/domain/exceptions/categoria-mueble.exception";

describe("CreateMuebleUseCase", () => {
  let useCase: CreateMuebleUseCase;
  let mockMuebleRepo: IMuebleRepository;
  let mockHabitacionRepo: IHabitacionRepository;
  let mockCategoriaRepo: any;

  beforeEach(() => {
    mockMuebleRepo = {
      create: async () => createMockMueble(),
      findAll: async () => [],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockMueble(),
      delete: async () => {},
    };

    mockHabitacionRepo = {
      create: async () => createMockHabitacion(),
      findAll: async () => [],
      findById: async () => createMockHabitacion(),
      findByNumero: async () => null,
      update: async () => createMockHabitacion(),
      updateStatus: async () => createMockHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
    };

    mockCategoriaRepo = {
      findById: async () => ({
        id: "categoria-id",
        nombre: "Cama",
        descripcion: null,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    useCase = new CreateMuebleUseCase(mockMuebleRepo, mockHabitacionRepo, mockCategoriaRepo);
  });

  it("should create mueble successfully", async () => {
    const input = {
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      categoria_id: "categoria-id",
      habitacion_id: "habitacion-id",
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.codigo).toBe("CAMA-001");
  });

  it("should throw error when codigo already exists", async () => {
    mockMuebleRepo.findByCodigo = async () => createMockMueble();

    const input = {
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      categoria_id: "categoria-id",
      habitacion_id: "habitacion-id",
    };

    await expect(useCase.execute(input)).rejects.toThrow(MuebleException);
  });

  it("should throw error when categoria not found", async () => {
    mockCategoriaRepo.findById = async () => null;

    const input = {
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      categoria_id: "non-existent-categoria",
      habitacion_id: "habitacion-id",
    };

    await expect(useCase.execute(input)).rejects.toThrow(CategoriaMuebleException);
  });

  it("should throw error when habitacion not found", async () => {
    mockHabitacionRepo.findById = async () => null;

    const input = {
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      categoria_id: "categoria-id",
      habitacion_id: "non-existent-habitacion",
    };

    await expect(useCase.execute(input)).rejects.toThrow(MuebleException);
  });

  it("should create mueble with optional fields", async () => {
    const mockCreatedMueble = createMockMueble({
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      descripcion: "Cama de lujo",
    });

    mockMuebleRepo.create = async () => mockCreatedMueble;

    const input = {
      codigo: "CAMA-001",
      nombre: "Cama King Size",
      descripcion: "Cama de lujo",
      categoria_id: "categoria-id",
      imagen_url: "https://example.com/cama.jpg",
      fecha_adquisicion: "2025-01-15",
      ultima_revision: "2026-03-01",
      habitacion_id: "habitacion-id",
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.descripcion).toBe("Cama de lujo");
  });
});
