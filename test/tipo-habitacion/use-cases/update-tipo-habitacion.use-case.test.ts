import { describe, it, expect, beforeEach } from "vitest";
import { UpdateTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";

describe("UpdateTipoHabitacionUseCase", () => {
  let useCase: UpdateTipoHabitacionUseCase;
  let mockRepository: ITipoHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockTipoHabitacion(),
      findAll: async () => [],
      findById: async () => null,
      findByName: async () => null,
      update: async () => createMockTipoHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findAllWithSampleHabitacion: async () => [],
    };

    useCase = new UpdateTipoHabitacionUseCase(mockRepository);
  });

  it("should update tipo habitacion successfully", async () => {
    const existingTipo = createMockTipoHabitacion({ id: "test-id", nombre: "Suite Deluxe" });
    const updatedTipo = createMockTipoHabitacion({ id: "test-id", nombre: "Suite Deluxe Premium" });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingTipo;
      return null;
    };
    mockRepository.update = async () => updatedTipo;

    const result = await useCase.execute("test-id", {
      nombre: "Suite Deluxe Premium",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Suite Deluxe Premium");
  });

  it("should throw error when tipo habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        nombre: "Updated Name",
      }),
    ).rejects.toThrow(TipoHabitacionException);
  });

  it("should throw error when nombre is duplicate", async () => {
    const existingTipo = createMockTipoHabitacion({ id: "test-id", nombre: "Suite Deluxe" });
    const duplicateTipo = createMockTipoHabitacion({ id: "other-id", nombre: "Suite Deluxe Premium" });

    mockRepository.findById = async () => existingTipo;
    mockRepository.findByName = async () => duplicateTipo;

    await expect(
      useCase.execute("test-id", {
        nombre: "Suite Deluxe Premium",
      }),
    ).rejects.toThrow(TipoHabitacionException);
  });
});