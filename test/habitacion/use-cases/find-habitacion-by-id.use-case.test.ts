import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindHabitacionByIdUseCase } from "../../../src/application/use-cases/habitacion/find-habitacion-by-id.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { Habitacion, EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";

describe("FindHabitacionByIdUseCase", () => {
  let useCase: FindHabitacionByIdUseCase;
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
    useCase = new FindHabitacionByIdUseCase(mockRepository);
  });

  it("should find habitacion by id", async () => {
    const mockHabitacion = new Habitacion(
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

    (mockRepository.findById as any).mockResolvedValue(mockHabitacion);

    const result = await useCase.execute("test-id");

    expect(result.id).toBe("test-id");
    expect(result.nro_habitacion).toBe("301");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HabitacionException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
