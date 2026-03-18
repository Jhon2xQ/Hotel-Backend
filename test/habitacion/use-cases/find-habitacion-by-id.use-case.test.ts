import { describe, it, expect, beforeEach } from "vitest";
import { FindHabitacionByIdUseCase } from "../../../src/application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";

describe("FindHabitacionByIdUseCase", () => {
  let useCase: FindHabitacionByIdUseCase;
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
    };

    useCase = new FindHabitacionByIdUseCase(mockRepository);
  });

  it("should return habitacion when found", async () => {
    const mockHabitacion = createMockHabitacion({ id: "test-id", nroHabitacion: "101" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return mockHabitacion;
      return null;
    };

    const result = await useCase.execute("test-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-id");
    expect(result.nro_habitacion).toBe("101");
  });

  it("should throw error when habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HabitacionException);
  });
});
