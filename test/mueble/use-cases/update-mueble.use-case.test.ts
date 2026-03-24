import { describe, it, expect, beforeEach } from "vitest";
import { UpdateMuebleUseCase } from "../../../src/application/use-cases/mueble/update-mueble.use-case";
import { IMuebleRepository } from "../../../src/domain/interfaces/mueble.repository.interface";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { MuebleException } from "../../../src/domain/exceptions/mueble.exception";
import { createMockMueble } from "../../helpers/mueble-fixtures";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { MuebleCondition } from "../../../src/domain/entities/mueble.entity";

describe("UpdateMuebleUseCase", () => {
  let useCase: UpdateMuebleUseCase;
  let mockMuebleRepo: IMuebleRepository;
  let mockHabitacionRepo: IHabitacionRepository;

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

    useCase = new UpdateMuebleUseCase(mockMuebleRepo, mockHabitacionRepo);
  });

  it("should update mueble successfully", async () => {
    const existingMueble = createMockMueble({ id: "test-id", codigo: "CAMA-001" });
    const updatedMueble = createMockMueble({ id: "test-id", nombre: "Cama Queen Size" });

    mockMuebleRepo.findById = async () => existingMueble;
    mockMuebleRepo.update = async () => updatedMueble;

    const result = await useCase.execute("test-id", {
      nombre: "Cama Queen Size",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Cama Queen Size");
  });

  it("should throw error when mueble not found", async () => {
    mockMuebleRepo.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        nombre: "Cama Queen Size",
      }),
    ).rejects.toThrow(MuebleException);
  });

  it("should throw error when codigo already exists", async () => {
    const existingMueble = createMockMueble({ id: "test-id", codigo: "CAMA-001" });
    const duplicateMueble = createMockMueble({ id: "other-id", codigo: "CAMA-002" });

    mockMuebleRepo.findById = async () => existingMueble;
    mockMuebleRepo.findByCodigo = async (codigo: string) => {
      if (codigo === "CAMA-002") return duplicateMueble;
      return null;
    };

    await expect(
      useCase.execute("test-id", {
        codigo: "CAMA-002",
      }),
    ).rejects.toThrow(MuebleException);
  });

  it("should throw error when habitacion not found", async () => {
    const existingMueble = createMockMueble({ id: "test-id" });

    mockMuebleRepo.findById = async () => existingMueble;
    mockHabitacionRepo.findById = async () => null;

    await expect(
      useCase.execute("test-id", {
        habitacion_id: "non-existent-habitacion",
      }),
    ).rejects.toThrow(MuebleException);
  });

  it("should update mueble with multiple fields", async () => {
    const existingMueble = createMockMueble({ id: "test-id", codigo: "CAMA-001" });
    const updatedMueble = createMockMueble({
      id: "test-id",
      nombre: "Cama Queen Size",
      condicion: MuebleCondition.Regular,
    });

    mockMuebleRepo.findById = async () => existingMueble;
    mockMuebleRepo.findByCodigo = async () => null;
    mockMuebleRepo.update = async () => updatedMueble;

    const result = await useCase.execute("test-id", {
      nombre: "Cama Queen Size",
      condicion: MuebleCondition.Regular,
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Cama Queen Size");
    expect(result.condicion).toBe("REGULAR");
  });
});
