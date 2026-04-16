import { describe, it, expect, beforeEach } from "vitest";
import { ListInsumoBarUseCase } from "../../../src/application/use-cases/insumo-bar/list-insumo-bar.use-case";
import type { IInsumoBarRepository } from "../../../src/domain/interfaces/insumo-bar.repository.interface";
import { createMockInsumoBar } from "../../helpers/insumo-bar-fixtures";

describe("ListInsumoBarUseCase", () => {
  let useCase: ListInsumoBarUseCase;
  let mockRepo: IInsumoBarRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoBar(),
      findAll: async () => [createMockInsumoBar({ codigo: "BAR-001" }), createMockInsumoBar({ codigo: "BAR-002" })],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockInsumoBar(),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new ListInsumoBarUseCase(mockRepo);
  });

  it("should list all insumo bar", async () => {
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].codigo).toBe("BAR-001");
  });

  it("should return empty array when no insumos", async () => {
    mockRepo.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });
});