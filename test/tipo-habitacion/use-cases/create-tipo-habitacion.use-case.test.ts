import { describe, it, expect, beforeEach } from "vitest";
import { CreateTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { createMockTipoHabitacion } from "../../helpers/tipo-habitacion-fixtures";

describe("CreateTipoHabitacionUseCase", () => {
  let useCase: CreateTipoHabitacionUseCase;
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

    useCase = new CreateTipoHabitacionUseCase(mockRepository);
  });

  it("should create tipo habitacion successfully", async () => {
    const mockTipo = createMockTipoHabitacion({
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo con vista panorámica",
    });

    mockRepository.create = async () => mockTipo;

    const result = await useCase.execute({
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo con vista panorámica",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Suite Deluxe");
    expect(result.descripcion).toBe("Suite de lujo con vista panorámica");
  });

  it("should create tipo habitacion without descripcion", async () => {
    mockRepository.create = async (data) => {
      return createMockTipoHabitacion({
        nombre: data.nombre,
        descripcion: data.descripcion ?? null,
      });
    };

    const result = await useCase.execute({
      nombre: "Habitación Estándar",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Habitación Estándar");
    expect(result.descripcion).toBeNull();
  });
});
