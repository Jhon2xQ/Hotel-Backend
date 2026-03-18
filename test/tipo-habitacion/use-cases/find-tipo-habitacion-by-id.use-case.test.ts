import { describe, it, expect, vi, beforeEach } from "vitest";
import { FindTipoHabitacionByIdUseCase } from "../../../src/application/use-cases/tipo-habitacion/find-tipo-habitacion-by-id.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";

describe("FindTipoHabitacionByIdUseCase", () => {
  let useCase: FindTipoHabitacionByIdUseCase;
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
    useCase = new FindTipoHabitacionByIdUseCase(mockRepository);
  });

  it("should find tipo habitacion by id", async () => {
    const mockTipo = new TipoHabitacion(
      "test-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    (mockRepository.findById as any).mockResolvedValue(mockTipo);

    const result = await useCase.execute("test-id");

    expect(result.id).toBe("test-id");
    expect(result.nombre).toBe("Suite Deluxe");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when tipo habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(TipoHabitacionException);
    expect(mockRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
