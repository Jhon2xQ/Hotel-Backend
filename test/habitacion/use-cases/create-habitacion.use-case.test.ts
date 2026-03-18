import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateHabitacionUseCase } from "../../../src/application/use-cases/habitacion/create-habitacion.use-case";
import { IHabitacionRepository } from "../../../src/domain/interfaces/habitacion.repository.interface";
import { ITipoHabitacionRepository } from "../../../src/domain/interfaces/tipo-habitacion.repository.interface";
import { IFurnitureCatalogRepository } from "../../../src/domain/interfaces/furniture-catalog.repository.interface";
import { HabitacionException } from "../../../src/domain/exceptions/habitacion.exception";
import { Habitacion, EstadoHabitacion, EstadoLimpieza } from "../../../src/domain/entities/habitacion.entity";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";
import {
  FurnitureCatalog,
  FurnitureCategory,
  FurnitureCondition,
} from "../../../src/domain/entities/furniture-catalog.entity";

describe("CreateHabitacionUseCase", () => {
  let useCase: CreateHabitacionUseCase;
  let mockRepository: IHabitacionRepository;
  let mockTipoRepository: ITipoHabitacionRepository;
  let mockFurnitureRepository: IFurnitureCatalogRepository;

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
    mockTipoRepository = {
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
    useCase = new CreateHabitacionUseCase(mockRepository, mockTipoRepository, mockFurnitureRepository);
  });

  it("should create habitacion successfully with defaults", async () => {
    const mockTipo = new TipoHabitacion(
      "tipo-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    const input = {
      nro_habitacion: "301",
      tipo_id: "tipo-id",
      piso: 3,
    };

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

    (mockTipoRepository.findById as any).mockResolvedValue(mockTipo);
    (mockRepository.findByNumero as any).mockResolvedValue(null);
    (mockRepository.create as any).mockResolvedValue(mockHabitacion);

    const result = await useCase.execute(input);

    expect(result.nro_habitacion).toBe("301");
    expect(result.estado).toBe("DISPONIBLE");
    expect(result.limpieza).toBe("LIMPIA");
    expect(mockTipoRepository.findById).toHaveBeenCalledWith("tipo-id");
    expect(mockRepository.findByNumero).toHaveBeenCalledWith("301");
  });

  it("should throw exception when tipo habitacion not found", async () => {
    const input = {
      nro_habitacion: "301",
      tipo_id: "non-existent-tipo",
      piso: 3,
    };

    (mockTipoRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(HabitacionException);
  });

  it("should throw exception when nro_habitacion already exists", async () => {
    const mockTipo = new TipoHabitacion(
      "tipo-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    const existingHabitacion = new Habitacion(
      "existing-id",
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

    const input = {
      nro_habitacion: "301",
      tipo_id: "tipo-id",
      piso: 3,
    };

    (mockTipoRepository.findById as any).mockResolvedValue(mockTipo);
    (mockRepository.findByNumero as any).mockResolvedValue(existingHabitacion);

    await expect(useCase.execute(input)).rejects.toThrow(HabitacionException);
  });

  it("should create habitacion with muebles", async () => {
    const mockTipo = new TipoHabitacion(
      "tipo-id",
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

    const input = {
      nro_habitacion: "301",
      tipo_id: "tipo-id",
      piso: 3,
      muebles: ["mueble-id"],
    };

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
      [{ id: "mueble-id", codigo: "CAMA-KING-01", nombre: "Cama King Size", categoria: "CAMA" }],
      new Date(),
      new Date(),
    );

    (mockTipoRepository.findById as any).mockResolvedValue(mockTipo);
    (mockRepository.findByNumero as any).mockResolvedValue(null);
    (mockFurnitureRepository.findById as any).mockResolvedValue(mockMueble);
    (mockRepository.create as any).mockResolvedValue(mockHabitacion);

    const result = await useCase.execute(input);

    expect(result.muebles).toHaveLength(1);
    expect(result.muebles[0].codigo).toBe("CAMA-KING-01");
    expect(mockFurnitureRepository.findById).toHaveBeenCalledWith("mueble-id");
  });

  it("should throw exception when mueble not found", async () => {
    const mockTipo = new TipoHabitacion(
      "tipo-id",
      "Suite Deluxe",
      "Suite de lujo",
      true,
      true,
      [],
      new Date(),
      new Date(),
    );

    const input = {
      nro_habitacion: "301",
      tipo_id: "tipo-id",
      piso: 3,
      muebles: ["non-existent-mueble"],
    };

    (mockTipoRepository.findById as any).mockResolvedValue(mockTipo);
    (mockRepository.findByNumero as any).mockResolvedValue(null);
    (mockFurnitureRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute(input)).rejects.toThrow(HabitacionException);
  });
});
