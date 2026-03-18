import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateHabitacionStatusUseCase } from "../../../src/application/use-cases/habitacion/update-habitacion-status.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { Habitacion, EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";

describe("UpdateHabitacionStatusUseCase", () => {
  let useCase: UpdateHabitacionStatusUseCase;
  let mockRepository: IHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByNumero: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
      hasRelatedRecords: vi.fn(),
    };
    useCase = new UpdateHabitacionStatusUseCase(mockRepository);
  });

  it("should update habitacion status successfully", async () => {
    const existingHabitacion = new Habitacion(
      "test-id",
      "301",
      "tipo-id",
      { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
      3,
      null,
      EstadoHabitacion.DISPONIBLE,
      EstadoLimpieza.LIMPIA,
      null,
      null,
      [],
      new Date(),
      new Date(),
    );

    const updatedHabitacion = new Habitacion(
      "test-id",
      "301",
      "tipo-id",
      { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
      3,
      null,
      EstadoHabitacion.OCUPADA,
      EstadoLimpieza.SUCIA,
      null,
      null,
      [],
      new Date(),
      new Date(),
    );

    const input = {
      estado: EstadoHabitacion.OCUPADA,
      limpieza: EstadoLimpieza.SUCIA,
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitacion);
    (mockRepository.updateStatus as any).mockResolvedValue(updatedHabitacion);

    const result = await useCase.execute("test-id", input);

    expect(result.estado).toBe("OCUPADA");
    expect(result.limpieza).toBe("SUCIA");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.updateStatus).toHaveBeenCalledWith("test-id", input);
  });

  it("should throw exception when habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id", { estado: EstadoHabitacion.OCUPADA })).rejects.toThrow(
      HabitacionException,
    );
  });
});
