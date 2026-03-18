import { describe, it, expect, vi, beforeEach } from "vitest";
import { ListHabitacionUseCase } from "../../../src/application/use-cases/habitacion/list-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { Habitacion, EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";

describe("ListHabitacionUseCase", () => {
  let useCase: ListHabitacionUseCase;
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
    useCase = new ListHabitacionUseCase(mockRepository);
  });

  it("should list all habitaciones", async () => {
    const mockHabitaciones = [
      new Habitacion(
        "id-1",
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
      ),
      new Habitacion(
        "id-2",
        "302",
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
      ),
    ];

    (mockRepository.findAll as any).mockResolvedValue(mockHabitaciones);

    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].nro_habitacion).toBe("301");
    expect(result[1].nro_habitacion).toBe("302");
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it("should return empty array when no habitaciones exist", async () => {
    (mockRepository.findAll as any).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
