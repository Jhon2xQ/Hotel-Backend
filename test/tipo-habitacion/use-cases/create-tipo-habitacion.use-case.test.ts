import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateTipoHabitacionUseCase } from "../../../src/application/use-cases/tipo-habitacion/create-tipo-habitacion.use-case";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { TipoHabitacionException } from "../../../src/domain/exceptions/tipo-habitacion.exception";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";
import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../../src/domain/entities/furniture-catalog.entity";

describe("CreateTipoHabitacionUseCase", () => {
  let useCase: CreateTipoHabitacionUseCase;
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
    useCase = new CreateTipoHabitacionUseCase(mockRepository, mockFurnitureRepository);
  });

  it("should create tipo habitacion successfully without muebles", async () => {
    const input = {
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo con vista panorámica",
      tiene_ducha: true,
      tiene_banio: true,
    };

    const mockTipo = new TipoHabitacion(
      "test-id",
      "Suite Deluxe",
      "Suite de lujo con vista panorámica",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    (mockRepository.create as any).mockResolvedValue(mockTipo);

    const result = await useCase.execute(input);

    expect(result.nombre).toBe("Suite Deluxe");
    expect(result.tiene_ducha).toBe(true);
    expect(result.tiene_banio).toBe(true);
    expect(result.muebles).toHaveLength(0);
    expect(mockRepository.create).toHaveBeenCalledWith({
      nombre: input.nombre,
      descripcion: input.descripcion,
      tieneDucha: input.tiene_ducha,
      tieneBanio: input.tiene_banio,
      muebles: [],
    });
  });

  it("should create tipo habitacion successfully with muebles", async () => {
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

    const input = {
      nombre: "Suite Deluxe",
      descripcion: "Suite de lujo",
      tiene_ducha: true,
      tiene_banio: true,
      muebles: ["mueble-id"],
    };

    const mockTipo = new TipoHabitacion(
      "test-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [{ id: "mueble-id", codigo: "CAMA-KING-01", nombre: "Cama King Size", categoria: "CAMA" }],
      new Date(),
      new Date(),
    );

    (mockFurnitureRepository.findById as any).mockResolvedValue(mockMueble);
    (mockRepository.create as any).mockResolvedValue(mockTipo);

    const result = await useCase.execute(input);

    expect(result.nombre).toBe("Suite Deluxe");
    expect(result.muebles).toHaveLength(1);
    expect(result.muebles[0].codigo).toBe("CAMA-KING-01");
    expect(mockFurnitureRepository.findById).toHaveBeenCalledWith("mueble-id");
  });

  it("should throw exception when mueble not found", async () => {
    const input = {
      nombre: "Suite Deluxe",
      tiene_ducha: true,
      tiene_banio: true,
      muebles: ["non-existent-id"],
    };

    (mockFurnitureRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(TipoHabitacionException);
    expect(mockFurnitureRepository.findById).toHaveBeenCalledWith("non-existent-id");
  });
});
