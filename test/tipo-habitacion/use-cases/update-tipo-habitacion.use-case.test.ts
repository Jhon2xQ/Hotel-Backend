import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/update-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";
import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../../src/domain/entities/furniture-catalog.entity";

describe("UpdateTipoHabitacionUseCase", () => {
  let useCase: UpdateTipoHabitacionUseCase;
  let mockRepository: ITipoHabitacionRepository;
  let mockFurnitureRepository: IFurnitureCatalogRepository;

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      hasRelatedRecords: vi.fn(),
    };
    mockFurnitureRepository = {
      create: vi.fn(),
      findByCodigo: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };
    useCase = new UpdateTipoHabitacionUseCase(mockRepository, mockFurnitureRepository);
  });

  it("should update tipo habitacion successfully", async () => {
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

    const updatedTipo = new TipoHabitacion(
      "test-id",
      "Suite Premium",
      "Suite premium actualizada",
      false,
      true,
      [],
      new Date(),
      new Date(),
    );

    const input = {
      nombre: "Suite Premium",
      descripcion: "Suite premium actualizada",
      tiene_ducha: false,
    };

    (mockRepository.findById as any).mockResolvedValue(existingTipo);
    (mockRepository.update as any).mockResolvedValue(updatedTipo);

    const result = await useCase.execute("test-id", input);

    expect(result.nombre).toBe("Suite Premium");
    expect(result.descripcion).toBe("Suite premium actualizada");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
    expect(mockRepository.update).toHaveBeenCalledWith("test-id", {
      nombre: input.nombre,
      descripcion: input.descripcion,
      tieneDucha: input.tiene_ducha,
      tieneBanio: undefined,
      muebles: undefined,
    });
  });

  it("should throw exception when tipo habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id", { nombre: "Test" })).rejects.toThrow(TipoHabitacionException);
  });

  it("should update tipo habitacion with muebles", async () => {
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

    const mockMueble = new FurnitureCatalog(
      "mueble-id",
      "CAMA-KING-01",
      "Cama King Size",
      FurnitureCategory.Cama,
      null,
      null,
      FurnitureCondition.Bueno,
      null,
      null,
      null,
      new Date(),
      new Date(),
    );

    const updatedTipo = new TipoHabitacion(
      "test-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [{ id: "mueble-id", codigo: "CAMA-KING-01", nombre: "Cama King Size", categoria: "CAMA" }],
      new Date(),
      new Date(),
    );

    const input = {
      muebles: ["mueble-id"],
    };

    (mockRepository.findById as any).mockResolvedValue(existingTipo);
    (mockFurnitureRepository.findById as any).mockResolvedValue(mockMueble);
    (mockRepository.update as any).mockResolvedValue(updatedTipo);

    const result = await useCase.execute("test-id", input);

    expect(result.muebles).toHaveLength(1);
    expect(result.muebles[0].codigo).toBe("CAMA-KING-01");
    expect(mockFurnitureRepository.findById).toHaveBeenCalledWith("mueble-id");
  });

  it("should throw exception when mueble not found", async () => {
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

    const input = {
      muebles: ["non-existent-mueble"],
    };

    (mockRepository.findById as any).mockResolvedValue(existingTipo);
    (mockFurnitureRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("test-id", input)).rejects.toThrow(TipoHabitacionException);
  });
});
