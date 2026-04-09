import { describe, it, expect, beforeEach } from "vitest";
import { UpdateHabitacionStatusUseCase } from "../../../src/application/use-cases/habitacion/update-habitacion-status.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";

describe("UpdateHabitacionStatusUseCase", () => {
  let useCase: UpdateHabitacionStatusUseCase;
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

    useCase = new UpdateHabitacionStatusUseCase(mockRepository);
  });

  it("should update habitacion status successfully", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id", estado: false });
    const updatedHabitacion = createMockHabitacion({ id: "test-id", estado: true });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingHabitacion;
      return null;
    };
    mockRepository.updateStatus = async () => updatedHabitacion;

    const result = await useCase.execute("test-id", {
      estado: true,
    });

    expect(result).toBeDefined();
    expect(result.estado).toBe(true);
  });

  it("should throw error when habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        estado: true,
      }),
    ).rejects.toThrow(HabitacionException);
  });
});
