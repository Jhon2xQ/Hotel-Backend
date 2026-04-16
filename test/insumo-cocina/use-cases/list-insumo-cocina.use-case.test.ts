import { describe, it, expect, beforeEach } from "vitest";
import { ListInsumoCocinaUseCase } from "../../../src/application/use-cases/insumo-cocina/list-insumo-cocina.use-case";
import type { IInsumoCocinaRepository } from "../../../src/domain/interfaces/insumo-cocina.repository.interface";
import { createMockInsumoCocina } from "../../helpers/insumo-cocina-fixtures";

describe("ListInsumoCocinaUseCase", () => {
  let useCase: ListInsumoCocinaUseCase;
  let mockRepo: IInsumoCocinaRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoCocina(),
      findAll: async () => [createMockInsumoCocina({ codigo: "COC-001" }), createMockInsumoCocina({ codigo: "COC-002" })],
      findById: async () => null,
      findByCodigo: async () => null,
      update: async () => createMockInsumoCocina(),
      delete: async () => {},
      createMovimiento: async () => {
        throw new Error("Not implemented");
      },
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new ListInsumoCocinaUseCase(mockRepo);
  });

  it("should list all insumo cocina", async () => {
    const result = await useCase.execute();

    expect(result).toHaveLength(2);
    expect(result[0].codigo).toBe("COC-001");
  });
});