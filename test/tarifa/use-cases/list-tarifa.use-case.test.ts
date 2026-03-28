import { describe, it, expect, beforeEach } from "vitest";
import { ListTarifaUseCase } from "../../../src/application/use-cases/tarifa/list-tarifa.use-case";
import { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import { createMockTarifa } from "../../helpers/tarifa-fixtures";

describe("ListTarifaUseCase", () => {
  let useCase: ListTarifaUseCase;
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

    useCase = new ListTarifaUseCase(mockRepository);
  });

  it("should return list of tarifas", async () => {
    const mockTarifas = [
      createMockTarifa({ id: "id-1", precioNoche: 100.0 }),
      createMockTarifa({ id: "id-2", precioNoche: 150.0 }),
      createMockTarifa({ id: "id-3", precioNoche: 200.0 }),
    ];

    mockRepository.findAll = async () => mockTarifas;

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].precio_noche).toBe(100.0);
    expect(result[1].precio_noche).toBe(150.0);
    expect(result[2].precio_noche).toBe(200.0);
  });

  it("should return empty array when no tarifas exist", async () => {
    mockRepository.findAll = async () => [];

    const result = await useCase.execute();

    expect(result).toHaveLength(0);
  });

  it("should return tarifas with different monedas", async () => {
    const mockTarifas = [
      createMockTarifa({ id: "id-1", moneda: "USD" }),
      createMockTarifa({ id: "id-2", moneda: "EUR" }),
      createMockTarifa({ id: "id-3", moneda: "PEN" }),
    ];

    mockRepository.findAll = async () => mockTarifas;

    const result = await useCase.execute();

    expect(result).toHaveLength(3);
    expect(result[0].moneda).toBe("USD");
    expect(result[1].moneda).toBe("EUR");
    expect(result[2].moneda).toBe("PEN");
  });
});
