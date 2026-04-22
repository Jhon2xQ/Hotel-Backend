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
      findByName: async () => null,
      update: async () => createMockTipoHabitacion(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findAllWithSampleHabitacion: async () => [],
    };

    useCase = new CreateTipoHabitacionUseCase(mockRepository);
  });

  it("should create tipo habitacion successfully", async () => {
    const mockTipo = createMockTipoHabitacion({
      nombre: "Suite Deluxe",
    });

    mockRepository.create = async () => mockTipo;

    const result = await useCase.execute({
      nombre: "Suite Deluxe",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Suite Deluxe");
  });

  it("should throw error when nombre is duplicate", async () => {
    mockRepository.findByName = async () => createMockTipoHabitacion({ nombre: "Suite Deluxe" });

    await expect(
      useCase.execute({
        nombre: "Suite Deluxe",
      }),
    ).rejects.toThrow();
  });
});