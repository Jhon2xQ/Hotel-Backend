import { describe, it, expect, beforeEach } from "vitest";
import { FindTipoHabitacionByIdUseCase } from "../../../src/application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";

describe("FindTipoHabitacionByIdUseCase", () => {
  let useCase: FindTipoHabitacionByIdUseCase;
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

    useCase = new FindTipoHabitacionByIdUseCase(mockRepository);
  });

  it("should return tipo habitacion when found", async () => {
    const mockTipo = createMockTipoHabitacion({ id: "test-id", nombre: "Suite Deluxe" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return mockTipo;
      return null;
    };

    const result = await useCase.execute("test-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-id");
    expect(result.nombre).toBe("Suite Deluxe");
  });

  it("should throw error when tipo habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(TipoHabitacionException);
  });
});
