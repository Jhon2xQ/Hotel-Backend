import { describe, it, expect, beforeEach } from "vitest";
import { UpdateInsumoCocinaUseCase } from "../../../src/application/use-cases/insumo-cocina/update-insumo-cocina.use-case";
import type { IInsumoCocinaRepository } from "../../../src/domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../src/domain/exceptions/insumo-cocina.exception";
import { createMockInsumoCocina } from "../../helpers/insumo-cocina-fixtures";

describe("UpdateInsumoCocinaUseCase", () => {
  let useCase: UpdateInsumoCocinaUseCase;
  let mockRepo: IInsumoCocinaRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoCocina(),
      findAll: async () => [],
      findById: async () => createMockInsumoCocina(),
      findByCodigo: async () => null,
      update: async () => createMockInsumoCocina({ stockActual: 30 }),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new UpdateInsumoCocinaUseCase(mockRepo);
  });

  it("should update insumo cocina", async () => {
    const result = await useCase.execute("test-insumo-cocina-id", { stock_actual: 30 });

    expect(result).toBeDefined();
  });

  it("should throw error when not found", async () => {
    mockRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id", { stock_actual: 10 })).rejects.toThrow(InsumoCocinaException);
  });
});