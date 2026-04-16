import { describe, it, expect, beforeEach } from "vitest";
import { FindInsumoCocinaByIdUseCase } from "../../../src/application/use-cases/insumo-cocina/find-insumo-cocina-by-id.use-case";
import type { IInsumoCocinaRepository } from "../../../src/domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../src/domain/exceptions/insumo-cocina.exception";
import { createMockInsumoCocina } from "../../helpers/insumo-cocina-fixtures";

describe("FindInsumoCocinaByIdUseCase", () => {
  let useCase: FindInsumoCocinaByIdUseCase;
  let mockRepo: IInsumoCocinaRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoCocina(),
      findAll: async () => [],
      findById: async (id: string) => (id === "test-insumo-cocina-id" ? createMockInsumoCocina() : null),
      findByCodigo: async () => null,
      update: async () => createMockInsumoCocina(),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new FindInsumoCocinaByIdUseCase(mockRepo);
  });

  it("should find insumo cocina by id", async () => {
    const result = await useCase.execute("test-insumo-cocina-id");

    expect(result).toBeDefined();
  });

  it("should throw error when not found", async () => {
    await expect(useCase.execute("non-existent-id")).rejects.toThrow(InsumoCocinaException);
  });
});