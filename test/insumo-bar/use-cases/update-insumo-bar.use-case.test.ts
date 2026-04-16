import { describe, it, expect, beforeEach } from "vitest";
import { UpdateInsumoBarUseCase } from "../../../src/application/use-cases/insumo-bar/update-insumo-bar.use-case";
import type { IInsumoBarRepository } from "../../../src/domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../src/domain/exceptions/insumo-bar.exception";
import { createMockInsumoBar } from "../../helpers/insumo-bar-fixtures";
import { UnidadInsumo } from "../../../src/domain/entities/insumo-bar.entity";

describe("UpdateInsumoBarUseCase", () => {
  let useCase: UpdateInsumoBarUseCase;
  let mockRepo: IInsumoBarRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoBar(),
      findAll: async () => [],
      findById: async () => createMockInsumoBar(),
      findByCodigo: async () => null,
      update: async () => createMockInsumoBar({ stockActual: 100 }),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new UpdateInsumoBarUseCase(mockRepo);
  });

  it("should update insumo bar", async () => {
    const result = await useCase.execute("test-insumo-bar-id", { stock_actual: 100 });

    expect(result).toBeDefined();
  });

  it("should throw error when insumo not found", async () => {
    mockRepo.findById = async () => null;

    await expect(useCase.execute("non-existent-id", { stock_actual: 10 })).rejects.toThrow(InsumoBarException);
  });
});