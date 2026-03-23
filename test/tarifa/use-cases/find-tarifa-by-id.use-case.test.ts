import { describe, it, expect, beforeEach } from "vitest";
import { FindTarifaByIdUseCase } from "../../../src/application/use-cases/tarifa/find-tarifa-by-id.use-case";
import { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../src/domain/exceptions/tarifa.exception";
import { createMockTarifa } from "../../helpers/tarifa-fixtures";

describe("FindTarifaByIdUseCase", () => {
  let useCase: FindTarifaByIdUseCase;
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
    };

    useCase = new FindTarifaByIdUseCase(mockRepository);
  });

  it("should find tarifa by id successfully", async () => {
    const mockTarifa = createMockTarifa({
      id: "test-id",
      precioNoche: 150.0,
      IVA: 18.0,
    });

    mockRepository.findById = async (id: string) => {
      if (id === "test-id") return mockTarifa;
      return null;
    };

    const result = await useCase.execute("test-id");

    expect(result).toBeDefined();
    expect(result.id).toBe("test-id");
    expect(result.precio_noche).toBe(150.0);
    expect(result.iva).toBe(18.0);
  });

  it("should throw error when tarifa not found", async () => {
    mockRepository.findById = async () => null;

    await expect(useCase.execute("non-existent-id")).rejects.toThrow(TarifaException);
  });

  it("should return tarifa with all fields", async () => {
    const mockTarifa = createMockTarifa({
      id: "test-id",
      precioNoche: 200.0,
      IVA: 18.0,
      cargoServicios: 12.0,
      moneda: "EUR",
    });

    mockRepository.findById = async () => mockTarifa;

    const result = await useCase.execute("test-id");

    expect(result.precio_noche).toBe(200.0);
    expect(result.iva).toBe(18.0);
    expect(result.cargo_servicios).toBe(12.0);
    expect(result.moneda).toBe("EUR");
  });
});
