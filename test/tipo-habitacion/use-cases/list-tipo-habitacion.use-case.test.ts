import { describe, it, expect, beforeEach } from "vitest";
import { ListTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";

describe("ListTipoHabitacionUseCase", () => {
  let useCase: ListTipoHabitacionUseCase;
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

    useCase = new ListTipoHabitacionUseCase(mockRepository);
  });

  it("should return list of tipo habitacion", async () => {
    const mockTipos = [
      createMockTipoHabitacion({ id: "id-1", nombre: "Suite Deluxe" }),
      createMockTipoHabitacion({ id: "id-2", nombre: "Habitación Estándar" }),
    ];

    mockRepository.findAll = async () => mockTipos;

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe("Suite Deluxe");
    expect(result[1].nombre).toBe("Habitación Estándar");
  });

  it("should return empty array when no tipos exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});
