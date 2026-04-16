import { describe, it, expect, beforeEach } from "vitest";
import { CreateInsumoBarUseCase } from "../../../src/application/use-cases/insumo-bar/create-insumo-bar.use-case";
import type { IInsumoBarRepository } from "../../../src/domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../src/domain/exceptions/insumo-bar.exception";
import { createMockInsumoBar } from "../../helpers/insumo-bar-fixtures";
import { UnidadInsumo } from "../../../src/domain/entities/insumo-bar.entity";

describe("CreateInsumoBarUseCase", () => {
  let useCase: CreateInsumoBarUseCase;
  let mockRepo: IInsumoBarRepository;

  beforeEach(() => {
    mockRepo = {
      create: async (data) => createMockInsumoBar({ codigo: data.codigo, nombre: data.nombre }),
      findAll: async () => [],
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

    useCase = new CreateInsumoBarUseCase(mockRepo);
  });

  it("should create insumo bar successfully", async () => {
    const input = {
      codigo: "BAR-CERV-001",
      nombre: "Cerveza Cristal",
      unidad: UnidadInsumo.Botella,
      stock_actual: 50,
      stock_minimo: 10,
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.codigo).toBe("BAR-CERV-001");
    expect(result.nombre).toBe("Cerveza Cristal");
    expect(result.unidad).toBe("BOTELLA");
  });

  it("should throw error when codigo already exists", async () => {
    mockRepo.findByCodigo = async () => createMockInsumoBar();

    const input = {
      codigo: "BAR-001",
      nombre: "Insumo Duplicado",
      unidad: UnidadInsumo.Botella,
    };

    await expect(useCase.execute(input)).rejects.toThrow(InsumoBarException);
  });
});