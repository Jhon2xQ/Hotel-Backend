import { describe, it, expect, beforeEach } from "vitest";
import { DeleteTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";

describe("DeleteTipoHabitacionUseCase", () => {
  let useCase: DeleteTipoHabitacionUseCase;
  let mockRepository: ITipoHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockTipoHabitacion(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockTipoHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
    };

    useCase = new DeleteTipoHabitacionUseCase(mockRepository);
  });

  it("should delete tipo habitacion successfully", async () => {
    const existingTipo = createMockTipoHabitacion({ id: "test-id" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingTipo;
      return null;
    };
    mockRepository.hasRelatedRecords = async () => false;

    let deleted = false;
    mockRepository.delete = async () => {
      deleted = true;
    };

    await useCase.execute("test-id");

    expect(deleted).toBe(true);
  });

  it("should throw error when tipo habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(TipoHabitacionException);
  });

  it("should throw error when tipo habitacion has related records", async () => {
    const existingTipo = createMockTipoHabitacion({ id: "test-id" });
    mockRepository.findById = async () => existingTipo;
    mockRepository.hasRelatedRecords = async () => true;

    await expect(useCase.execute("test-id")).rejects.toThrow(TipoHabitacionException);
  });
});
