import { describe, it, expect, beforeEach } from "vitest";
import { CreateTarifaUseCase } from "../../../src/application/use-cases/tarifa/create-tarifa.use-case";
import { ITarifaRepository } from "../../../src/domain/interfaces/tarifa.repository.interface";
import { TarifaException } from "../../../src/domain/exceptions/tarifa.exception";
import { TipoHabitacion } from "../../../src/domain/entities/tipo-habitacion.entity";
import { Canal } from "../../../src/domain/entities/canal.entity";
import { createMockTarifa } from "../../helpers/tarifa-fixtures";

describe("CreateTarifaUseCase", () => {
  let useCase: CreateTarifaUseCase;
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

    useCase = new CreateTarifaUseCase(mockRepository);
  });

  it("should create tarifa successfully", async () => {
    const mockTarifa = createMockTarifa({
      precio: 150.0,
      IVA: 18.0,
      cargoServicios: 10.0,
    });

    mockRepository.create = async () => mockTarifa;

    const result = await useCase.execute({
      tipo_habitacion_id: "tipo-id",
      canal_id: "canal-id",
      precio: 150.0,
      iva: 18.0,
      cargo_servicios: 10.0,
    });

    expect(result).toBeDefined();
    expect(result.precio).toBe(150.0);
    expect(result.iva).toBe(18.0);
    expect(result.cargo_servicios).toBe(10.0);
  });

  it("should create tarifa without optional fields", async () => {
    mockRepository.create = async (data) => {
      const now = new Date();
      return createMockTarifa({
        tipoHabitacion: new TipoHabitacion(data.tipoHabitacionId, "Suite", now, now),
        canal: new Canal(data.canalId, "Booking", "OTA", true, null, now, now),
        precio: data.precio,
        IVA: data.IVA ?? null,
        cargoServicios: data.cargoServicios ?? null,
        moneda: data.moneda ?? "USD",
      });
    };

    const result = await useCase.execute({
      tipo_habitacion_id: "tipo-id",
      canal_id: "canal-id",
      precio: 100.0,
    });

    expect(result).toBeDefined();
    expect(result.precio).toBe(100.0);
    expect(result.moneda).toBe("USD");
  });

  it("should throw error when precio is zero or negative", async () => {
    await expect(
      useCase.execute({
        tipo_habitacion_id: "tipo-id",
        canal_id: "canal-id",
        precio: 0,
      }),
    ).rejects.toThrow(TarifaException);

    await expect(
      useCase.execute({
        tipo_habitacion_id: "tipo-id",
        canal_id: "canal-id",
        precio: -50,
      }),
    ).rejects.toThrow(TarifaException);
  });

  it("should create tarifa with custom moneda", async () => {
    const mockTarifa = createMockTarifa({
      moneda: "EUR",
    });

    mockRepository.create = async () => mockTarifa;

    const result = await useCase.execute({
      tipo_habitacion_id: "tipo-id",
      canal_id: "canal-id",
      precio: 150.0,
      moneda: "EUR",
    });

    expect(result.moneda).toBe("EUR");
  });
});
