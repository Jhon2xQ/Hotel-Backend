import { describe, it, expect, vi, beforeEach } from "vitest";
import { DeleteTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/delete-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";

describe("DeleteTipoHabitacionUseCase", () => {
  let useCase: DeleteTipoHabitacionUseCase;
  let mockRepository: ITipoHabitacionRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      hasRelatedRecords: vi.fn(),
    };
    useCase = new DeleteTipoHabitacionUseCase(mockRepository);
  });

  it("should delete tipo habitacion successfully", async () => {
    const existingTipo = new TipoHabitacion(
      "test-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(existingTipo);
    (mockRepository.hasRelatedRecords as any).mockResolvedValue(false);
    (mockRepository.delete as any).mockResolvedValue(undefined);

    await useCase.execute("test-id");

    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.hasRelatedRecords).toHaveBeenCalledWith("test-id");
    expect(mockRepository.delete).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when tipo habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(TipoHabitacionException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });

  it("should throw exception when tipo habitacion has related records", async () => {
    const existingTipo = new TipoHabitacion(
      "test-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(existingTipo);
    (mockRepository.hasRelatedRecords as any).mockResolvedValue(true);

    await expect(useCase.execute("test-id")).rejects.toThrow(TipoHabitacionException);
    expect(mockRepository.hasRelatedRecords).toHaveBeenCalledWith("test-id");
  });
});
