import { describe, it, expect, beforeEach } from "vitest";
import { DeleteInsumoBarUseCase } from "../../../src/application/use-cases/insumo-bar/delete-insumo-bar.use-case";
import type { IInsumoBarRepository } from "../../../src/domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../src/domain/exceptions/insumo-bar.exception";
import { createMockInsumoBar } from "../../helpers/insumo-bar-fixtures";

describe("DeleteInsumoBarUseCase", () => {
  let useCase: DeleteInsumoBarUseCase;
  let mockRepo: IInsumoBarRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoBar(),
      findAll: async () => [],
      findById: async () => createMockInsumoBar(),
      findByCodigo: async () => null,
      update: async () => createMockInsumoBar(),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new DeleteInsumoBarUseCase(mockRepo);
  });

  it("should delete insumo bar", async () => {
    await expect(useCase.execute("test-insumo-bar-id")).resolves.not.toThrow();
  });

  it("should throw error when insumo not found", async () => {
    mockRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(InsumoBarException);
  });
});