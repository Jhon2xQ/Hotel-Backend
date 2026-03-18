import { describe, it, expect, vi, beforeEach } from "vitest";
import { UpdateHabitacionUseCase } from "../../../src/application/use-cases/habitacion/update-habitacion.use-case";
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

describe("UpdateHabitacionUseCase", () => {
  let useCase: UpdateHabitacionUseCase;
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
    useCase = new UpdateHabitacionUseCase(mockRepository, mockTipoRepository, mockFurnitureRepository);
  });

  it("should update habitacion successfully", async () => {
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
      "302",
      "tipo-id",
      { id: "tipo-id", nombre: "Suite Deluxe", descripcion: "Suite de lujo" },
      3,
      "https://example.com/302.jpg",
      EstadoHabitacion.DISPONIBLE,
      EstadoLimpieza.LIMPIA,
      "Notas actualizadas",
      null,
      [],
      new Date(),
      new Date(),
    );

    const input = {
      nro_habitacion: "302",
      url_imagen: "https://example.com/302.jpg",
      notas: "Notas actualizadas",
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitacion);
    (mockRepository.findByNumero as any).mockResolvedValue(null);
    (mockRepository.update as any).mockResolvedValue(updatedHabitacion);

    const result = await useCase.execute("test-id", input);

    expect(result.nro_habitacion).toBe("302");
    expect(result.url_imagen).toBe("https://example.com/302.jpg");
    expect(result.notas).toBe("Notas actualizadas");
    expect(mockRepository.findById).toHaveBeenCalledWith("test-id");
  });

  it("should throw exception when habitacion not found", async () => {
    (mockRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("non-existent-id", { piso: 4 })).rejects.toThrow(HabitacionException);
  });

  it("should throw exception when updating to duplicate nro_habitacion", async () => {
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

    const duplicateHabitacion = new Habitacion(
      "other-id",
      "302",
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
    (mockRepository.findByNumero as any).mockResolvedValue(duplicateHabitacion);

    await expect(useCase.execute("test-id", { nro_habitacion: "302" })).rejects.toThrow(HabitacionException);
  });

  it("should throw exception when tipo habitacion not found", async () => {
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

    const input = {
      tipo_id: "non-existent-tipo",
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitacion);
    (mockTipoRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("test-id", input)).rejects.toThrow(HabitacionException);
  });

  it("should throw exception when mueble not found", async () => {
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

    const input = {
      muebles: ["non-existent-mueble"],
    };

    (mockRepository.findById as any).mockResolvedValue(existingHabitacion);
    (mockFurnitureRepository.findById as any).mockResolvedValue(null);

    await expect(useCase.execute("test-id", input)).rejects.toThrow(HabitacionException);
  });
});
