import { describe, it, expect, beforeEach } from "vitest";
import { RegisterMovimientoBarUseCase } from "../../../src/application/use-cases/insumo-bar/register-movimiento-bar.use-case";
import type { IInsumoBarRepository } from "../../../src/domain/interfaces/insumo-bar.repository.interface";
import { InsumoBarException } from "../../../src/domain/exceptions/insumo-bar.exception";
import { createMockInsumoBar, createMockMovimientoBar } from "../../helpers/insumo-bar-fixtures";
import { TipoMovimiento, MotivoEntrada, MotivoSalida } from "../../../src/domain/entities/insumo-bar.entity";

describe("RegisterMovimientoBarUseCase", () => {
  let useCase: RegisterMovimientoBarUseCase;
  let mockRepo: IInsumoBarRepository;

  beforeEach(() => {
    mockRepo = {
      create: async () => createMockInsumoBar(),
      findAll: async () => [],
      findById: async () => createMockInsumoBar({ stockActual: 50 }),
      findByCodigo: async () => null,
      update: async () => createMockInsumoBar(),
      delete: async () => {},
      createMovimiento: async () => createMockMovimientoBar(),
      findMovimientos: async () => [],
      findMovimientosByInsumo: async () => [],
    };

    useCase = new RegisterMovimientoBarUseCase(mockRepo);
  });

  it("should register entrada movimiento", async () => {
    const input = {
      insumo_id: "test-insumo-bar-id",
      tipo: TipoMovimiento.Entrada,
      cantidad: 10,
      motivo_entrada: MotivoEntrada.Compra,
    };

    const result = await useCase.execute(input);

    expect(result).toBeDefined();
    expect(result.cantidad).toBe(10);
  });

  it("should throw error when insumo not found", async () => {
    mockRepo.findById = async () => null;

    const input = {
      insumo_id: "non-existent-id",
      tipo: TipoMovimiento.Entrada,
      cantidad: 10,
      motivo_entrada: MotivoEntrada.Compra,
    };

    await expect(useCase.execute(input)).rejects.toThrow(InsumoBarException);
  });

  it("should throw error when insufficient stock for salida", async () => {
    mockRepo.findById = async () => createMockInsumoBar({ stockActual: 5 });

    const input = {
      insumo_id: "test-insumo-bar-id",
      tipo: TipoMovimiento.Salida,
      cantidad: 10,
      motivo_salida: MotivoSalida.Consumo,
    };

    await expect(useCase.execute(input)).rejects.toThrow(InsumoBarException);
  });
});