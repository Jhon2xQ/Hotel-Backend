import { describe, it, expect, beforeEach } from "vitest";
import { FindInsumoBarByIdUseCase } from "../../../src/application/use-cases/insumo-bar/find-insumo-bar-by-id.use-case";
import type { IInsumoBarRepository } from "../../../src/domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../src/domain/exceptions/insumo-bar.exception";
import { createMockInsumoBar } from "../../helpers/insumo-bar-fixtures";

describe("FindInsumoBarByIdUseCase", () => {
  let useCase: FindInsumoBarByIdUseCase;
  let mockRepo: IInsumoBarRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoBar(),
      findAll: async () => [],
      findById: async (id: string) => (id === "test-insumo-bar-id" ? createMockInsumoBar() : null),
      findByCodigo: async () => null,
      update: async () => createMockInsumoBar(),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new FindInsumoBarByIdUseCase(mockRepo);
  });

  it("should find insumo bar by id", async () => {
    const result = await useCase.execute("test-insumo-bar-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-insumo-bar-id");
  });

  it("should throw error when insumo not found", async () => {
    await expect(useCase.execute("non-existent-id")).rejects.toThrow(InsumoBarException);
  });
});