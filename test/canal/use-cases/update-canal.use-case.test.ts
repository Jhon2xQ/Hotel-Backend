import { describe, it, expect, beforeEach } from "vitest";
import { UpdateCanalUseCase } from "../../../src/application/use-cases/canal/update-canal.use-case";
import { ICanalRepository } from "../../../src/domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../src/domain/exceptions/canal.exception";
import { createMockCanal } from "../../helpers/canal-fixtures";

describe("UpdateCanalUseCase", () => {
  let useCase: UpdateCanalUseCase;
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

    useCase = new UpdateCanalUseCase(mockRepository);
  });

  it("should update canal successfully", async () => {
    const existingCanal = createMockCanal({
      id: "test-id",
      nombre: "Booking.com",
      tipo: "OTA",
    });

    const updatedCanal = createMockCanal({
      id: "test-id",
      nombre: "Booking.com Updated",
      tipo: "OTA",
      activo: false,
    });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingCanal;
      return null;
    };

    mockRepository.update = async () => updatedCanal;

    const result = await useCase.execute("test-id", {
      nombre: "Booking.com Updated",
      activo: false,
    });

    expect(result).toBeDefined();
    expect(result.nombre).toBe("Booking.com Updated");
    expect(result.activo).toBe(false);
  });

  it("should throw error when canal not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        nombre: "Updated",
      }),
    ).rejects.toThrow(CanalException);
  });

  it("should update only tipo field", async () => {
    const existingCanal = createMockCanal({
      id: "test-id",
      nombre: "Canal Test",
      tipo: "OTA",
    });

    const updatedCanal = createMockCanal({
      id: "test-id",
      nombre: "Canal Test",
      tipo: "DIRECTO",
    });

    mockRepository.findById = async () => existingCanal;
    mockRepository.update = async () => updatedCanal;

    const result = await useCase.execute("test-id", {
      tipo: "DIRECTO",
    });

    expect(result.tipo).toBe("DIRECTO");
    expect(result.nombre).toBe("Canal Test");
  });

  it("should update notas field", async () => {
    const existingCanal = createMockCanal({ id: "test-id" });
    const updatedCanal = createMockCanal({
      id: "test-id",
      notas: "Notas actualizadas",
    });

    mockRepository.findById = async () => existingCanal;
    mockRepository.update = async () => updatedCanal;

    const result = await useCase.execute("test-id", {
      notas: "Notas actualizadas",
    });

    expect(result.notas).toBe("Notas actualizadas");
  });
});
