import { describe, it, expect, beforeEach } from "vitest";
import { FindCanalByIdUseCase } from "../../../src/application/use-cases/canal/find-canal-by-id.use-case";
import { ICanalRepository } from "../../../src/domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../src/domain/exceptions/canal.exception";
import { createMockCanal } from "../../helpers/canal-fixtures";

describe("FindCanalByIdUseCase", () => {
  let useCase: FindCanalByIdUseCase;
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

    useCase = new FindCanalByIdUseCase(mockRepository);
  });

  it("should find canal by id successfully", async () => {
    const mockCanal = createMockCanal({
      id: "test-id",
      nombre: "Booking.com",
      tipo: "OTA",
    });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return mockCanal;
      return null;
    };

    const result = await useCase.execute("test-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-id");
    expect(result.nombre).toBe("Booking.com");
    expect(result.tipo).toBe("OTA");
  });

  it("should throw error when canal not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(CanalException);
  });

  it("should return canal with all fields", async () => {
    const mockCanal = createMockCanal({
      id: "test-id",
      nombre: "Booking.com",
      tipo: "OTA",
      activo: false,
      notas: "Canal desactivado",
    });

    mockRepository.findById = async () => mockCanal;

    const result = await useCase.execute("test-id");

    expect(result.activo).toBe(false);
    expect(result.notas).toBe("Canal desactivado");
  });
});
