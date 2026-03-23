import { describe, it, expect, beforeEach } from "vitest";
import { DeleteCanalUseCase } from "../../../src/application/use-cases/canal/delete-canal.use-case";
import { ICanalRepository } from "../../../src/domain/interfaces/canal.repository.interface";
import { CanalException } from "../../../src/domain/exceptions/canal.exception";
import { createMockCanal } from "../../helpers/canal-fixtures";

describe("DeleteCanalUseCase", () => {
  let useCase: DeleteCanalUseCase;
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

    useCase = new DeleteCanalUseCase(mockRepository);
  });

  it("should delete canal successfully", async () => {
    const existingCanal = createMockCanal({ id: "test-id" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingCanal;
      return null;
    };
    mockRepository.hasRelatedRecords = async () => false;

    let deleted = false;
    mockRepository.delete = async () => {
      deleted = true;
    };

    await useCase.execute("test-id");

    expect(deleted).toBe(true);
  });

  it("should throw error when canal not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(CanalException);
  });

  it("should throw error when canal has related records", async () => {
    const existingCanal = createMockCanal({ id: "test-id" });
    mockRepository.findById = async () => existingCanal;
    mockRepository.hasRelatedRecords = async () => true;

    await expect(useCase.execute("test-id")).rejects.toThrow(CanalException);
  });

  it("should not delete when has reservas", async () => {
    const existingCanal = createMockCanal({
      id: "test-id",
      nombre: "Booking.com",
    });

    mockRepository.findById = async () => existingCanal;
    mockRepository.hasRelatedRecords = async (id: string) => {
      if (id === "test-id") return true;
      return false;
    };

    await expect(useCase.execute("test-id")).rejects.toThrow(CanalException);
  });
});
