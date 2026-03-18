import { describe, it, expect, beforeEach } from "vitest";
import { UpdateHabitacionStatusUseCase } from "../../../src/application/use-cases/habitacion/update-habitacion-status.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { createMockHabitacion } from "../../helpers/habitacion-fixtures";
import { EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";

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
    };

    useCase = new UpdateHabitacionStatusUseCase(mockRepository);
  });

  it("should update habitacion status successfully", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id", estado: EstadoHabitacion.DISPONIBLE });
    const updatedHabitacion = createMockHabitacion({ id: "test-id", estado: EstadoHabitacion.OCUPADA });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingHabitacion;
      return null;
    };
    mockRepository.updateStatus = async () => updatedHabitacion;

    const result = await useCase.execute("test-id", {
      estado: EstadoHabitacion.OCUPADA,
    });

    expect(result).toBeDefined();
    expect(result.estado).toBe("OCUPADA");
  });

  it("should throw error when habitacion not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        estado: EstadoHabitacion.OCUPADA,
      }),
    ).rejects.toThrow(HabitacionException);
  });

  it("should update limpieza status", async () => {
    const existingHabitacion = createMockHabitacion({ id: "test-id", limpieza: EstadoLimpieza.SUCIA });
    const updatedHabitacion = createMockHabitacion({ id: "test-id", limpieza: EstadoLimpieza.LIMPIA });

    mockRepository.findById = async () => existingHabitacion;
    mockRepository.updateStatus = async () => updatedHabitacion;

    const result = await useCase.execute("test-id", {
      limpieza: EstadoLimpieza.LIMPIA,
    });

    expect(result.limpieza).toBe("LIMPIA");
  });
});
