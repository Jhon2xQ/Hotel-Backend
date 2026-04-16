import { describe, it, expect, beforeEach } from "vitest";
import { CreateInsumoCocinaUseCase } from "../../../src/application/use-cases/insumo-cocina/create-insumo-cocina.use-case";
import type { IInsumoCocinaRepository } from "../../../src/domain/interfaces/insumo-cocina.repository.interface";
import { InsumoCocinaException } from "../../../src/domain/exceptions/insumo-cocina.exception";
import { createMockInsumoCocina } from "../../helpers/insumo-cocina-fixtures";
import { UnidadInsumo } from "../../../src/domain/entities/insumo-cocina.entity";

describe("CreateInsumoCocinaUseCase", () => {
  let useCase: CreateInsumoCocinaUseCase;
  let mockRepo: IInsumoCocinaRepository;

  beforeEach(() => {
    mockRepo = {
      create: async (data) => createMockInsumoCocina({ codigo: data.codigo, nombre: data.nombre }),
      findAll: async () => [],
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

    useCase = new CreateInsumoCocinaUseCase(mockRepo);
  });

  it("should create insumo cocina successfully", async () => {
    const input = {
      codigo: "COC-CARNE-001",
      nombre: "Carne de Res",
      unidad: UnidadInsumo.Kg,
      stock_actual: 20,
      stock_minimo: 5,
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.codigo).toBe("COC-CARNE-001");
    expect(result.nombre).toBe("Carne de Res");
    expect(result.unidad).toBe("KG");
  });

  it("should throw error when codigo already exists", async () => {
    mockRepo.findByCodigo = async () => createMockInsumoCocina();

    const input = {
      codigo: "COC-001",
      nombre: "Insumo Duplicado",
      unidad: UnidadInsumo.Kg,
    };

    await expect(useCase.execute(input)).rejects.toThrow(InsumoCocinaException);
  });
});