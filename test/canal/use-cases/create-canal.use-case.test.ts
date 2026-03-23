import { describe, it, expect, beforeEach } from "vitest";
import { CreateCanalUseCase } from "../../../src/application/use-cases/canal/create-canal.use-case";
import { ICanalRepository } from "../../../src/domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../src/domain/exceptions/canal.exception";
import { createMockCanal } from "../../helpers/canal-fixtures";

describe("CreateCanalUseCase", () => {
  let useCase: CreateCanalUseCase;
  let mockRepository: ICanalRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockCanal(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockCanal(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findByName: async () => null,
    };

    useCase = new CreateCanalUseCase(mockRepository);
  });

  it("should create canal successfully", async () => {
    const mockCanal = createMockCanal({
      nombre: "Booking.com",
      tipo: "OTA",
      activo: true,
      notas: "Canal principal",
    });

    mockRepository.create = async () => mockCanal;
    mockRepository.findByName = async () => null;

    const result = await useCase.execute({
      nombre: "Booking.com",
      tipo: "OTA",
      activo: true,
      notas: "Canal principal",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Booking.com");
    expect(result.tipo).toBe("OTA");
    expect(result.activo).toBe(true);
    expect(result.notas).toBe("Canal principal");
  });

  it("should create canal without optional fields", async () => {
    mockRepository.create = async (data) => {
      return createMockCanal({
        nombre: data.nombre,
        tipo: data.tipo,
        activo: data.activo ?? true,
        notas: data.notas ?? null,
      });
    };
    mockRepository.findByName = async () => null;

    const result = await useCase.execute({
      nombre: "Directo",
      tipo: "DIRECTO",
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Directo");
    expect(result.tipo).toBe("DIRECTO");
    expect(result.activo).toBe(true);
    expect(result.notas).toBeNull();
  });

  it("should throw error when canal name already exists", async () => {
    const existingCanal = createMockCanal({ nombre: "Booking.com" });
    mockRepository.findByName = async (nombre: string) => {
      if (nombre === "Booking.com") return existingCanal;
      return null;
    };

    await expect(
      useCase.execute({
        nombre: "Booking.com",
        tipo: "OTA",
      }),
    ).rejects.toThrow(CanalException);
  });

  it("should create canal with tipo AGENTE", async () => {
    const mockCanal = createMockCanal({
      nombre: "Agencia XYZ",
      tipo: "AGENTE",
    });

    mockRepository.create = async () => mockCanal;
    mockRepository.findByName = async () => null;

    const result = await useCase.execute({
      nombre: "Agencia XYZ",
      tipo: "AGENTE",
    });

    expect(result.tipo).toBe("AGENTE");
  });
});
