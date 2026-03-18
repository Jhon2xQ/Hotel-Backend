import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/list-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";

describe("ListTipoHabitacionUseCase", () => {
  let useCase: ListTipoHabitacionUseCase;
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
    useCase = new ListTipoHabitacionUseCase(mockRepository);
  });

  it("should list all tipos habitacion", async () => {
    const mockTipos = [
      new TipoHabitacion("id-1", "Suite Deluxe", "Suite de lujo", true, true, [], new Date(), new Date()),
      new TipoHabitacion("id-2", "Habitación Estándar", "Habitación básica", true, false, [], new Date(), new Date()),
    ];

    (mockRepository.findAll as any).mockResolvedValue(mockTipos);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nombre).toBe("Suite Deluxe");
    expect(result[1].nombre).toBe("Habitación Estándar");
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no tipos habitacion exist", async () => {
    (mockRepository.findAll as any).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
