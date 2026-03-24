import { describe, it, expect, beforeEach } from "vitest";
import { DeleteHabitacionUseCase } from "../../../src/application/use-cases/habitacion/delete-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";

describe("DeleteHabitacionUseCase", () => {
  let useCase: DeleteHabitacionUseCase;
  let mockRepository: IHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockHabitacion(),
      findAll: async () => [],
      findById: async () => null,
      findByNumero: async () => null,
      update: async () => createMockHabitacion(),
      updateStatus: async () => createMockHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findAvailableWithFilters: async () => [],
    };

    useCase = new DeleteHabitacionUseCase(mockRepository);
  });

  it("should delete habitacion successfully", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingHabitacion;
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

  it("should throw error when habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HabitacionException);
  });

  it("should throw error when habitacion has related records", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id" });
    mockRepository.findById = async () => existingHabitacion;
    mockRepository.hasRelatedRecords = async () => true;

    await expect(useCase.execute("test-id")).rejects.toThrow(HabitacionException);
  });
});
