import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteHabitacionUseCase } from "../../../src/application/use-cases/habitacion/delete-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { Habitacion, EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";

describe("DeleteHabitacionUseCase", () => {
  let useCase: DeleteHabitacionUseCase;
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
    useCase = new DeleteHabitacionUseCase(mockRepository);
  });

  it("should delete habitacion successfully", async () => {
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

    (mockRepository.findById as any).mockResolvedValue(existingHabitacion);
    (mockRepository.hasRelatedRecords as any).mockResolvedValue(false);
    (mockRepository.delete as any).mockResolvedValue(undefined);

    await useCase.execute("test-id");

    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.hasRelatedRecords).toHaveBeenCalledWith("test-id");
    expect(mockRepository.delete).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(HabitacionException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw exception when habitacion has related records", async () => {
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

    (mockRepository.findById as any).mockResolvedValue(existingHabitacion);
    (mockRepository.hasRelatedRecords as any).mockResolvedValue(true);

    await expect(useCase.execute("test-id")).rejects.toThrow(HabitacionException);
    expect(mockRepository.hasRelatedRecords).toHaveBeenCalledWith("test-id");
  });
});
