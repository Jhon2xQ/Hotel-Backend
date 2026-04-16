import { describe, it, expect, beforeEach } from "vitest";
import { DeleteInsumoCocinaUseCase } from "../../../src/application/use-cases/insumo-cocina/delete-insumo-cocina.use-case";
import type { IInsumoCocinaRepository } from "../../../src/domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../src/domain/exceptions/insumo-cocina.exception";
import { createMockInsumoCocina } from "../../helpers/insumo-cocina-fixtures";

describe("DeleteInsumoCocinaUseCase", () => {
  let useCase: DeleteInsumoCocinaUseCase;
  let mockRepo: IInsumoCocinaRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoCocina(),
      findAll: async () => [],
      findById: async () => createMockInsumoCocina(),
      findByCodigo: async () => null,
      update: async () => createMockInsumoCocina(),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new DeleteInsumoCocinaUseCase(mockRepo);
  });

  it("should delete insumo cocina", async () => {
    await expect(useCase.execute("test-insumo-cocina-id")).resolves.not.toThrow();
  });

  it("should throw error when not found", async () => {
    mockRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(InsumoCocinaException);
  });
});