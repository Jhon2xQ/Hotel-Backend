import { describe, it, expect, beforeEach } from "vitest";
import { UpdateTarifaUseCase } from "../../../src/application/use-cases/tarifa/update-tarifa.use-case";
import { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../src/domain/exceptions/tarifa.exception";
import { createMockTarifa } from "../../helpers/tarifa-fixtures";

describe("UpdateTarifaUseCase", () => {
  let useCase: UpdateTarifaUseCase;
  let mockRepository: ITarifaRepository;

  beforeEach(() => {
    mockRepository = {
      create: async () => createMockTarifa(),
      findAll: async () => [],
      findById: async () => null,
      update: async () => createMockTarifa(),
      delete: async () => {},
      hasRelatedRecords: async () => false,
      findByTipoHabitacionAndCanal: async () => [],
      tipoHabitacionExists: async () => true,
      canalExists: async () => true,
    };

    useCase = new UpdateTarifaUseCase(mockRepository);
  });

  it("should update tarifa successfully", async () => {
    const existingTarifa = createMockTarifa({
      id: "test-id",
      precio: 150.0,
    });

    const updatedTarifa = createMockTarifa({
      id: "test-id",
      precio: 175.0,
      IVA: 20.0,
    });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return existingTarifa;
      return null;
    };

    mockRepository.update = async () => updatedTarifa;

    const result = await useCase.execute("test-id", {
      precio: 175.0,
      iva: 20.0,
    });

    expect(result).toBeDefined();
    expect(result.precio).toBe(175.0);
    expect(result.iva).toBe(20.0);
  });

  it("should throw error when tarifa not found", async () => {
    mockRepository.findById = async () => null;

    await expect(
      useCase.execute("non-existent-id", {
        precio: 200.0,
      }),
    ).rejects.toThrow(TarifaException);
  });

  it("should throw error when precio is zero or negative", async () => {
    const existingTarifa = createMockTarifa({ id: "test-id" });
    mockRepository.findById = async () => existingTarifa;

    await expect(
      useCase.execute("test-id", {
        precio: 0,
      }),
    ).rejects.toThrow(TarifaException);

    await expect(
      useCase.execute("test-id", {
        precio: -100,
      }),
    ).rejects.toThrow(TarifaException);
  });

  it("should update only moneda field", async () => {
    const existingTarifa = createMockTarifa({
      id: "test-id",
      moneda: "USD",
    });

    const updatedTarifa = createMockTarifa({
      id: "test-id",
      moneda: "EUR",
    });

    mockRepository.findById = async () => existingTarifa;
    mockRepository.update = async () => updatedTarifa;

    const result = await useCase.execute("test-id", {
      moneda: "EUR",
    });

    expect(result.moneda).toBe("EUR");
  });
});
