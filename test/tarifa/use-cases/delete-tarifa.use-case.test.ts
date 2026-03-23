import { describe, it, expect, beforeEach } from "vitest";
import { DeleteTarifaUseCase } from "../../../src/application/use-cases/tarifa/delete-tarifa.use-case";
import { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../src/domain/exceptions/tarifa.exception";
import { createMockTarifa } from "../../helpers/tarifa-fixtures";

describe("DeleteTarifaUseCase", () => {
  let useCase: DeleteTarifaUseCase;
  let mockRepository: ITarifaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockTarifa(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockTarifa(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findByTipoHabitacionAndCanal: async () => [],
    };

    useCase = new DeleteTarifaUseCase(mockRepository);
  });

  it("should delete tarifa successfully", async () => {
    const existingTarifa = createMockTarifa({ id: "test-id" });
    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingTarifa;
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

  it("should throw error when tarifa not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(TarifaException);
  });

  it("should throw error when tarifa has related records", async () => {
    const existingTarifa = createMockTarifa({ id: "test-id" });
    mockRepository.findById = async () => existingTarifa;
    mockRepository.hasRelatedRecords = async () => true;

    await expect(useCase.execute("test-id")).rejects.toThrow(TarifaException);
  });
});
