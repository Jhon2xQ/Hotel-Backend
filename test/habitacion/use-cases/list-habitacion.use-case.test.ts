import { describe, it, expect, beforeEach } from "vitest";
import { ListHabitacionUseCase } from "../../../src/application/use-cases/habitacion/list-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";

describe("ListHabitacionUseCase", () => {
  let useCase: ListHabitacionUseCase;
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
      findAllPaginated: async () => ({ list: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0, hasNextPage: false, hasPreviousPage: false } }),
      findByIdWithReservas: async () => null,
    };

    useCase = new ListHabitacionUseCase(mockRepository);
  });

  it("should return list of habitaciones", async () => {
    const mockHabitaciones = [
      createMockHabitacion({ id: "id-1", nroHabitacion: "101", piso: 1 }),
      createMockHabitacion({ id: "id-2", nroHabitacion: "102", piso: 1 }),
    ];

    mockRepository.findAll = async () => mockHabitaciones;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nro_habitacion).toBe("101");
    expect(result[1].nro_habitacion).toBe("102");
  });

  it("should return empty array when no habitaciones exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
